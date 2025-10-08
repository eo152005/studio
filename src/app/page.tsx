import { getParkedVehicles, getProducts, getParkedCountByProduct } from '@/lib/data';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ParkedVehiclesTable } from '@/components/dashboard/parked-vehicles-table';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { EntryForm } from '@/components/entry/entry-form';

export default function DashboardPage() {
  const products = getProducts();
  const parkedVehicles = getParkedVehicles();
  const totalCapacity = products.reduce((acc, p) => acc + p.maxSlots, 0);

  const productStats = [
    {
      id: 'total',
      name: 'Total Vehicles',
      maxSlots: totalCapacity,
      current: parkedVehicles.length,
      iconName: 'Truck'
    },
    ...products.map(product => ({
      id: product.id,
      name: product.name,
      maxSlots: product.maxSlots,
      current: getParkedCountByProduct(product.id),
      iconName: product.iconName,
    }))
  ];

  const productData = products.map(({ icon, iconName, ...rest }) => rest);

  return (
    <div className="space-y-6">
      <EntryForm products={productData} />

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
