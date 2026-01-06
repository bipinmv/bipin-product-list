export interface Review {
	id: number;
	body: string;
	rating: number;
	userId: number;
	user?: {
		id: number;
		username: string;
		email?: string;
	};
	date?: string;
	reviewerName?: string;
	reviewerEmail?: string;
}

export interface Product {
	id: number;
	title: string;
	description: string;
	price: number;
	discountPercentage: number;
	rating: number;
	stock: number;
	brand: string;
	category: string;
	thumbnail: string;
	images: string[];
	reviews?: Review[];
	availabilityStatus: string;
	quantity: number;
}

export interface ProductsResponse {
	products: Product[];
	total: number;
	skip: number;
	limit: number;
}

const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "https://dummyjson.com/products";

export const fetchProducts = async (
	search?: string,
	category?: string,
	limit: number = 30,
	skip: number = 0,
	sortBy?: string,
	order?: "asc" | "desc"
): Promise<ProductsResponse> => {
	let url = `${API_BASE_URL}?limit=${limit}&skip=${skip}`;

	if (search) {
		url = `${API_BASE_URL}/search?q=${encodeURIComponent(
			search
		)}&limit=${limit}&skip=${skip}`;
	} else if (category) {
		url = `${API_BASE_URL}/category/${encodeURIComponent(
			category
		)}?limit=${limit}&skip=${skip}`;
	}

	// Add sorting parameters
	if (sortBy) {
		const separator = url.includes("?") ? "&" : "?";
		url += `${separator}sortBy=${encodeURIComponent(sortBy)}`;
		if (order) {
			url += `&order=${order}`;
		}
	}

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Failed to fetch products");
	}
	return response.json();
};

export const fetchProductById = async (id: number): Promise<Product> => {
	const response = await fetch(`${API_BASE_URL}/${id}`);
	if (!response.ok) {
		throw new Error("Failed to fetch product");
	}
	return response.json();
};

export const fetchCategories = async (): Promise<string[]> => {
	const response = await fetch(`${API_BASE_URL}/category-list`);
	if (!response.ok) {
		throw new Error("Failed to fetch categories");
	}
	const data = await response.json();
	// Handle both array response and object with categories array
	if (Array.isArray(data)) {
		return data;
	}
	// If it's an object, try to extract categories array
	return data.categories || data || [];
};
