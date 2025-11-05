import { Image as ImageIcon } from "lucide-react"
import { ConverterMetadata } from "@/types/converter"

/**
 * Media Converters Registry
 * All media conversion tools (images, videos, audio) are registered here
 */
export const mediaConverterTools: ConverterMetadata[] = [
  // Image Conversions
  {
    id: "image-converter",
    title: "Image Format Converter",
    description: "Convert images between JPG, PNG, WEBP and other formats",
    category: "image",
    icon: ImageIcon,
    href: "/media-converters/image-converter",
    keywords: ["image", "jpg", "png", "webp", "photo"],
    popular: true,
  },
  // Future media converters will be added here
]
