export interface SalaryRange {
    role: string;
    min: number;
    max: number;
    median: number;
    location?: string;
}

export interface IndustryInsightData {
    industry: string;
    salaryRange: SalaryRange[];
    growthRate: number;
    demandLevel: "HIGH" | "MEDIUM" | "LOW";
    topSkills: string[];
    marketOutlook: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
    keyTrends: string[];
    recommendedSkills: string[];
    lastUpdated: Date;
    nextUpdate: Date;
}
