import { createFileRoute } from "@tanstack/react-router";
import { Route as AdminRoute } from "@/routes/_authenticated/dashboard/admin";

export const Route = createFileRoute("/_authenticated/admin/compliance")({
  component: function ComplianceComponent() {
    const Comp = AdminRoute.options.component;
    return Comp ? <Comp /> : null;
  },
});
