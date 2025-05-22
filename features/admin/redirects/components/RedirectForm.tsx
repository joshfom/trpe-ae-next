"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { addRedirectAction } from "../api/add-redirect-action"
import { updateRedirectAction } from "../api/update-redirect-action"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { importRedirectsFromExcelAction } from "../api/import-redirects-action"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const redirectFormSchema = z.object({
  fromUrl: z.string().min(1, {
    message: "Source URL is required",
  }),
  toUrl: z.string().optional(),
  statusCode: z.enum(["301", "410"]),
  isActive: z.enum(["yes", "no"]).default("yes"),
})

type RedirectFormValues = z.infer<typeof redirectFormSchema>

interface RedirectFormProps {
  initialData?: {
    id: string
    fromUrl: string
    toUrl?: string
    statusCode: string
    isActive?: string
  } | null
}

export function RedirectForm({ initialData }: RedirectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("single");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const defaultValues: Partial<RedirectFormValues> = {
    fromUrl: initialData?.fromUrl || "",
    toUrl: initialData?.toUrl || "",
    statusCode: (initialData?.statusCode as "301" | "410") || "301",
    isActive: (initialData?.isActive as "yes" | "no") || "yes",
  }

  const form = useForm<RedirectFormValues>({
    resolver: zodResolver(redirectFormSchema),
    defaultValues,
  });

  const statusCode = form.watch("statusCode");

  useEffect(() => {
    if (statusCode === "410") {
      form.setValue("toUrl", "");
    }
  }, [statusCode, form]);

  const onSubmit = async (data: RedirectFormValues) => {
    try {
      setIsLoading(true);
      
      let result;
      
      if (initialData) {
        result = await updateRedirectAction(initialData.id, data);
      } else {
        result = await addRedirectAction(data);
      }

      if (result.success) {
        toast.success(result.message);
        if (!initialData) {
          form.reset();
        }
        router.push('/admin/redirects');
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        setFileError("Only Excel files (.xlsx or .xls) are allowed");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setFileError("Please select a file first");
      return;
    }

    try {
      setIsLoading(true);
      
      const result = await importRedirectsFromExcelAction(file);
      
      if (result.success) {
        // Type-safe access to properties when result.success is true
        toast.success(`Imported ${result.imported} redirects successfully (${result.skipped} skipped)`);
        
        // Display file format detection info
        const headerInfo = 'hasHeaders' in result ? 
          `Excel ${result.hasHeaders ? 'had' : 'did not have'} headers` : '';
        console.log(`Import details: ${headerInfo}, Total rows: ${result.total}`);
        
        if (result.errors && result.errors.length > 0) {
          console.error("Import errors:", result.errors);
          toast.error(`${result.errors.length} errors occurred during import. Check console for details.`);
          
          // Show first few errors in the toast for visibility
          const errorSample = result.errors.slice(0, 3);
          errorSample.forEach(err => {
            toast.error(`Import error: ${err}`);
          });
        }
        router.refresh();
      } else {
        // Handle error case with detailed debugging
        console.error("Import failed:", result.message, result.error);
        toast.error(result.message || "Failed to import redirects");
        
        // Display technical error details if available
        if (result.error) {
          console.error("Technical details:", result.error);
          setFileError(`Error: ${result.message} (${result.error})`);
        }
      }
      
    } catch (error) {
      // Handle unexpected errors
      console.error("Unexpected error during import:", error);
      toast.error("Something went wrong during import");
      setFileError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Tabs defaultValue="single" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="single">Add Single Redirect</TabsTrigger>
          <TabsTrigger value="import">Import from Excel</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full p-8 bg-white max-w-2xl">
              <FormField
                  control={form.control}
                  name="fromUrl"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source URL *</FormLabel>
                        <FormControl>
                          <Input placeholder="/example-page" {...field} />
                        </FormControl>
                        <FormDescription>
                          The URL path that will be redirected (e.g., /old-page)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="statusCode"
                  render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Redirect Type *</FormLabel>
                        <FormControl>
                          <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex py-4 space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="301" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                301 - Permanent Redirect
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="410" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                410 - Gone (Content Removed)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              {statusCode === "301" && (
                  <FormField
                      control={form.control}
                      name="toUrl"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination URL *</FormLabel>
                            <FormControl>
                              <Input placeholder="/new-page" {...field} />
                            </FormControl>
                            <FormDescription>
                              The URL where visitors will be redirected to (will be converted to lowercase)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
              )}

              <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="yes">Active</SelectItem>
                            <SelectItem value="no">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Whether this redirect is currently active
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              <Button type="submit" disabled={isLoading}>
                {initialData ? "Update Redirect" : "Add Redirect"}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Redirects from Excel</CardTitle>
              <CardDescription>
                Upload an Excel file with redirects to import in bulk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="max-w-md"
                  />
                  <Button
                      type="button"
                      onClick={handleFileUpload}
                      disabled={isLoading || !file}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>

                {fileError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{fileError}</AlertDescription>
                    </Alert>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Expected File Format</h3>
                <p className="text-sm text-muted-foreground">
                  The Excel file should have the following columns:
                </p>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>from</TableHead>
                        <TableHead>to</TableHead>
                        <TableHead>statusCode</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>/old-page</TableCell>
                        <TableCell>/new-page</TableCell>
                        <TableCell>301</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>/removed-page</TableCell>
                        <TableCell></TableCell>
                        <TableCell>410</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Note:</strong> For 410 redirects (content gone), leave the &apos;to&apos; column empty.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}