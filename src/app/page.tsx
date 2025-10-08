import { getParkedVehicles, getProducts, getParkedCountByProduct } from '@/lib/data';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ParkedVehiclesTable } from '@/components/dashboard/parked-vehicles-table';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const products = getProducts();
  const productStats = products.map(product => ({
    ...product,
    current: getParkedCountByProduct(product.id),
  }));

  const parkedVehicles = getParkedVehicles();

  return (
    <div className="space-y-6">
      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards stats={productStats} />
      </Suspense>
      
      <Suspense fallback={<TableSkeleton />}>
        <ParkedVehiclesTable data={parkedVehicles} />
      </Suspense>
    </div>
  );
}

function StatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-[140px] w-full" />
            ))}
        </div>
    );
}

function TableSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
    );
}
