"use client";
import { Assessment } from "@prisma/client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Define minimal chart configuration
const chartConfig = {
  date: {
    label: "Date",
    color: "var(--chart-2)",
  },
  score: {
    label: "Score",
    color: "var(--primary)",
  },
};

export default function PerformanceChart({
  assessments,
}: {
  assessments: Assessment[];
}) {
  const [chartData, setChartData] = useState<{ date: string; score: number }[]>(
    []
  );

  useEffect(() => {
    console.log("Assessments:", assessments); // Debugging
    if (assessments?.length) {
      const formattedData = assessments.map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: parseFloat(assessment.quizScore.toFixed(2)),
      }));
      console.log("Formatted Chart Data:", formattedData);
      setChartData(formattedData);
    }
  }, [assessments]);

  return (
    <div className="w-full min-h-[350px] relative">
      <Card className="w-full min-h-[350px]">
        <CardHeader>
          <CardTitle className="text-gradient text-2xl md:text-3xl">
            Performance Trend
          </CardTitle>
          <CardDescription>Your quiz scores over time</CardDescription>
        </CardHeader>
        <CardContent className="relative overflow-hidden w-full h-[300px]">
          <ChartContainer
            config={chartConfig}
            className="relative w-full h-[300px]"
          >
            <LineChart
              width={0} // Auto-resize using responsive wrapper
              height={300}
              data={chartData}
              margin={{ top: 22, left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="score"
                type="monotone"
                stroke={chartConfig.score.color}
                strokeWidth={2}
              >
                <LabelList
                  dataKey="score"
                  position="top"
                  offset={12}
                  fontSize={12}
                />
              </Line>
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
