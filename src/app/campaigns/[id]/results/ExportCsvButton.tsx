"use client";

type ResultItem = {
  lead?: any;
  analysis?: any;
  outreach?: any;
  report?: any;
};

function escapeCsv(value: any) {
  if (value === null || value === undefined) return "";
  const str = String(value).replaceAll('"', '""');
  return `"${str}"`;
}

export default function ExportCsvButton({ results }: { results: ResultItem[] }) {
  function exportCsv() {
    if (!results.length) {
      alert("No results available to export.");
      return;
    }

    const headers = [
      "Business Name",
      "Phone",
      "Email",
      "Website",
      "Google Maps URL",
      "Score",
      "Quality",
      "Best Channel",
      "Lead Status",
      "Processing Status",
      "Outreach Subject",
      "Outreach Body",
      "PDF URL",
    ];

    const rows = results.map((item) => {
      const lead = item.lead || {};
      const analysis = item.analysis || {};
      const outreach = item.outreach || {};
      const report = item.report || {};

      return [
        lead.business_name,
        lead.phone,
        lead.email,
        lead.website,
        lead.google_maps_url,
        analysis.lead_score,
        analysis.lead_quality,
        analysis.best_outreach_channel,
        lead.status || "New",
        lead.processing_status,
        outreach.subject,
        outreach.email_body,
        report.pdf_url,
      ].map(escapeCsv);
    });

    const csv = [headers.map(escapeCsv), ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "leadflow-results.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={exportCsv}
      className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
    >
      Export CSV
    </button>
  );
}