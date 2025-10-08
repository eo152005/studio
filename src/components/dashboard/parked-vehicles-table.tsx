'use client';

import { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ParkingRecord } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ExitDialog } from './exit-dialog';
import { AlertCircle } from 'lucide-react';

const OVERSTAY_HOURS = 24;

export function ParkedVehiclesTable({ data }: { data: ParkingRecord[] }) {
  const [selectedVehicle, setSelectedVehicle] = useState<ParkingRecord | null>(null);

  const isOverstayed = (timeIn: Date) => {
    const hoursParked = (new Date().getTime() - new Date(timeIn).getTime()) / (1000 * 60 * 60);
    return hoursParked > OVERSTAY_HOURS;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Currently Parked Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token No.</TableHead>
                <TableHead>Truck No.</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((vehicle) => (
                  <TableRow key={vehicle.id} className={isOverstayed(new Date(vehicle.timeIn)) ? 'bg-destructive/10' : ''}>
                    <TableCell className="font-medium">{vehicle.id}</TableCell>
                    <TableCell>{vehicle.truckNumber}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{vehicle.product}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(vehicle.timeIn).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(vehicle.timeIn), { addSuffix: true })}
                      {isOverstayed(new Date(vehicle.timeIn)) && (
                        <Badge variant="destructive" className="ml-2">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Overstay
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVehicle(vehicle)}
                      >
                        Exit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No vehicles currently parked.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedVehicle && (
        <ExitDialog
          vehicle={selectedVehicle}
          open={!!selectedVehicle}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedVehicle(null);
            }
          }}
        />
      )}
    </>
  );
}
