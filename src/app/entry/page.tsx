import { EntryForm } from "@/components/entry/entry-form";
import { getProducts } from "@/lib/data";

export default function EntryPage() {
    const products = getProducts();
    return <EntryForm products={products} />;
}
