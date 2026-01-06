import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProductStore = {
	cart: Record<string, Product>;
	addToCart: (product: Product) => void;
	updateQuantity: (product: Product, quantity: number) => void;
	removeFromCart: (productId: number) => void;
};

type Product = {
	id: number;
	title: string;
	price: number;
	thumbnail: string;
	availabilityStatus: string;
	quantity: number;
};

export const useProductStore = create<ProductStore>()(
	persist(
		(set, get) => ({
			cart: {},
			addToCart: product =>
				set({ cart: { ...get().cart, [product.id]: product } }),
			updateQuantity: (product, quantity: number) =>
				set({
					cart: { ...get().cart, [product.id]: { ...product, quantity } }
				}),
			removeFromCart: (productId: number) =>
				set(state => {
					const updatedCart = { ...state.cart };
					delete updatedCart[productId];
					return { cart: updatedCart };
				})
		}),
		{
			name: "cart"
		}
	)
);
