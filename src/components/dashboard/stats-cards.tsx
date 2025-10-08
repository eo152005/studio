'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getProductById } from "@/lib/data";

type ProductStat = {
  id: string;
  name: string;
  maxSlots: number;
  current: number;
};

interface StatsCardsProps {
  stats: ProductStat[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {stats.map((stat) => {
        const usage = (stat.current / stat.maxSlots) * 100;
        const product = getProductById(stat.id);
        const Icon = product?.icon;
        return (
          <Card key={stat.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.current} / {stat.maxSlots}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.maxSlots - stat.current} slots available
              </p>
              <Progress value={usage} className="mt-4 h-2" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
