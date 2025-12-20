"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { decrypt } from "@/lib/crypto";
import { ProverbJson } from "@/lib/types";

interface DatasetExportProps {
  userBridge?: {
    id: string;
    culture: string;
    emotion: string;
    insight: string;
  };
}

export function DatasetExport({ userBridge }: DatasetExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      // Fetch 50 seeds
      const { data: seeds } = await supabase
        .from("bridges")
        .select("*")
        .limit(50);

      if (!seeds) return;

      // Prepare CSV content
      const headers = ["Bridge ID", "Culture", "Theme/Insight", "Timestamp"];
      const rows = seeds.map((seed) => {
        let insight = "Protected";
        try {
            const json = seed.proverb_json as ProverbJson;
            // Try to extract theme or insight tease
            insight = json.insight_tease || json.options[0]?.reframe || "Archived";
        } catch (e) {}

        return [
          seed.id,
          seed.culture,
          `"${insight.replace(/"/g, '""')}"`, // Escape quotes
          seed.created_at
        ];
      });

      // Append user's bridge if provided
      if (userBridge) {
        rows.unshift([
          userBridge.id,
          userBridge.culture,
          `"${userBridge.insight.replace(/"/g, '""')}"`,
          new Date().toISOString()
        ]);
      }

      const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
      ].join("\n");

      // Trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `kintsu_decolonized_dataset_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full flex justify-center pt-4">
      <button
        onClick={handleExport}
        disabled={isGenerating}
        className="group flex items-center gap-2 px-6 py-3 bg-sage/10 hover:bg-sage/20 rounded-lg transition-colors"
      >
        <FileText className="w-4 h-4 text-sage" />
        <span className="font-sans text-sm font-medium text-sage">
          {isGenerating ? "Weaving dataset..." : "Export decolonize dataset"}
        </span>
        <Download className="w-3 h-3 text-sage opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
}
