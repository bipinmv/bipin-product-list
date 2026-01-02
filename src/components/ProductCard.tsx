import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Product } from "../api/products";

interface ProductCardProps {
	product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
	const discountedPrice =
		product.price * (1 - product.discountPercentage / 100);
	const fullStars = Math.floor(product.rating);
	const hasHalfStar = product.rating % 1 >= 0.5;

	return (
		<Link
			to={`/product/${product.id}`}
			className="block bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
		>
			<div className="aspect-square w-full bg-white mb-4">
				<img
					src={product.thumbnail}
					alt={product.title}
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="p-4">
				<h3 className="font-normal text-base mb-2 text-gray-900 line-clamp-2">
					{product.title}
				</h3>
				<div className="flex items-center gap-1 mb-2">
					{Array.from({ length: 5 }, (_, i) => (
						<Star
							key={`star-${product.id}-${i}`}
							className={`w-4 h-4 ${
								i < fullStars
									? "fill-yellow-400 text-yellow-400"
									: i === fullStars && hasHalfStar
									? "fill-yellow-400/50 text-yellow-400"
									: "text-gray-300"
							}`}
						/>
					))}
					<span className="text-sm text-gray-600 ml-1">({product.rating})</span>
				</div>
				<p className="text-base font-normal text-gray-900">
					${discountedPrice?.toFixed(2)}
				</p>
			</div>
		</Link>
	);
};
