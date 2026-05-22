import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || "https://pdf-api-bw6a.onrender.com";

function safeParseJSON(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function escapePdfText(value: string) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function getPdfLines(lead: any, campaign: any, analysis: any, outreach: any) {
  const lines = [
    "Lead Audit Report",
    "",
    `Business: ${lead.business_name || "Unknown"}`,
    `Website: ${lead.website || "Not provided"}`,
    `Email: ${lead.email || "Not provided"}`,
    `Phone: ${lead.phone || "Not provided"}`,
    `Location: ${lead.address || campaign.target_location || "Not provided"}`,
    "",
    `Campaign: ${campaign.client_business_name || campaign.campaign_name || "Untitled campaign"}`,
    `Service offer: ${campaign.service_offer || campaign.service_offered || "Not provided"}`,
    "",
    `Lead score: ${analysis.lead_score ?? analysis.score ?? "N/A"}`,
    `Quality: ${analysis.lead_quality ?? analysis.quality ?? "N/A"}`,
    `Best outreach channel: ${analysis.best_outreach_channel ?? analysis.channel ?? "N/A"}`,
    "",
    `Personalization angle: ${analysis.personalization_angle || "Not available"}`,
    `Problems found: ${analysis.problems_found || "Not available"}`,
    "",
    `Outreach subject: ${outreach.subject || outreach.email_subject || outreach.title || "Not available"}`,
    `Opening line: ${outreach.opening_line || outreach.intro || "Not available"}`,
    "",
    `Message: ${outreach.email_body || outreach.outreach_body || outreach.message || "Not available"}`,
    "",
    `Call to action: ${outreach.call_to_action || outreach.cta || outreach.next_step || "Not available"}`,
  ]; 
  return lines;
}

function buildPdfBuffer(lines: string[]) {
  const safeLines = lines.map((line) => escapePdfText(line));
  const contentLines = [
    "BT",
    "/F1 12 Tf",
    "50 760 Td",
    safeLines.map((line, index) => {
      const operator = index === 0 ? "Tj" : "T* Tj";
      return `(${line}) ${operator}`;
    }).join("\n"),
    "ET",
  ].join("\n");

  const encoder = new TextEncoder();
  const contentBytes = encoder.encode(contentLines);
  const stream = `<< /Length ${contentBytes.length} >>\nstream\n${contentLines}\nendstream`;

  const objects = [
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj`,
    `4 0 obj\n${stream}\nendobj`,
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`,
  ];

  let offset = 0;
  const header = "%PDF-1.3\n";
  offset += encoder.encode(header).length;

  const xrefItems = ["0000000000 65535 f "]; 
  const bodyParts: string[] = [];

  for (const object of objects) {
    const objectBytes = encoder.encode(object + "\n");
    xrefItems.push(String(offset).padStart(10, "0") + " 00000 n ");
    bodyParts.push(object);
    offset += objectBytes.length;
  }

  const body = bodyParts.join("\n") + "\n";
  const xrefStart = encoder.encode(header + body).length;
  const xref = `xref\n0 ${objects.length + 1}\n${xrefItems.join("\n")}\n`;
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  const fullPdf = header + body + xref + trailer;
  return encoder.encode(fullPdf);
}

function normalizeText(value: any) {
  return String(value ?? "").trim();
}

function buildAnalysis(lead: any, campaign: any) {
  const email = normalizeText(lead.email);
  const phone = normalizeText(lead.phone);
  const website = normalizeText(lead.website);
  const instagram = normalizeText(lead.instagram_url);
  const notes = normalizeText(lead.notes);
  const businessName = normalizeText(lead.business_name) || "this business";
  const serviceOffer = normalizeText(campaign?.service_offer || campaign?.service_offered || "your service");
  const location = normalizeText(campaign?.target_location || campaign?.location || "your target market");

  const contactScore = [email, phone, website, instagram].filter(Boolean).length;
  const score = Math.min(100, 50 + contactScore * 10 + (notes ? 5 : 0));
  const quality = score >= 80 ? "High" : score >= 60 ? "Medium" : "Low";
  const channel = email ? "Email" : phone ? "Phone" : website ? "Website" : instagram ? "Social" : "Unknown";

  const problems: string[] = [];
  if (!email) problems.push("No direct email address");
  if (!phone) problems.push("No phone number");
  if (!website) problems.push("No website listed");
  if (!instagram) problems.push("No social profile available");

  const personalization = `Highlight how ${serviceOffer} can help ${businessName} win more customers in ${location}. Use their current online presence to make outreach feel specific and timely.`;

  return {
    lead_id: lead.id,
    lead_score: score,
    lead_quality: quality,
    best_outreach_channel: channel,
    personalization_angle: personalization,
    problems_found: problems.length ? problems.join("; ") : "No obvious issues found.",
  };
}

function buildOutreach(lead: any, campaign: any) {
  const businessName = normalizeText(lead.business_name) || "there";
  const serviceOffer = normalizeText(campaign?.service_offer || campaign?.service_offered || "your service");
  const location = normalizeText(campaign?.target_location || campaign?.location || "your market");
  const targetCustomer = normalizeText(campaign?.ideal_target_customer || campaign?.target_business || campaign?.targetBusiness || "your ideal customers");

  return {
    lead_id: lead.id,
    subject: `Growth audit for ${businessName}`,
    opening_line: `Hi ${businessName}, I reviewed your business and had a quick idea to help you reach more ${targetCustomer} in ${location}.`,
    email_body: `I specialize in helping companies like ${businessName} improve ${serviceOffer} and turn local demand into consistent leads. Based on what I found, a more targeted outreach sequence and a polished audit report would make your offer stand out.`,
    call_to_action: `Would you be open to a short 15-minute review call next week?`,
  };
}

function buildReportPath(campaignId: string, leadId: string) {
  return `reports/${campaignId}/${leadId}.pdf`;
}

async function processCampaignLeads(campaignId: string, responseData: any) {
  const supabase = await createServerSupabase();

  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .maybeSingle();

  if (campaignError) {
    console.error("[Run Campaign Processor] campaign fetch error", campaignError);
    return { error: campaignError.message };
  }

  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .eq("campaign_id", campaignId);

  if (leadsError) {
    console.error("[Run Campaign Processor] leads fetch error", leadsError);
    return { error: leadsError.message };
  }

  const leadIds = Array.isArray(leads) ? leads.map((lead) => lead.id).filter(Boolean) : [];
  if (!leadIds.length) {
    return { processedLeads: 0, message: "No leads available to process." };
  }

  const [existingReports, existingAnalyses, existingOutreach] = await Promise.all([
    supabase.from("reports").select("lead_id").in("lead_id", leadIds),
    supabase.from("lead_analyses").select("lead_id").in("lead_id", leadIds),
    supabase.from("outreach_messages").select("lead_id").in("lead_id", leadIds),
  ]);

  const reportIds = new Set(Array.isArray(existingReports.data) ? existingReports.data.map((row: any) => row.lead_id) : []);
  const analysisIds = new Set(Array.isArray(existingAnalyses.data) ? existingAnalyses.data.map((row: any) => row.lead_id) : []);
  const outreachIds = new Set(Array.isArray(existingOutreach.data) ? existingOutreach.data.map((row: any) => row.lead_id) : []);

  let createdReports = 0;
  let createdAnalyses = 0;
  let createdOutreach = 0;
  let processedLeads = 0;

  for (const lead of leads) {
    if (!lead?.id) continue;
    const leadId = lead.id;
    console.log(`[Run Campaign Processor] processing lead ${leadId}`);

    const analysis = analysisIds.has(leadId) ? null : buildAnalysis(lead, campaign);
    const outreach = outreachIds.has(leadId) ? null : buildOutreach(lead, campaign);

    if (analysis) {
      const { error: insertError } = await supabase.from("lead_analyses").insert(analysis);
      if (insertError) {
        console.error(`[Run Campaign Processor] analysis insert error for lead ${leadId}`, insertError);
      } else {
        console.log(`[Run Campaign Processor] analysis insert success for lead ${leadId}`);
        createdAnalyses += 1;
      }
    } else {
      console.log(`[Run Campaign Processor] analysis row already exists for lead ${leadId}`);
    }

    if (outreach) {
      const { error: insertError } = await supabase.from("outreach_messages").insert(outreach);
      if (insertError) {
        console.error(`[Run Campaign Processor] outreach insert error for lead ${leadId}`, insertError);
      } else {
        console.log(`[Run Campaign Processor] outreach insert success for lead ${leadId}`);
        createdOutreach += 1;
      }
    } else {
      console.log(`[Run Campaign Processor] outreach row already exists for lead ${leadId}`);
    }

    if (!reportIds.has(leadId)) {
      try {
        const pdfLines = getPdfLines(lead, campaign, analysis || {}, outreach || {});
        const pdfBytes = buildPdfBuffer(pdfLines);
        const objectName = buildReportPath(campaignId, leadId);

        const { error: uploadError } = await supabase.storage
          .from("pdf-reports")
          .upload(objectName, pdfBytes, {
            contentType: "application/pdf",
            upsert: true,
          });

        if (uploadError) {
          console.error(`[Run Campaign Processor] pdf upload error for lead ${leadId}`, uploadError);
        } else {
          const { data: publicData, error: publicUrlError } = await supabase.storage
            .from("pdf-reports")
            .getPublicUrl(objectName);

          if (publicUrlError) {
            console.error(`[Run Campaign Processor] pdf public url error for lead ${leadId}`, publicUrlError);
          } else {
            const publicUrl = publicData?.publicUrl || "";
            const reportRow = {
              lead_id: leadId,
              pdf_url: publicUrl,
              storage_bucket: "pdf-reports",
            };
            const { error: insertError } = await supabase.from("reports").insert(reportRow);
            if (insertError) {
              console.error(`[Run Campaign Processor] report insert error for lead ${leadId}`, insertError);
            } else {
              console.log(`[Run Campaign Processor] report insert success for lead ${leadId}`);
              createdReports += 1;
            }
          }
        }
      } catch (error) {
        console.error(`[Run Campaign Processor] pdf generation error for lead ${leadId}`, error);
      }
    } else {
      console.log(`[Run Campaign Processor] report row already exists for lead ${leadId}`);
    }

    const { error: updateError } = await supabase
      .from("leads")
      .update({ processing_status: "processed" })
      .eq("id", leadId);

    if (updateError) {
      console.error(`[Run Campaign Processor] lead status update error for lead ${leadId}`, updateError);
    }

    processedLeads += 1;
  }

  return {
    createdReports,
    createdAnalyses,
    createdOutreach,
    processedLeads,
  };
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing campaign id" }, { status: 400 });
    }

    const requestBody = await request.text();
    const parsedBody = safeParseJSON(requestBody) ?? {};
    const searchQuery =
      parsedBody.search_query ??
      parsedBody.lead_search_keyword ??
      parsedBody.leadSearchKeyword ??
      parsedBody.searchKeyword ??
      "";
    const maxResults =
      parsedBody.max_results ??
      parsedBody.maxResults ??
      parsedBody.lead_count ??
      parsedBody.leads_requested ??
      20;
    const forwardedBody = {
      ...parsedBody,
      campaign_id: id,
      campaignId: id,
      max_results: maxResults,
      maxResults,
      lead_count: parsedBody.lead_count ?? parsedBody.leads_requested ?? 20,
      leadCount:
        parsedBody.leadCount ?? parsedBody.lead_count ?? parsedBody.leads_requested ?? 20,
      leads_requested: parsedBody.leads_requested ?? parsedBody.lead_count ?? 20,
      search_query: searchQuery,
      searchKeyword: searchQuery,
      lead_search_keyword:
        parsedBody.lead_search_keyword ?? parsedBody.leadSearchKeyword ?? "",
      leadSearchKeyword:
        parsedBody.leadSearchKeyword ?? parsedBody.lead_search_keyword ?? "",
      service_offered:
        parsedBody.service_offered ?? parsedBody.service_offer ?? "",
      serviceOffered:
        parsedBody.serviceOffered ?? parsedBody.service_offer ?? "",
      location: parsedBody.location ?? parsedBody.target_location ?? "",
      target_location: parsedBody.target_location ?? parsedBody.location ?? "",
      target_business:
        parsedBody.target_business ?? parsedBody.targetBusiness ?? "",
      targetBusiness:
        parsedBody.targetBusiness ?? parsedBody.target_business ?? "",
    };

    console.log("[Run Campaign Proxy] campaignId", id);
    console.log("[Run Campaign Proxy] incoming request body", {
      raw: requestBody,
      parsed: parsedBody,
    });
    console.log("[Run Campaign Proxy] forwarded run payload", forwardedBody);
    if (searchQuery) {
      console.log("[Run Campaign Proxy] search query for lead discovery", searchQuery);
    }

    const response = await fetch(`${BACKEND_URL}/campaigns/${encodeURIComponent(id)}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(forwardedBody),
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") || "";
    const responseText = await response.clone().text();
    const responseData = safeParseJSON(responseText) ?? responseText;

    console.log("[Run Campaign Proxy] backend response", {
      status: response.status,
      contentType,
      body: responseData,
    });

    let localProcessingResult: any = {};
    try {
      localProcessingResult = await processCampaignLeads(id, responseData);
      console.log("[Run Campaign Processor] result", localProcessingResult);
    } catch (processError) {
      console.error("[Run Campaign Processor] unexpected error", processError);
      localProcessingResult = { error: processError instanceof Error ? processError.message : String(processError) };
    }

    if (typeof responseData === "object" && responseData !== null) {
      const rawLeadsCount =
        Array.isArray((responseData as any).raw_leads)
          ? (responseData as any).raw_leads.length
          : typeof (responseData as any).raw_leads === "number"
          ? (responseData as any).raw_leads
          : Array.isArray((responseData as any).results)
          ? (responseData as any).results.length
          : undefined;
      if (rawLeadsCount !== undefined) {
        console.log("[Run Campaign Proxy] raw leads found", rawLeadsCount);
      }
      if ((responseData as any).supabase_error) {
        console.error("[Run Campaign Proxy] Supabase insert error", (responseData as any).supabase_error);
      }
    }

    if (contentType.includes("application/json")) {
      const data = typeof responseData === "string" ? { success: false, error: responseData } : responseData;
      return NextResponse.json(
        {
          ...data,
          local_processing: localProcessingResult,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Backend returned non-JSON response",
        details: (responseText || "").slice(0, 200),
        local_processing: localProcessingResult,
      },
      { status: response.status >= 400 ? response.status : 502 }
    );
  } catch (error) {
    console.error("[Run Campaign Proxy] error", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to start campaign",
      },
      { status: 500 }
    );
  }
}
