'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting future parking demand by product type.
 *
 * - predictParkingDemand - A function that triggers the parking demand prediction flow.
 * - PredictParkingDemandInput - The input type for the predictParkingDemand function.
 * - PredictParkingDemandOutput - The return type for the predictParkingDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictParkingDemandInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical parking data as a CSV string, including product type and timestamps.'
    ),
});
export type PredictParkingDemandInput = z.infer<typeof PredictParkingDemandInputSchema>;

const PredictParkingDemandOutputSchema = z.object({
  demandForecast: z
    .string()
    .describe(
      'A forecast of parking demand by product type, as a human-readable string.'
    ),
});
export type PredictParkingDemandOutput = z.infer<typeof PredictParkingDemandOutputSchema>;

export async function predictParkingDemand(input: PredictParkingDemandInput): Promise<PredictParkingDemandOutput> {
  return predictParkingDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictParkingDemandPrompt',
  input: {schema: PredictParkingDemandInputSchema},
  output: {schema: PredictParkingDemandOutputSchema},
  prompt: `You are an AI assistant that helps predict future parking demand for a BPCL KR parking facility based on historical data.
  Analyze the provided historical parking data to forecast future parking demand by product type. Consider trends, seasonality, and other relevant factors in your analysis.
  Provide a clear and concise forecast of parking demand, highlighting potential peak times and areas of concern.
  Return the forecast as a human-readable string.
  Historical Data:\n{{{historicalData}}}`,
});

const predictParkingDemandFlow = ai.defineFlow(
  {
    name: 'predictParkingDemandFlow',
    inputSchema: PredictParkingDemandInputSchema,
    outputSchema: PredictParkingDemandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
