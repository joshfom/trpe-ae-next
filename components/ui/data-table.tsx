"use client"

import { useEffect, useState, memo, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  totalCount: number
  pageCount: number
  currentPage: number
  onPageChange: (page: number) => void
  onSearch?: (value: string) => void
}

export const DataTable = memo(<TData, TValue>({
  columns,
  data,
  searchKey,
  totalCount,
  pageCount,
  currentPage,
  onPageChange,
  onSearch,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchValue, setSearchValue] = useState("")

  // Memoize table configuration
  const tableConfig = useMemo(() => ({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  }), [data, columns, sorting, columnFilters]);

  const table = useReactTable(tableConfig);

  // Memoize callback functions
  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch(searchValue);
    }
  }, [onSearch, searchValue]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  }, []);

  const handlePreviousPage = useCallback(() => {
    onPageChange(currentPage - 1);
  }, [onPageChange, currentPage]);

  const handleNextPage = useCallback(() => {
    onPageChange(currentPage + 1);
  }, [onPageChange, currentPage]);

  // Memoize pagination calculations
  const paginationInfo = useMemo(() => {
    const startEntry = (currentPage - 1) * table.getState().pagination.pageSize + 1;
    const endEntry = Math.min(currentPage * table.getState().pagination.pageSize, totalCount);
    return { startEntry, endEntry };
  }, [currentPage, table, totalCount]);

  return (
    <div>
      {searchKey && (
        <div className="flex items-center gap-2 py-4">
          <Input
            placeholder={`Search...`}
            value={searchValue}
            onChange={handleSearchChange}
            className="max-w-sm"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {paginationInfo.startEntry} to{" "}
          {paginationInfo.endEntry} of{" "}
          {totalCount} entries
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === pageCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

DataTable.displayName = 'DataTable';