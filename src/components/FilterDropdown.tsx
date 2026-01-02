import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FilterDropdownProps {
	options: string[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export const FilterDropdown = ({
	options,
	value,
	onChange,
	placeholder = "Filter by category"
}: FilterDropdownProps) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full px-4 py-2 rounded-lg bg-[#F3F3F5] flex items-center justify-between hover:bg-[#E8E8EA] focus:outline-none focus:ring-2"
			>
				<span className={value ? "text-gray-900" : "text-gray-500"}>
					{value || placeholder}
				</span>
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
					<div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
						<button
							onClick={() => {
								onChange("");
								setIsOpen(false);
							}}
							className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
								!value ? "bg-blue-50 text-blue-600" : "text-gray-900"
							}`}
						>
							All Categories
						</button>
						{options.map(option => (
							<button
								key={option}
								onClick={() => {
									onChange(option);
									setIsOpen(false);
								}}
								className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
									value === option
										? "bg-blue-50 text-blue-600"
										: "text-gray-900"
								}`}
							>
								{option}
							</button>
						))}
					</div>
				</>
			)}
		</div>
	);
};
