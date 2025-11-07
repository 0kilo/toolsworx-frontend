import { ImageFilter } from "@/components/shared/image-filter"
import { SidebarAd, FooterAd } from "@/components/ads/ad-unit"
import { AboutDescription } from "@/components/ui/about-description"

export default function ImageGrayscalePage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Grayscale Filter</h1>
            <p className="text-muted-foreground">
              Convert your images to grayscale with adjustable intensity
            </p>
          </div>

          <ImageFilter
            title="Grayscale Image Filter"
            description="Upload an image and apply a grayscale filter with adjustable intensity"
            filterType="grayscale"
          />

          <FooterAd />

          <AboutDescription
            title="About Grayscale Filter"
            description="Grayscale conversion removes color information while preserving luminance, creating classic black and white images."
            sections={[
              {
                title: "When to Use Grayscale",
                content: [
                  "Professional photography and portraits",
                  "Vintage or artistic effects",
                  "Print materials to save on color costs",
                  "Accessibility improvements for colorblind users",
                  "Focus attention on composition and contrast"
                ]
              },
              {
                title: "Technical Details",
                content: [
                  "Preserves image luminance and contrast",
                  "Uses weighted RGB conversion (0.299R + 0.587G + 0.114B)",
                  "Maintains original image dimensions and quality",
                  "Compatible with all common image formats"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
          <SidebarAd />
        </div>
      </div>
    </div>
  )
}
