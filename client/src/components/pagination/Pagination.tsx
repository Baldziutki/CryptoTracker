'use client'

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const pathName = usePathname();

    const handlePageChange = (pageNumber: number) => {
        router.replace(`${pathName}?page=${pageNumber}`)
    };

    const MAX_PAGES = 3;
    const half = Math.ceil(MAX_PAGES / 2)

    const getButton = ((current: number) => (
        <button key={current}
            onClick={() => handlePageChange(current)}
            className={`px-3 py-1 mx-1 border rounded-md ${current === currentPage ? 'bg-green-500 dark:bg-green-700' : 'hover:bg-green-300 dark:hover:bg-green-500 focus:outline-none focus:bg-green-300'}`}>
            {current}
        </button>
    ))

    return (
        <div className="flex flex-row justify-center my-4">
            <button 
            onClick={() => handlePageChange(currentPage-1)} 
            className={`px-3 py-1 mx-1 border rounded-md ${currentPage !== 1 ? 'hover:bg-green-300 dark:hover:bg-green-500' : null}`}
            disabled={currentPage === 1}>  
                <ChevronLeftIcon />
            </button>
            {
                totalPages <= MAX_PAGES + 2 ?
                    Array(totalPages).fill(0).map((item, index) => getButton(index + 1)) :
                    <>
                        {getButton(1)}
                        {currentPage > 1 + half && <span className=" leading-10">...</span>}
                        {Array(MAX_PAGES).fill(0).map((item, index) => {
                            const p = currentPage - half + index + 1
                            return (p > 1 && p < totalPages) ? getButton(p) : ''
                        })}
                        {currentPage < totalPages - half && <span className=" leading-10">...</span>}
                        {getButton(totalPages)}
                    </>
            }
            <button 
            onClick={() => handlePageChange(currentPage+1)} 
            className={`px-3 py-1 mx-1 border rounded-md ${currentPage !== totalPages ? 'hover:bg-green-300 dark:hover:bg-green-500' : null}`}
            disabled={currentPage === totalPages}>
                <ChevronRightIcon />
            </button>
        </div>
    );
};