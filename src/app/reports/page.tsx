import { getParkingHistory, getProducts } from '@/lib/data';
import { ReportsTable } from '@/components/reports/reports-table';
import { Product } from '@/lib/types';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { isSameMonth, isSameYear, parseISO } from 'date-fns';

export default function ReportsPage({
  searchParams,
}: {
  searchParams?: {
    product?: string;
    month?: string;
    year?: string;
  };
}) {
  let history = getParkingHistory();
  const products = getProducts();
  const currentProduct = searchParams?.product;
  const currentMonth = searchParams?.month;
  const currentYear = searchParams?.year;

  if (currentProduct && currentProduct !== 'all') {
    history = history.filter(item => item.product === currentProduct);
  }

  if (currentYear) {
    const yearNum = parseInt(currentYear);
    history = history.filter(item => new Date(item.timeIn).getFullYear() === yearNum);
  }
  
  if (currentMonth && currentYear) {
    const yearNum = parseInt(currentYear);
    const monthNum = parseInt(currentMonth);
    history = history.filter(item => {
        const itemDate = new Date(item.timeIn);
        return itemDate.getFullYear() === yearNum && itemDate.getMonth() === monthNum;
    });
  }


  const productData = products.map(({ icon, iconName, ...rest }) => rest);

  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ReportsTable data={history} products={productData} />
    </Suspense>
  );
}
