
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={cn("bg-card", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="p-2 bg-primary/10 rounded-full">
            {icon}
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{value}</h3>
          {trend && (
            <p className={cn(
              "text-sm flex items-center",
              trend.positive ? "text-crypto-green" : "text-crypto-red"
            )}>
              <ArrowUpRight 
                size={14} 
                className={cn("mr-1", !trend.positive && "rotate-180")} 
              />
              {trend.value}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
