import { EntryForm } from "@/components/entry/entry-form";
import { getProducts } from "@/lib/data";
import { Product } from "@/lib/types";

export default function EntryPage() {
    const products = getProducts();
    // Omit the icon component before passing to the client component
    const productData = products.map(({ icon, ...rest }) => rest);

    return <EntryForm products={productData} />;
}
