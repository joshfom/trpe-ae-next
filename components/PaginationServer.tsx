import {MoveLeft, MoveRight} from "lucide-react";
import Link from "next/link";

interface PaginationServerProps {
    metaLinks?: {
        hasNext: boolean,
        hasPrev: boolean,
        totalPages: number,
        currentPage: number
    },
    isDark?: boolean,
    pathname: string,
    searchParams: URLSearchParams
}

export default function PaginationServer({metaLinks, isDark = false, pathname, searchParams}: PaginationServerProps) {
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const totalPages = metaLinks?.totalPages ?? 0;

        if (totalPages <= 1) {
            return totalPages === 1 ? [1] : [];
        }

        // For total pages 6 or less, show all pages
        if (totalPages <= 6) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        // For more than 6 pages, show first 3 and last 3 with ellipsis
        // First 3 pages
        for (let i = 1; i <= 3; i++) {
            pages.push(i);
        }

        // Add ellipsis if current page is not adjacent to first 3 or last 3
        if (currentPage > 4 && currentPage < totalPages - 3) {
            pages.push('...');
            pages.push(currentPage - 1);
            pages.push(currentPage);
            pages.push(currentPage + 1);
            pages.push('...');
        } else if (currentPage <= 4) {
            pages.push(4);
            pages.push('...');
        } else if (currentPage >= totalPages - 3) {
            pages.push('...');
            pages.push(totalPages - 3);
        }

        // Last 3 pages
        for (let i = totalPages - 2; i <= totalPages; i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        return pages;
    };

    if (!metaLinks?.hasNext){
        return <div className="py-12"></div>;
    }

    return (
        <div className="mx-auto flex items-center justify-center w-full lg:max-w-6xl py-12 lg:pt-24">
            {/*Mobile Pagination*/}
            <nav className="flex w-full items-center justify-between px-4 lg:hidden">
                <div className="flex  md:hidden">
                    {metaLinks?.hasPrev ? (
                        <Link
                            href={createPageURL(currentPage - 1)}
                            className="inline-flex items-center border-t-2 border-transparent pr-1   font-medium text-gray-800 hover:bg-white rounded-lg hover:text-gray-700"
                        >
                            <MoveLeft className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true"/>
                            Prev
                        </Link>
                    ) : (
                        <span
                            className="inline-flex items-center border-t-2 border-transparent px-4 py-4  font-medium text-gray-300">
                            Prev
                        </span>
                    )}
                </div>
                <div className=" text-gray-700 text-sm grow text-center">
                    Page {currentPage} of {metaLinks?.totalPages}
                </div>
                <div className=" flex md:hidden">
                    {metaLinks?.hasNext ? (
                        <Link
                            href={createPageURL(currentPage + 1)}
                            className="inline-flex items-center border-t-2 border-transparent pl-1  font-medium text-gray-800 hover:bg-white rounded-lg hover:text-gray-700"
                        >
                            Next
                            <MoveRight className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true"/>
                        </Link>
                    ) : (
                        <span
                            className="inline-flex items-center border-t-2 border-transparent px-4 py-4  font-medium text-gray-300">
                            Next
                        </span>
                    )}
                </div>
            </nav>

            {/*Desktop Pagination*/}
            {/*Desktop Pagination*/}
            <nav className="hidden border-t border-gray-200 px-4 sm:px-0 lg:flex">
                <div className="flex -mt-px">
                    {/* Previous button */}
                    {metaLinks?.hasPrev ? (
                        <Link
                            href={createPageURL(currentPage - 1)}
                            className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 font-medium rounded-lg ${
                                isDark
                                    ? 'text-white hover:bg-gray-700 hover:text-gray-300'
                                    : 'text-gray-500 hover:bg-white hover:text-gray-700'
                            }`}
                        >
                            <MoveLeft className={`mr-3 h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-400'}`}/>
                            Previous
                        </Link>
                    ) : (
                        <span
                            className={`inline-flex items-center border-t-2 border-transparent px-4 py-4 font-medium ${isDark ? 'text-gray-500' : 'text-gray-300'}`}>
                Previous
            </span>
                    )}

                    {/* Page numbers */}
                    <div className="hidden md:flex gap-4">
                        {generatePageNumbers().map((pageNum, idx) => (
                            <div key={idx}>
                                {pageNum === '...' ? (
                                    <span
                                        className={`inline-flex items-center border-t-2 border-transparent px-6 py-4 font-medium ${isDark ? 'text-gray-500' : 'text-gray-300'}`}>
                            ...
                        </span>
                                ) : (
                                    <Link
                                        href={createPageURL(pageNum!)}
                                        className={`inline-flex items-center border-t-2 px-6 py-4 font-medium rounded-lg ${
                                            currentPage === pageNum
                                                ? isDark
                                                    ? 'bg-white text-black'
                                                    : 'bg-black text-white'
                                                : isDark
                                                    ? 'border-transparent text-gray-300 hover:bg-gray-700 hover:text-gray-500'
                                                    : 'border-transparent text-gray-500 hover:bg-white hover:text-gray-700'
                                        }`}
                                    >
                                        {pageNum}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    );
}
