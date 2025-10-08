'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { addParkingRecord, completeParkingRecord } from './data';
import type { ProductCategory } from './types';

const EntrySchema = z.object({
  truckNumber: z.string().min(4, "Truck number is required."),
  product: z.string().min(1, "Product is required."),
});

export async function createEntry(prevState: any, formData: FormData) {
  const validatedFields = EntrySchema.safeParse({
    truckNumber: formData.get('truckNumber'),
    product: formData.get('product'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid data provided.',
    };
  }
  
  const { truckNumber, product } = validatedFields.data;
  const result = addParkingRecord(truckNumber, product as ProductCategory);

  if (!result.success) {
    return {
      message: result.message,
    };
  }
  
  revalidatePath('/');
  return {
    errors: null,
    message: null,
  }
}

export async function createExit(id: string) {
    const result = completeParkingRecord(id);
    if (result.success) {
        revalidatePath('/');
        revalidatePath('/reports');
    }
    return result;
}
