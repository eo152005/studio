import { getParkingHistory, getProducts } from '@/lib/data';
import { ReportsTable } from '@/components/reports/reports-table';
import { Product } from '@/lib/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReportsPage({
  searchParams,
}: {
  searchParams?: {
    product?: string;
  };
}) {
  let history = getParkingHistory();
  const products = getProducts();
  const currentProduct = searchParams?.product;

  if (currentProduct) {
    history = history.filter(item => item.product === currentProduct);
  }

  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ReportsTable data={history} products={products} />
    </Suspense>
  );
}
