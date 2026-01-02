import { ChevronDown } from "lucide-react";
import { useState } from "react";

export type SortOption = "newest" | "oldest" | "price-low" | "price-high";

interface SortDropdownProps {
	value: SortOption;
	onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
	{ value: "newest", label: "Newest" },
	{ value: "oldest", label: "Oldest" },
	{ value: "price-low", label: "Price: Low to High" },
	{ value: "price-high", label: "Price: High to Low" }
];

export const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const selectedLabel =
		sortOptions.find(opt => opt.value === value)?.label || "Sort by";

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full px-4 py-2 rounded-lg bg-[#F3F3F5] flex items-center justify-between hover:bg-[#E8E8EA] focus:outline-none focus:ring-2"
			>
				<span className="text-gray-900">{selectedLabel}</span>
				<ChevronDown
					className={`w-4 h-4 text-gray-400 transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>
			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
					/>
					<div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
						{sortOptions.map(option => (
							<button
								key={option.value}
								onClick={() => {
									onChange(option.value);
									setIsOpen(false);
								}}
								className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
									value === option.value
										? "bg-blue-50 text-blue-600"
										: "text-gray-900"
								}`}
							>
								{option.label}
							</button>
						))}
					</div>
				</>
			)}
		</div>
	);
};
