import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { s3Service } from "@/lib/s3Service";

export const useDeleteInsight = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ slug, coverUrl }: { slug: string, coverUrl?: string }) => {
            // First delete the insight from the database
            const response = await client.api.admin.insights[":insightSlug"].$delete({
                param: { insightSlug: slug }
            });

            if (!response.ok) {
                throw new Error('Failed to delete insight');
            }

            // If there's a cover image, try to delete it from S3
            // But don't fail the entire operation if S3 deletion fails
            if (coverUrl) {
                try {
                    await s3Service.deleteFile(coverUrl);
                } catch (error) {
                    console.error('Error deleting image from S3:', error);
                    // Don't throw here, as the insight is already deleted from the database
                }
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success('Insight deleted successfully');
            queryClient.invalidateQueries({ queryKey: ["admin-insights"] });
        },
        onError: (error) => {
            console.error('Error deleting insight:', error);
            toast.error('An error occurred while deleting the insight');
        }
    });
};
