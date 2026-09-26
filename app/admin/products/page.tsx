import { getAllProducts } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="panel overflow-hidden">
      <div className="p-5">
        <h1 className="text-3xl font-black">Products</h1>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-coal text-paper">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-t border-coal/10">
              <td className="p-3 font-bold">{product.title}</td>
              <td className="p-3">{product.category}</td>
              <td className="p-3">{formatMoney(product.priceInr)}</td>
              <td className="p-3">{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
