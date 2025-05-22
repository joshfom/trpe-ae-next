"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState } from "react"
import { deleteRedirectAction } from "../api/delete-redirect-action"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export type Redirect = {
  id: string
  fromUrl: string
  toUrl: string | null
  statusCode: string
  isActive: string
  createdAt: string
  updatedAt: string | null
}

export const columns: ColumnDef<Redirect>[] = [
  {
    accessorKey: "fromUrl",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Source URL
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "toUrl",
    header: "Destination URL",
    cell: ({ row }) => {
      const redirect = row.original
      return redirect.statusCode === "410" ? "N/A" : redirect.toUrl
    },
  },
  {
    accessorKey: "statusCode",
    header: "Status Code",
    cell: ({ row }) => {
      const statusCode = row.getValue("statusCode") as string
      return (
        <Badge variant={statusCode === "301" ? "outline" : "destructive"}>
          {statusCode}
        </Badge>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as string
      return (
        <Badge variant={isActive === "yes" ? "default" : "secondary"}>
          {isActive === "yes" ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell row={row} />,
  },
]

function ActionCell({ row }: { row: any }) {
  const redirect = row.original
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const result = await deleteRedirectAction(redirect.id)
      
      if (result.success) {
        toast.success("Redirect deleted successfully")
        router.refresh()
      } else {
        toast.error(result.message || "Failed to delete redirect")
      }
    } catch (error) {
      toast.error("An error occurred while deleting the redirect")
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/admin/redirects/${redirect.id}`}>
          <Edit className="h-4 w-4" />
        </Link>
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this redirect.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}