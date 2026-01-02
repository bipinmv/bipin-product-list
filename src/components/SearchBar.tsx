import { Search } from "lucide-react";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export const SearchBar = ({
	value,
	onChange,
	placeholder = "Search products..."
}: SearchBarProps) => {
	return (
		<div className="relative">
			<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
			<input
				type="text"
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder={placeholder}
				className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#F3F3F5] focus:outline-none focus:ring-2"
			/>
		</div>
	);
};
