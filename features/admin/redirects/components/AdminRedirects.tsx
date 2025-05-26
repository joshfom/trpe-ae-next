"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getAllRedirectsAction } from "../api/get-redirects-action"
import { DataTable } from "@/components/ui/data-table"
import { columns, Redirect } from "./columns"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"

export function AdminRedirects() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pageParam = searchParams.get("page")
  const searchParam = searchParams.get("search")
  
  const [redirects, setRedirects] = useState<Redirect[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [search, setSearch] = useState(searchParam || "")
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Parse the page parameter
    const parsedPage = pageParam ? parseInt(pageParam) : 1
    setCurrentPage(parsedPage)
    
    // Set search value from URL
    if (searchParam) {
      setSearch(searchParam)
    }
    
    // Fetch redirects
    fetchRedirects(parsedPage, searchParam || "")
  }, [pageParam, searchParam])
  
  const fetchRedirects = async (page: number, searchTerm: string) => {
    setIsLoading(true)
    try {
      const result = await getAllRedirectsAction(page, 10, searchTerm) as unknown as {
        redirects: Redirect[]
        totalPages: number
        currentPage: number
        totalCount: number
      }
      setRedirects(result.redirects)
      setTotalPages(result.totalPages)
      setTotalCount(result.totalCount)
    } catch (error) {
      console.error("Error fetching redirects:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams()
    params.set("page", page.toString())
    if (search) {
      params.set("search", search)
    }
    router.push(`/crm/redirects?${params.toString()}`)
  }
  
  const handleSearch = (value: string) => {
    setSearch(value)
    const params = new URLSearchParams()
    params.set("page", "1")
    if (value) {
      params.set("search", value)
    }
    router.push(`/crm/redirects?${params.toString()}`)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Redirects</h2>
        <Button asChild>
          <Link href="/crm/redirects/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Redirect
          </Link>
        </Button>
      </div>
      
      <div className="border rounded-md p-4">
        <DataTable
          columns={columns as ColumnDef<unknown, unknown>[]}
          data={redirects as unknown[]}
          searchKey="search"
          totalCount={totalCount}
          pageCount={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
        />
      </div>
    </div>
  )
}