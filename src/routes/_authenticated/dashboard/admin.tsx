import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { useIsAdmin } from "./route";

export const Route = createFileRoute("/_authenticated/dashboard/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { data: isAdmin, isLoading } = useIsAdmin();
  if (isLoading) return <p className="text-sm text-muted-foreground">Vérification des permissions…</p>;
  if (!isAdmin) {
    return (
      <Card className="p-8 text-center">
        <ShieldAlert className="mx-auto h-8 w-8 text-rose-500" />
        <h2 className="mt-3 text-lg font-semibold">Accès refusé</h2>
        <p className="mt-1 text-sm text-muted-foreground">Cette zone est réservée aux administrateurs DolaPay.</p>
      </Card>
    );
  }
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("merchant_view");
  }
  return <Navigate to="/admin" replace />;
}
