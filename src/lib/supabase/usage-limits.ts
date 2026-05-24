import { SupabaseClient } from "@supabase/supabase-js";

export type UserPlan = "free" | "starter" | "pro";

export type UsageLimitResult = {
  allowed: boolean;
  error?: string;
  plan: UserPlan;
  campaignLimit: number;
  monthlyLeadLimit: number;
  perCampaignLeadLimit: number;
  usedCampaignsThisMonth: number;
  usedLeadsThisMonth: number;
  requestedLeads: number;
};

type ProfileLike = {
  plan?: string | null;
  campaign_limit?: number | null;
  monthly_lead_limit?: number | null;
  per_campaign_lead_limit?: number | null;
};

function getMonthStartIso() {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)
  ).toISOString();
}

function normalizePlan(value?: string | null): UserPlan {
  if (value === "starter" || value === "pro") return value;
  return "free";
}

function getDefaults(plan: UserPlan) {
  if (plan === "pro") {
    return {
      campaignLimit: 999999,
      monthlyLeadLimit: 999999,
      perCampaignLeadLimit: 100,
    };
  }

  if (plan === "starter") {
    return {
      campaignLimit: 25,
      monthlyLeadLimit: 500,
      perCampaignLeadLimit: 50,
    };
  }

  return {
    campaignLimit: 3,
    monthlyLeadLimit: 30,
    perCampaignLeadLimit: 10,
  };
}

export async function checkCampaignUsageLimit({
  supabase,
  userId,
  requestedLeads,
}: {
  supabase: SupabaseClient;
  userId: string;
  requestedLeads: number;
}): Promise<UsageLimitResult> {
  const safeRequestedLeads = Math.max(Number(requestedLeads) || 1, 1);

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan,campaign_limit,monthly_lead_limit,per_campaign_lead_limit")
    .eq("user_id", userId)
    .maybeSingle();

  const typedProfile = (profile || {}) as ProfileLike;
  const plan = normalizePlan(typedProfile.plan);
  const defaults = getDefaults(plan);

  const campaignLimit =
    Number(typedProfile.campaign_limit || 0) || defaults.campaignLimit;

  const monthlyLeadLimit =
    Number(typedProfile.monthly_lead_limit || 0) || defaults.monthlyLeadLimit;

  const perCampaignLeadLimit =
    Number(typedProfile.per_campaign_lead_limit || 0) ||
    defaults.perCampaignLeadLimit;

  if (safeRequestedLeads > perCampaignLeadLimit) {
    return {
      allowed: false,
      error: `Your ${plan} plan allows up to ${perCampaignLeadLimit} leads per campaign. Please reduce the lead count or upgrade.`,
      plan,
      campaignLimit,
      monthlyLeadLimit,
      perCampaignLeadLimit,
      usedCampaignsThisMonth: 0,
      usedLeadsThisMonth: 0,
      requestedLeads: safeRequestedLeads,
    };
  }

  const monthStartIso = getMonthStartIso();

  const { data: monthCampaigns, error: usageError } = await supabase
    .from("campaigns")
    .select("id,leads_requested,status,created_at")
    .eq("user_id", userId)
    .gte("created_at", monthStartIso);

  if (usageError) {
    return {
      allowed: false,
      error: usageError.message,
      plan,
      campaignLimit,
      monthlyLeadLimit,
      perCampaignLeadLimit,
      usedCampaignsThisMonth: 0,
      usedLeadsThisMonth: 0,
      requestedLeads: safeRequestedLeads,
    };
  }

  const campaigns = Array.isArray(monthCampaigns) ? monthCampaigns : [];

  // IMPORTANT:
  // Archived campaigns are still counted.
  // This prevents users from deleting/archiving campaigns to reset free usage.
  const usedCampaignsThisMonth = campaigns.length;

  const usedLeadsThisMonth = campaigns.reduce((total, campaign) => {
    return total + (Number(campaign.leads_requested) || 0);
  }, 0);

  if (usedCampaignsThisMonth >= campaignLimit) {
    return {
      allowed: false,
      error: `Your ${plan} plan allows ${campaignLimit} campaigns per month. Archived campaigns still count toward monthly usage.`,
      plan,
      campaignLimit,
      monthlyLeadLimit,
      perCampaignLeadLimit,
      usedCampaignsThisMonth,
      usedLeadsThisMonth,
      requestedLeads: safeRequestedLeads,
    };
  }

  if (usedLeadsThisMonth + safeRequestedLeads > monthlyLeadLimit) {
    return {
      allowed: false,
      error: `Your ${plan} plan allows ${monthlyLeadLimit} leads per month. You have already used ${usedLeadsThisMonth}, so this campaign would exceed your monthly limit.`,
      plan,
      campaignLimit,
      monthlyLeadLimit,
      perCampaignLeadLimit,
      usedCampaignsThisMonth,
      usedLeadsThisMonth,
      requestedLeads: safeRequestedLeads,
    };
  }

  return {
    allowed: true,
    plan,
    campaignLimit,
    monthlyLeadLimit,
    perCampaignLeadLimit,
    usedCampaignsThisMonth,
    usedLeadsThisMonth,
    requestedLeads: safeRequestedLeads,
  };
}