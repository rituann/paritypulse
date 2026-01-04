import { useQuery } from "@tanstack/react-query";
import { Briefcase, TrendingUp, Users, FileText } from "lucide-react";
import type { ShadowPriceResult } from "@shared/schema";

interface ConsultantBriefProps {
  country: ShadowPriceResult;
}

interface BriefData {
  economicOpportunity: string;
  laborRisks: string;
  policyImplications: string;
}

export function ConsultantBrief({ country }: ConsultantBriefProps) {
  const briefQuery = useQuery<BriefData>({
    queryKey: ["/api/consultant-brief", country.countryCode],
    queryFn: async () => {
      const response = await fetch("/api/consultant-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countryName: country.countryName,
          shadowPriceIndex: country.shadowPriceIndex,
          basketCost: country.basketCost,
          adjustedCost: country.adjustedCost,
          workHours: country.workHours,
          macroStability: country.macroStability,
          annualWage: country.annualWage,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch consultant brief");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return (
    <div className="space-y-4" data-testid="consultant-brief">
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Consultant's Brief
      </h3>

      {briefQuery.isLoading ? (
        <div className="space-y-3">
          <div className="p-3 rounded bg-muted/30 border border-border">
            <div className="h-4 w-full shimmer rounded" />
          </div>
          <div className="p-3 rounded bg-muted/30 border border-border">
            <div className="h-4 w-full shimmer rounded" />
          </div>
          <div className="p-3 rounded bg-muted/30 border border-border">
            <div className="h-4 w-full shimmer rounded" />
          </div>
        </div>
      ) : briefQuery.isError ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Unable to generate brief at this time.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="p-3 rounded bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wide text-green-700 dark:text-green-400 font-medium mb-1">
                  Economic Opportunity
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {briefQuery.data?.economicOpportunity}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
            <div className="flex items-start gap-2">
              <Users className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400 font-medium mb-1">
                  Labor Risks
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {briefQuery.data?.laborRisks}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
            <div className="flex items-start gap-2">
              <Briefcase className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-400 font-medium mb-1">
                  Policy Implications
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {briefQuery.data?.policyImplications}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
