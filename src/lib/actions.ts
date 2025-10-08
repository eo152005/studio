'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { addParkingRecord, completeParkingRecord, getParkingHistory } from './data';
import type { ProductCategory } from './types';
import { predictParkingDemand } from '@/ai/flows/predict-parking-demand';

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
  revalidatePath('/entry');
  redirect('/');
}

export async function createExit(id: string) {
    const result = completeParkingRecord(id);
    if (result.success) {
        revalidatePath('/');
        revalidatePath('/reports');
    }
    return result;
}

export async function runPrediction() {
    try {
        const history = getParkingHistory();
        if (history.length === 0) {
            return { demandForecast: "Not enough historical data to make a prediction. Please check back after more vehicles have used the parking facility." };
        }
        
        // Convert historical data to CSV string
        const header = "product_type,entry_timestamp,exit_timestamp\n";
        const csvData = history.map(record => 
            `${record.product},${record.timeIn.toISOString()},${record.timeOut?.toISOString() || ''}`
        ).join('\n');
        
        const historicalData = header + csvData;

        const prediction = await predictParkingDemand({ historicalData });
        return prediction;
    } catch (error) {
        console.error("Prediction failed:", error);
        return { error: "Failed to generate prediction. Please try again later." };
    }
}
