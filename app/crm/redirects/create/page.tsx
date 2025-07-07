import {RedirectForm} from "@/features/admin/redirects/components/RedirectForm";

export default function CreateRedirectPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Create Redirect</h2>
      <RedirectForm />
    </div>
  );
}