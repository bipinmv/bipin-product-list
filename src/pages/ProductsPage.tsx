import { useState, useEffect } from "react";
import { fetchProducts, fetchCategories } from "../api/products";
import type { Product } from "../api/products";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from "../components/SearchBar";
import { FilterDropdown } from "../components/FilterDropdown";
import { SortDropdown } from "../components/SortDropdown";
import { Pagination } from "../components/Pagination";
import type { SortOption } from "../components/SortDropdown";
import { Loader2 } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 8;
const DEBOUNCE_DELAY = 500;

const getSortParams = (
	sortOption: SortOption
): { sortBy: string; order: "asc" | "desc" } => {
	switch (sortOption) {
		case "newest":
			return { sortBy: "id", order: "desc" };
		case "oldest":
			return { sortBy: "id", order: "asc" };
		case "price-low":
			return { sortBy: "price", order: "asc" };
		case "price-high":
			return { sortBy: "price", order: "desc" };
		default:
			return { sortBy: "price", order: "asc" };
	}
};

export const ProductsPage = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [categories, setCategories] = useState<string[]>([]);
	const [categoryMap, setCategoryMap] = useState<Map<string, string>>(
		new Map()
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [sortOption, setSortOption] = useState<SortOption>("price-low");
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const loadCategories = async () => {
			try {
				const categoriesData = await fetchCategories();
				const map = new Map<string, string>();
				const formattedCategories: string[] = categoriesData.map(
					(cat: string) => {
						const formatted = cat
							.split(/[- ]/)
							.map(
								word =>
									word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
							)
							.join(" ");
						map.set(formatted, cat);
						return formatted;
					}
				);
				setCategories(formattedCategories);
				setCategoryMap(map);
			} catch (err) {
				console.error("Failed to load categories:", err);
				setCategories([]);
				setCategoryMap(new Map());
			}
		};

		loadCategories();
	}, []);

	useEffect(() => {
		const loadProducts = async () => {
			try {
				setLoading(true);
				setError(null);

				const sortParams = getSortParams(sortOption);
				const skip = (currentPage - 1) * ITEMS_PER_PAGE;

				let categorySlug: string | undefined;
				if (selectedCategory && categoryMap.size > 0) {
					categorySlug = categoryMap.get(selectedCategory) || selectedCategory;
				} else if (selectedCategory) {
					categorySlug = selectedCategory;
				} else {
					categorySlug = undefined;
				}

				const productsData = await fetchProducts(
					debouncedSearchQuery || undefined,
					categorySlug,
					ITEMS_PER_PAGE,
					skip,
					sortParams.sortBy,
					sortParams.order
				);

				setProducts(productsData.products);
				setTotalCount(productsData.total);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load products"
				);
			} finally {
				setLoading(false);
			}
		};

		loadProducts();
	}, [
		debouncedSearchQuery,
		selectedCategory,
		sortOption,
		currentPage,
		categoryMap
	]);

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearchQuery, selectedCategory, sortOption]);

	const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white">
				<div className="text-center">
					<p className="text-red-600 text-lg mb-4">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 py-8">
				{/* Header Section */}
				<div className="mb-8">
					<div className="flex justify-between">
						<h1 className="text-2xl font-normal text-[#0A0A0A] mb-2">
							Product Catalog
						</h1>
						<Link to="/cart">
							<button className="px-3 py-1 bg-[#F3F3F5] rounded-xl border">
								Cart
							</button>
						</Link>
					</div>
					<p className="text-[#4A5565] text-base">
						Discover our wide selection of quality products
					</p>
				</div>

				{/* Control Bar */}
				<div className="mb-4">
					<div className="flex flex-col md:flex-row gap-4 items-center">
						{/* Search Bar on Left */}
						<div className="flex-1 w-full">
							<SearchBar value={searchQuery} onChange={setSearchQuery} />
						</div>

						{/* Dropdowns on Right */}
						<div className="flex gap-4 w-full md:w-auto">
							<div className="flex-1 md:flex-initial md:w-48">
								<FilterDropdown
									options={categories}
									value={selectedCategory}
									onChange={setSelectedCategory}
									placeholder="All Categories"
								/>
							</div>
							<div className="flex-1 md:flex-initial md:w-48">
								<SortDropdown value={sortOption} onChange={setSortOption} />
							</div>
						</div>
					</div>
				</div>

				{/* Product Count */}
				{!loading && (
					<p className="text-sm text-gray-600 mb-6">
						Showing {products.length} of {totalCount} products
					</p>
				)}

				{/* Products Grid */}
				{loading && (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="w-8 h-8 animate-spin text-blue-600" />
					</div>
				)}
				{!loading && products.length === 0 && (
					<div className="text-center py-20">
						<p className="text-gray-600 text-lg">No products found</p>
					</div>
				)}
				{!loading && products.length > 0 && (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
							{products.map(product => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={setCurrentPage}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
};
