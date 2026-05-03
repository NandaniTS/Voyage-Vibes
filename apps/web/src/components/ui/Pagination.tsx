'use client';

import { Pagination as HeroUIPagination } from '@heroui/react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage = 12,
  onPageChange,
  className = '',
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  console.log("totalPages",totalPages)
  if (totalPages < 1) {
    return null;
  }



  return (
    <div className={`flex w-full justify-center ${className}`}>
      <HeroUIPagination
        total={totalPages}
        page={currentPage}
        onChange={onPageChange}
        color="primary"
        variant="bordered"  
        size="sm"
        showControls
        showShadow={false}
        classNames={{
          wrapper: "gap-0 overflow-visible h-8 rounded-lg border border-(--border)",
          item: "w-8 h-8 text-small rounded-none bg-transparent",
          cursor: "bg-(--primary) text-white font-bold rounded-lg",
        }}
      />
    </div>
  );
}
