import { ImageFilter } from "@/components/shared/image-filter"
import { AboutDescription } from "@/components/ui/about-description"

export default function ImageInversePage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Inverse Filter</h1>
            <p className="text-muted-foreground">
              Invert image colors for negative effects
            </p>
          </div>

          <ImageFilter
            title="Inverse Image Filter"
            description="Upload an image and apply an inverse/negative filter"
            filterType="inverse"
          />


          <AboutDescription
            title="About Inverse Filter"
            description="Inverse filter creates a negative effect by inverting all colors in the image, turning light areas dark and dark areas light."
            sections={[
              {
                title: "Creative Uses",
                content: [
                  "Artistic negative effects",
                  "X-ray style imagery",
                  "High contrast design elements",
                  "Unique social media content",
                  "Film photography simulation"
                ]
              },
              {
                title: "How It Works",
                content: [
                  "Inverts RGB values (255 - original value)",
                  "White becomes black, black becomes white",
                  "Colors become their complementary opposites",
                  "Maintains image structure and detail"
                ]
              }
            ]}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}