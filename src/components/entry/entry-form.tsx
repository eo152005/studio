'use client';

import { useFormState, useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { createEntry } from '@/lib/actions';
import type { Product } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  message: null,
  errors: {},
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Entry Slip
        </Button>
    );
}

export function EntryForm({ products }: { products: Product[] }) {
  const [state, dispatch] = useFormState(createEntry, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message && !state.errors) {
        toast({
            variant: 'destructive',
            title: 'Error creating entry',
            description: state.message,
        });
    }
  }, [state, toast]);

  return (
    <form action={dispatch}>
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>New Vehicle Entry</CardTitle>
          <CardDescription>
            Enter truck details to generate an entry slip.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="truckNumber">Truck Number</Label>
            <Input 
                id="truckNumber" 
                name="truckNumber" 
                placeholder="e.g., MH04AB1234" 
                required 
            />
            {state?.errors?.truckNumber && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.truckNumber[0]}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select name="product" required>
              <SelectTrigger id="product">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {state?.errors?.product && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.product[0]}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
