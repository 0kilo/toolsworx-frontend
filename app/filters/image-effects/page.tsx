import { UnifiedImageFilter } from "../unified-image-filter"
import { Card, CardContent } from "@/components/ui/card"

export default function ImageEffectsPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Image Effects & Filters</h1>
            <p className="text-muted-foreground">
              Apply professional filters and effects to your images with real-time preview
            </p>
          </div>

          <UnifiedImageFilter />

          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Available Filters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">Basic Filters</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Grayscale - Convert to black and white</li>
                    <li>• Sepia - Warm, vintage tone</li>
                    <li>• Vintage - Retro photo effect</li>
                    <li>• Inverse - Negative colors</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Adjustments</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Brightness - Lighten or darken</li>
                    <li>• Contrast - Enhance differences</li>
                    <li>• Saturation - Color intensity</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Instagram Filters</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Nashville - Warm, reduced contrast</li>
                    <li>• Valencia - Warm, faded look</li>
                    <li>• X-Pro II - High contrast, saturated</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Real-time preview</li>
                    <li>• Adjustable intensity</li>
                    <li>• Client-side processing</li>
                    <li>• No file upload to server</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1"></div>
      </div>
    </div>
  )
}
