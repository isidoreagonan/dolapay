import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { role } = Route.useRouteContext();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Bienvenue, {role === "admin" ? "Administrateur" : "Gérant"}</h1>
        <p className="text-muted-foreground mt-1">Gérez les approbations KYC et la conformité des marchands DolaPay.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center gap-2 font-semibold mb-2">
            <ShieldAlert className="h-5 w-5 text-amber-500" />
            Vérifications en attente
          </div>
          <p className="text-sm text-muted-foreground">Consultez l'onglet "Validations KYC" pour approuver ou rejeter les pièces d'identité soumises par les marchands.</p>
        </div>
      </div>
    </div>
  );
}
