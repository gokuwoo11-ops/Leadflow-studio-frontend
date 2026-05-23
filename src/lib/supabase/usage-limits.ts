import { createServerSupabase } from "@/lib/supabase/server";

export type UsageCheckResult = {
  allowed: boolean;
  error?: string;
  plan: string;
  campaignLimit: number;
  monthlyLeadLimit: number;
  perCampaignLeadLimit: number;
  campaignsUsed: number;
  monthlyLeadsUsed: number;
  leadsRequested: number;
};

export async function checkUsageLimit(leadsRequested: number): Promise<UsageCheckResult> {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      allowed: false,
      error: "You must be logged in.",
      plan: "none",
      campaignLimit: 0,
      monthlyLeadLimit: 0,
      perCampaignLeadLimit: 0,
      campaignsUsed: 0,
      monthlyLeadsUsed: 0,
      leadsRequested,
    };
  }

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    const { data: createdProfile } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        plan: "free",
        campaign_limit: 3,
        monthly_lead_limit: 30,
        per_campaign_lead_limit: 10,
      })
      .select("*")
      .single();

    profile = createdProfile;
  }

  const plan = profile?.plan || "free";
  const campaignLimit = Number(profile?.campaign_limit || 3);
  const monthlyLeadLimit = Number(profile?.monthly_lead_limit || 30);
  const perCampaignLeadLimit = Number(profile?.per_campaign_lead_limit || 10);

  const requested = Math.max(Number(leadsRequested || 0), 0);

  if (requested > perCampaignLeadLimit) {
    return {
      allowed: false,
      error: `Your ${plan} plan allows up to ${perCampaignLeadLimit} leads per campaign. Please reduce the lead count or upgrade.`,
      plan,
      campaignLimit,
      monthlyLeadLimit,
      perCampaignLeadLimit,
      campaignsUsed: 0,
      monthlyLeadsUsed: 0,
      leadsRequested: requested,
    };
  }

  const { count: campaignsUsedCount } = await supabase
    .from("campaigns")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const campaignsUsed = campaignsUsedCount || 0;

  if (campaignsUsed >= campaignLimit) {
    return {
      allowed: false,
      error: `Your ${plan} plan allows ${campaignLimit} campaigns. Please delete an old campaign or upgrade.`,
      plan,
      campaignLimit,
      monthlyLeadLimit,
      perCampaignLeadLimit,
      campaignsUsed,
      monthlyLeadsUsed: 0,
      leadsRequested: requested,
    };
  }

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const { data: monthlyCampaigns } = await supabase
    .from("campaigns")
    .select("leads_requested")
    .eq("user_id", user.id)
    .gte("created_at", monthStart.toISOString());

  const monthlyLeadsUsed = Array.isArray(monthlyCampaigns)
    ? monthlyCampaigns.reduce(
        (sum, campaign) => sum + Number(campaign.leads_requested || 0),
        0
      )
    : 0;

  if (monthlyLeadsUsed + requested > monthlyLeadLimit) {
    return {
      allowed: false,
      error: `Your ${plan} plan has ${monthlyLeadLimit} monthly leads. You already used ${monthlyLeadsUsed}. Reduce this campaign to ${
        monthlyLeadLimit - monthlyLeadsUsed
      } leads or upgrade.`,
      plan,
      campaignLimit,
      monthlyLeadLimit,
      perCampaignLeadLimit,
      campaignsUsed,
      monthlyLeadsUsed,
      leadsRequested: requested,
    };
  }

  return {
    allowed: true,
    plan,
    campaignLimit,
    monthlyLeadLimit,
    perCampaignLeadLimit,
    campaignsUsed,
    monthlyLeadsUsed,
    leadsRequested: requested,
  };
}