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
import type { ParkingRecord, Product } from '@/lib/types';
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

function ClientFormattedDate({ date }: { date: Date | string | undefined }) {
  const [formattedDate, setFormattedDate] = useState('N/A');

  useEffect(() => {
    if (date) {
      setFormattedDate(new Date(date).toLocaleString());
    }
  }, [date]);

  return <>{formattedDate}</>;
}


export function ReportsTable({ data, products }: { data: ParkingRecord[]; products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set('product', value);
    } else {
      params.delete('product');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <CardTitle>Parking History Reports</CardTitle>
                <CardDescription>View and export historical parking data.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Select onValueChange={handleFilterChange} defaultValue={searchParams.get('product') || 'all'}>
                    <SelectTrigger className='w-full md:w-[180px]'>
                        <SelectValue placeholder="Filter by product" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
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
