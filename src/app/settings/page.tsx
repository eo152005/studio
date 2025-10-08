import { getProducts } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function SettingsPage() {
    const products = getProducts();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Parking Limits</CardTitle>
                <CardDescription>Maximum parking slots defined for each product category.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product Category</TableHead>
                            <TableHead className="text-right">Max Parking Slots</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map(product => {
                            const Icon = product.icon;
                            return (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <Icon className="w-4 h-4 text-muted-foreground" />
                                        {product.name}
                                    </TableCell>
                                    <TableCell className="text-right font-mono">{product.maxSlots}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
