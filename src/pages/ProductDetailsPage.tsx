import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById } from "../api/products";
import type { Product } from "../api/products";
import {
	ArrowLeft,
	Star,
	ShoppingCart,
	Truck,
	Shield,
	Loader2
} from "lucide-react";
import { Accordion } from "../components/Accordion";

export const ProductDetailsPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadProduct = async () => {
			if (!id) {
				setError("Product ID is required");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);
				const productData = await fetchProductById(Number.parseInt(id, 10));
				setProduct(productData);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load product");
			} finally {
				setLoading(false);
			}
		};

		loadProduct();
	}, [id]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white">
				<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white">
				<div className="text-center">
					<p className="text-red-600 text-lg mb-4">
						{error || "Product not found"}
					</p>
					<button
						onClick={() => navigate("/")}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						Go Back
					</button>
				</div>
			</div>
		);
	}

	const discountedPrice =
		product.price * (1 - product.discountPercentage / 100);
	const fullStars = Math.floor(product.rating);
	const hasHalfStar = product.rating % 1 >= 0.5;

	// Generate mock data for fields not in API
	const brandPrefix = product.brand
		? product.brand.substring(0, 2).toUpperCase()
		: "PR";
	const sku = `HL-${brandPrefix}-${String(product.id).padStart(3, "0")}`;
	const weight = `${Math.round(product.price / 10)}g`;
	const dimensions = `${Math.round(product.id * 0.7)} x ${Math.round(
		product.id * 2.6
	)} x ${Math.round(product.id * 0.7)} cm`;

	// Generate tags from category and brand
	const categoryTag = product.category
		? product.category.toLowerCase().split(" ")[0]
		: "";
	const tags = [categoryTag, "insulated", "eco-friendly"].filter(Boolean);

	// Format reviews from API
	const formatReviewDate = (dateString?: string): string => {
		if (!dateString)
			return new Date().toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			});
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric"
			});
		} catch {
			return dateString;
		}
	};

	const reviews = (product.reviews || []).map(review => ({
		id: review.id,
		name: review.reviewerName || `User ${review.userId}`,
		email: review.reviewerEmail || `user${review.userId}@example.com`,
		text: review.body,
		rating: review.rating,
		date: formatReviewDate(review.date)
	}));

	// Accordion items
	const accordionItems = [
		{
			title: "Warranty Information",
			content:
				"This product comes with a 1-year manufacturer warranty covering defects in materials and workmanship. Warranty does not cover damage from misuse or normal wear and tear."
		},
		{
			title: "Shipping Information",
			content:
				"Free shipping on orders over $50. Standard shipping takes 3-5 business days. Express shipping (1-2 business days) available for an additional fee. International shipping available to select countries."
		},
		{
			title: "Return Policy",
			content:
				"We offer a 30-day return policy. Items must be in original condition with all tags and packaging. Returns are free for items over $50. Please contact customer service to initiate a return."
		}
	];

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 py-8">
				<button
					onClick={() => navigate("/")}
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
				>
					<ArrowLeft className="w-5 h-5" />
					<span>Back to Products</span>
				</button>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
					<div>
						<div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
							<img
								src={product.thumbnail}
								alt={product.title}
								className="w-full h-full object-cover"
							/>
						</div>
					</div>

					<div className="flex flex-col">
						<div className="flex gap-2 mb-4">
							{product.category && (
								<span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
									{product.category}
								</span>
							)}
							<span className="px-3 py-1 bg-gray-900 text-white text-sm font-medium rounded-full">
								In Stock
							</span>
						</div>

						<h1 className="text-3xl font-bold text-gray-900 mb-4">
							{product.title}
						</h1>

						<p className="text-gray-700 mb-6 leading-relaxed">
							{product.description}
						</p>

						<div className="flex items-center gap-2 mb-6">
							<div className="flex items-center">
								{Array.from({ length: 5 }, (_, i) => (
									<Star
										key={`rating-star-${product.id}-${i}`}
										className={`w-5 h-5 ${
											i < fullStars
												? "fill-yellow-400 text-yellow-400"
												: i === fullStars && hasHalfStar
												? "fill-yellow-400/50 text-yellow-400"
												: "text-gray-300"
										}`}
									/>
								))}
							</div>
							<span className="text-gray-700">
								{product.rating} out of 5 stars
							</span>
						</div>

						<div className="mb-6">
							<p className="text-sm text-gray-600 mb-1">Price</p>
							<p className="text-4xl font-bold text-gray-900">
								${discountedPrice.toFixed(2)}
							</p>
						</div>

						<div className="mb-6 space-y-2">
							<div className="flex justify-between">
								<span className="text-gray-600">Brand:</span>
								<span className="text-gray-900 font-medium">
									{product.brand || "N/A"}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">SKU:</span>
								<span className="text-gray-900 font-medium">{sku}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Stock:</span>
								<span className="text-gray-900 font-medium">
									{product.stock} units available
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Weight:</span>
								<span className="text-gray-900 font-medium">{weight}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Dimensions:</span>
								<span className="text-gray-900 font-medium">{dimensions}</span>
							</div>
						</div>

						<div className="flex flex-wrap gap-2 mb-6">
							{tags.map(tag => (
								<span
									key={`tag-${product.id}-${tag}`}
									className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
								>
									{tag}
								</span>
							))}
						</div>

						<button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium mb-4">
							<ShoppingCart className="w-5 h-5" />
							Order Now
						</button>

						<div className="flex gap-6 text-sm text-gray-600">
							<div className="flex items-center gap-2">
								<Truck className="w-5 h-5" />
								<span>Fast Shipping</span>
							</div>
							<div className="flex items-center gap-2">
								<Shield className="w-5 h-5" />
								<span>Secure Payment</span>
							</div>
						</div>
					</div>
				</div>

				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Additional Information
					</h2>
					<Accordion items={accordionItems} />
				</div>

				<div>
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						Customer Reviews
					</h2>
					<div className="space-y-6">
						{reviews.length === 0 ? (
							<p className="text-gray-600 text-center py-8">No reviews yet.</p>
						) : (
							reviews.map(review => (
								<div
									key={review.id}
									className="border-b border-gray-200 pb-6 last:border-b-0"
								>
									<div className="flex items-start justify-between mb-2">
										<div>
											<p className="font-semibold text-gray-900">
												{review.name}
											</p>
											<p className="text-sm text-gray-600">{review.email}</p>
										</div>
										<div className="flex items-center gap-1">
											{Array.from({ length: 5 }, (_, i) => (
												<Star
													key={`review-star-${review.id}-${i}`}
													className={`w-4 h-4 ${
														i < review.rating
															? "fill-yellow-400 text-yellow-400"
															: "text-gray-300"
													}`}
												/>
											))}
										</div>
									</div>
									<p className="text-gray-700 mb-2">{review.text}</p>
									<p className="text-sm text-gray-500">{review.date}</p>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
