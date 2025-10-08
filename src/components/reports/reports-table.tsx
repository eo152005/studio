'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ParkingRecord, ProductCategory } from '@/lib/types';
import { Download } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { getYear, getMonth } from 'date-fns';

type ProductData = {
    id: ProductCategory;
    name: ProductCategory;
    maxSlots: number;
};

function ClientFormattedDate({ date }: { date: Date | string | undefined }) {
  const [formattedDate, setFormattedDate] = useState('N/A');

  useEffect(() => {
    if (date) {
      setFormattedDate(new Date(date).toLocaleString());
    }
  }, [date]);

  return <>{formattedDate}</>;
}


export function ReportsTable({ data, products }: { data: ParkingRecord[]; products: ProductData[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (filterType: 'product' | 'year' | 'month', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(filterType, value);
    } else {
      params.delete(filterType);
    }

    if (filterType === 'year' && value === 'all') {
        params.delete('month');
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const availableYears = Array.from(new Set(data.map(item => getYear(new Date(item.timeIn)).toString()))).sort((a,b) => parseInt(b) - parseInt(a));
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const selectedYear = searchParams.get('year');

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle>Parking History Reports</CardTitle>
                <CardDescription>View and export historical parking data.</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <Select onValueChange={(v) => handleFilterChange('product', v)} defaultValue={searchParams.get('product') || 'all'}>
                    <SelectTrigger className='w-full sm:w-auto md:w-[150px]'>
                        <SelectValue placeholder="Filter by product" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select onValueChange={(v) => handleFilterChange('year', v)} defaultValue={searchParams.get('year') || 'all'}>
                    <SelectTrigger className='w-full sm:w-auto md:w-[120px]'>
                        <SelectValue placeholder="Filter by Year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {availableYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select onValueChange={(v) => handleFilterChange('month', v)} defaultValue={searchParams.get('month') || 'all'} disabled={!selectedYear || selectedYear === 'all'}>
                    <SelectTrigger className='w-full sm:w-auto md:w-[150px]'>
                        <SelectValue placeholder="Filter by Month" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Months</SelectItem>
                        {months.map((m, i) => <SelectItem key={m} value={i.toString()}>{m}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button variant="outline" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token No.</TableHead>
              <TableHead>Truck No.</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Time In</TableHead>
              <TableHead>Time Out</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.id}</TableCell>
                  <TableCell>{vehicle.truckNumber}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{vehicle.product}</Badge>
                  </TableCell>
                  <TableCell><ClientFormattedDate date={vehicle.timeIn} /></TableCell>
                  <TableCell><ClientFormattedDate date={vehicle.timeOut} /></TableCell>
                  <TableCell>{vehicle.duration || 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No historical records found for the selected filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
