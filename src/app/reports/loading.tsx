import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-44" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}
