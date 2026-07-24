import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/pawapay-availability")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const res = await fetch("https://api.pawapay.io/availability", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          
          if (!res.ok) {
            return Response.json({ error: "Failed to fetch from PawaPay" }, { status: res.status });
          }
          
          const data = await res.json();
          return Response.json(data);
        } catch (error) {
          console.error("PawaPay Availability Proxy Error:", error);
          return Response.json({ error: "Internal Server Error" }, { status: 500 });
        }
      },
    },
  },
});
