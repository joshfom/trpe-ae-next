import { RedirectForm } from "@/features/admin/redirects/components/RedirectForm";
import { db } from "@/db/drizzle";
import { redirectTable } from "@/db/schema/redirect-table";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface EditRedirectPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditRedirectPage(props: EditRedirectPageProps) {
  const params = await props.params;
  const { id } = params;

  const redirects = await db
    .select()
    .from(redirectTable)
    .where(eq(redirectTable.id, id))
    .limit(1);

  if (redirects.length === 0) {
    return notFound();
  }

  const redirect = redirects[0] as unknown as {
    id: string
    fromUrl: string
    toUrl?: string
    statusCode: string
    isActive?: string
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Edit Redirect</h2>
      {/* //@ts-ignore */}
      <RedirectForm initialData={redirect} />
    </div>
  );
}