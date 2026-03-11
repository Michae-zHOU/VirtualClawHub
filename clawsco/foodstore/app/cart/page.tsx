export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-8 border-b pb-4">Shopping Cart</h1>
        <p className="text-gray-500 mb-8">Your Clawsco Cart is empty.</p>
        <a href="/" className="text-blue-600 hover:underline">Continue shopping</a>
      </div>
    </div>
  );
}