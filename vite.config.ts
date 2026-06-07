import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const allowedHosts = ["https://crm.v3rii.com"];

function resolveVendorChunk(id: string): string | undefined {
  if (!id.includes("node_modules")) return undefined;

  if (id.includes("powerbi-client")) return "vendor-powerbi";
  if (id.includes("@tiptap")) return "vendor-tiptap";
  if (id.includes("xlsx")) return "vendor-xlsx";
  if (id.includes("pptxgenjs") || id.includes("jspdf")) return "vendor-doc-export";
  if (id.includes("recharts")) return "vendor-recharts";
  if (id.includes("html2canvas")) return "vendor-html2canvas";
  if (id.includes("react/") || id.includes("react-dom/") || id.includes("react-router-dom") || id.includes("react-i18next")) return "vendor-react";
  if (id.includes("@tanstack/react-query")) return "vendor-query";
  if (id.includes("@radix-ui/") || id.includes("/node_modules/radix-ui/")) return undefined;
  if (id.includes("react-hook-form") || id.includes("@hookform/resolvers") || id.includes("/node_modules/zod/")) return undefined;
  if (id.includes("@dnd-kit/")) return "vendor-dnd";
  if (id.includes("lucide-react") || id.includes("hugeicons-react")) return "vendor-icons";
  if (id.includes("i18next")) return "vendor-i18n";
  if (id.includes("axios") || id.includes("@microsoft/signalr")) return "vendor-network";
  if (id.includes("date-fns") || id.includes("motion") || id.includes("sonner")) return "vendor-ui-utils";

  return undefined;
}

export default defineConfig({
  // base: "/crm-ui/",
  base: "/",
  build: {
    modulePreload: {
      resolveDependencies: (_url, deps) => deps.filter((dep) => {
        return !(
          (dep.includes("feature-") &&
            !dep.includes("feature-access-control-core") &&
            !dep.includes("aqua-dashboard")) ||
          dep.includes("vendor-doc-export") ||
          dep.includes("vendor-tiptap") ||
          dep.includes("vendor-xlsx") ||
          dep.includes("vendor-recharts") ||
          dep.includes("vendor-html2canvas")
        );
      }),
    },
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          return resolveVendorChunk(id);
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: allowedHosts,
    host: "0.0.0.0",
  },
})
