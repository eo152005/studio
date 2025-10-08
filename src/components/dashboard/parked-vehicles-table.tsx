'use client';

import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const OVERSTAY_HOURS = 24;

function ClientFormattedDate({ date }: { date: Date | string }) {
    const [formattedDate, setFormattedDate] = useState('');
    const [relativeDate, setRelativeDate] = useState('');
  
    useEffect(() => {
      const d = new Date(date);
      setFormattedDate(d.toLocaleString());
      setRelativeDate(formatDistanceToNow(d, { addSuffix: true }));
    }, [date]);
  
    if (!formattedDate) {
      return null;
    }
  
    return (
        <>
            <TableCell>
                {formattedDate}
            </TableCell>
            <TableCell>
                {relativeDate}
                {isOverstayed(new Date(date)) && (
                <Badge variant="destructive" className="ml-2">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Overstay
                </Badge>
                )}
            </TableCell>
        </>
    );
}
  
const isOverstayed = (timeIn: Date) => {
    const hoursParked = (new Date().getTime() - new Date(timeIn).getTime()) / (1000 * 60 * 60);
    return hoursParked > OVERSTAY_HOURS;
};

const VehicleTable = ({ data, onExitClick }: { data: ParkingRecord[], onExitClick: (vehicle: ParkingRecord) => void }) => {
    return (
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
                    <ClientFormattedDate date={vehicle.timeIn} />
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onExitClick(vehicle)}
                      >
                        Exit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No vehicles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
    );
}

export function ParkedVehiclesTable({ data }: { data: ParkingRecord[] }) {
  const [selectedVehicle, setSelectedVehicle] = useState<ParkingRecord | null>(null);
  const overstayedVehicles = data.filter(v => isOverstayed(new Date(v.timeIn)));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Currently Parked Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Vehicles ({data.length})</TabsTrigger>
              <TabsTrigger value="overstaying" className="text-destructive">
                Overstaying ({overstayedVehicles.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <VehicleTable data={data} onExitClick={setSelectedVehicle} />
            </TabsContent>
            <TabsContent value="overstaying">
              <VehicleTable data={overstayedVehicles} onExitClick={setSelectedVehicle} />
            </TabsContent>
          </Tabs>
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
