import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";

const Cart = () => {
	const { cart, updateQuantity, removeFromCart } = useProductStore(
		state => state
	);
	console.log({ cart });

	const updateCartQuantity = (product: any, quantity: number) => {
		if (quantity === 0) {
			removeFromCart(product.id);
		} else {
			updateQuantity(product, quantity);
		}
	};

	return (
		<div className="p-4">
			<Link to="/">
				<button className="px-3 py-1 bg-[#F3F3F5] rounded-xl border mt-3 mb-6">
					Back to Home
				</button>
			</Link>
			<div className="flex justify-center w-full flex-col gap-3">
				{Object.keys(cart).length === 0 && <div>Your cart is empty</div>}
				{Object.values(cart).map(obj => (
					<div
						key={obj.id}
						className="p-4 rounded-3xl border shadow-md gap-3 max-w-[50%]"
					>
						<div className="flex items-center">
							<div className="aspect-square w-20 bg-gray-100 rounded-lg overflow-hidden">
								<img
									src={obj.thumbnail}
									alt={obj.title}
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="ml-4">
								<div>{obj.title}</div>
								<span>${obj.price?.toFixed(2)}</span>
							</div>
							<div className="ml-auto">
								<button
									onClick={() => updateCartQuantity(obj, obj.quantity - 1)}
									className="py-1 px-2 rounded border"
								>
									-
								</button>
								<span className="p-2 rounded border">{obj.quantity}</span>
								<button
									onClick={() => updateCartQuantity(obj, obj.quantity + 1)}
									className="py-1 px-2 rounded border"
								>
									+
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Cart;
