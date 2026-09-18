import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "8x Marketplace",
    short_name: "8x",
    description: "8x Marketplace ecommerce application.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f1e8",
    theme_color: "#171412"
  };
}
