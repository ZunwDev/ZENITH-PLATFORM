import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

function PaginationControls({ currentPage, totalPages, handlePageChange, number, marginTop = "" }) {
  const paginationItems = [];
  for (let i = 1; i <= Math.min(totalPages || 0, 3); i++) {
    paginationItems.push(
      <PaginationItem
        key={i}
        className={cn("cursor-pointer", { "opacity-50 pointer-events-none": currentPage == "1" && totalPages == "1" })}>
        <PaginationLink href={`?p=${i}`} isActive={i === (number + 1 || 1)} onClick={(event) => handlePageChange(i, event)}>
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <Pagination className={cn("z-50", marginTop)}>
      <PaginationContent className="">
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationPrevious
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage <= 1 ? -1 : undefined}
              href={`?p=${Math.max(1, currentPage - 1)}`}
              onClick={(event) => handlePageChange(Math.max(1, currentPage - 1), event)}
            />
          </PaginationItem>
        )}
        {paginationItems}
        {totalPages > 1 && (
          <PaginationItem>
            <PaginationNext
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage >= totalPages ? -1 : undefined}
              href={`?p=${Math.min(totalPages, currentPage + 1)}`}
              onClick={(event) => handlePageChange(Math.min(totalPages, currentPage + 1), event)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationControls;
