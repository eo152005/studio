'use client';

import { useFormStatus } from 'react-dom';
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
import type { ProductCategory } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';


type ProductData = {
    id: ProductCategory;
    name: ProductCategory;
    maxSlots: number;
}

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

export function EntryForm({ products }: { products: ProductData[] }) {
  const [state, dispatch] = useActionState(createEntry, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message && !state.errors) {
        toast({
            variant: 'destructive',
            title: 'Error creating entry',
            description: state.message,
        });
    }
    if (!state?.errors && !state?.message) {
        formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <Collapsible>
        <Card className="mx-auto w-full">
            <CollapsibleTrigger asChild>
                <div className='flex items-center justify-between p-6 cursor-pointer'>
                    <div>
                        <CardTitle>New Vehicle Entry</CardTitle>
                        <CardDescription>
                            Click to add a new vehicle entry slip.
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="w-9 p-0">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <form action={dispatch} ref={formRef}>
                    <CardContent className="space-y-4 pt-0">
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
                </form>
            </CollapsibleContent>
        </Card>
    </Collapsible>
  );
}
