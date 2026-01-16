// src/components/ProductCard.js
import Link from 'next/link';
import Image from 'next/image';

const ProductCard = ({ product }) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Product Image - Clicking this takes user to detail page */}
      <Link href={`/product/${product.id}`}>
        <div className="aspect-h-4 aspect-w-3 bg-gray-200 group-hover:opacity-75 sm:h-96">
          <img
            src={product.image_url} // Cloudinary URL jo aapne DB mein save kiya hai
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link href={`/product/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <div className="flex flex-1 justify-end flex-col">
          <p className="text-base font-semibold text-gray-900">₹{product.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;