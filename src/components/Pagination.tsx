import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const Pagination = ({
	currentPage,
	totalPages,
	onPageChange
}: PaginationProps) => {
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxButtons = 4;

		if (totalPages <= maxButtons) {
			// Show all pages if total is less than or equal to max buttons
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
			return pages;
		}

		// Always show first page
		pages.push(1);

		// Calculate which pages to show around current page
		let start: number;
		let end: number;

		if (currentPage <= 2) {
			// Near the start: show pages 2, 3, 4
			start = 2;
			end = Math.min(4, totalPages - 1);
		} else if (currentPage >= totalPages - 1) {
			// Near the end: show last 3 pages before last
			start = Math.max(2, totalPages - 3);
			end = totalPages - 1;
		} else {
			// In the middle: show current page and one on each side
			start = currentPage - 1;
			end = currentPage + 1;
		}

		// Add dots after first page if there's a gap
		if (start > 2) {
			pages.push("...");
		}

		// Add the calculated range of pages
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}

		// Add dots before last page if there's a gap
		if (end < totalPages - 1) {
			pages.push("...");
		}

		// Always show last page
		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className="flex items-center justify-center gap-2 mt-8">
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
			>
				<ChevronLeft className="w-4 h-4" />
				<span>Previous</span>
			</button>

			<div className="flex items-center gap-1">
				{pageNumbers.map((page, index) => {
					if (page === "...") {
						return (
							<span key={`dots-${index}`} className="px-2 text-gray-500">
								...
							</span>
						);
					}

					const pageNum = page as number;
					return (
						<button
							key={pageNum}
							onClick={() => onPageChange(pageNum)}
							className={`px-3 py-1 rounded-lg ${
								currentPage === pageNum
									? "border"
									: "text-gray-700 hover:bg-gray-100"
							}`}
						>
							{pageNum}
						</button>
					);
				})}
			</div>

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
			>
				<span>Next</span>
				<ChevronRight className="w-4 h-4" />
			</button>
		</div>
	);
};
