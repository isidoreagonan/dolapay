import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart(),
    nitro({
      preset: "vercel",
      externals: {
        inline: [
          "tslib",
          "@supabase/supabase-js",
          "@supabase/functions-js",
          "@supabase/auth-js",
          "@supabase/postgrest-js",
          "@supabase/realtime-js",
          "@supabase/storage-js",
        ],
      },
    }),
    react(),
  ],
  ssr: {
    noExternal: [
      "tslib",
      "@supabase/supabase-js",
      "@supabase/functions-js",
      "@supabase/auth-js",
      "@supabase/postgrest-js",
      "@supabase/realtime-js",
      "@supabase/storage-js",
    ],
  },
});
