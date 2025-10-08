'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { runPrediction } from '@/lib/actions';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function PredictionClient() {
    const [isPending, startTransition] = useTransition();
    const [prediction, setPrediction] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePredict = () => {
        startTransition(async () => {
            setError(null);
            setPrediction(null);
            const result = await runPrediction();
            if (result.error) {
                setError(result.error);
            } else if (result.demandForecast) {
                setPrediction(result.demandForecast);
            }
        });
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Parking Demand Prediction</CardTitle>
                <CardDescription>
                    Use historical data to forecast future parking demand by product type.
                    The AI model will analyze trends to provide insights.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Prediction Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {prediction && (
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <BrainCircuit className="w-5 h-5 text-primary" />
                                Demand Forecast
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap font-code">{prediction}</p>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handlePredict} disabled={isPending} className="w-full">
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Data...
                        </>
                    ) : (
                        "Generate Prediction"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
