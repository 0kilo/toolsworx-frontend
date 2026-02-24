import { Wrench } from "lucide-react"
import { BlogPostMetadata } from "@/types/blog"

export const blogApplicationPosts: BlogPostMetadata[] = [
  {
    id: "route-time-cost-fuel-vietnam",
    title: "Applying Route Time, Cost & Fuel Planner on Vietnam Route",
    description: "A real planning example using imported Google Maps route data and fuel assumptions.",
    href: "/blog/applications/route-time-cost-fuel-vietnam",
    subcategory: "applications",
    category: 'blog',
    icon: Wrench,
    thumbnail: "/media/IMG_3833.jpg",
    publishedAt: "2026-02-22",
    tags: ["route planner", "fuel", "budget", "google maps"],
  },
]
