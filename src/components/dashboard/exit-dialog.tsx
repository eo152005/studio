'use client';

import { useTransition } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createExit } from '@/lib/actions';
import type { ParkingRecord } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';

interface ExitDialogProps {
  vehicle: ParkingRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExitDialog({ vehicle, open, onOpenChange }: ExitDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleExit = () => {
    startTransition(async () => {
      const result = await createExit(vehicle.id);
      if (result.success) {
        toast({
          title: 'Success',
          description: `Vehicle ${vehicle.truckNumber} checked out.`,
        });
        onOpenChange(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message,
        });
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Vehicle Exit</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to check out vehicle{' '}
            <span className="font-bold">{vehicle.truckNumber}</span>? This action will generate the exit slip.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="p-4 my-4 text-sm border rounded-lg bg-muted/50">
            <p><strong>Token No:</strong> {vehicle.id}</p>
            <p><strong>Truck No:</strong> {vehicle.truckNumber}</p>
            <p><strong>Product:</strong> {vehicle.product}</p>
            <p><strong>Time In:</strong> {new Date(vehicle.timeIn).toLocaleString()}</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
          <Button onClick={handleExit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Exit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
