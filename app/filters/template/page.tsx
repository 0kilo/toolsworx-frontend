import { ImageFilter } from "@/components/shared/image-filter"
import { AboutDescription } from "@/components/ui/about-description"

export default function TemplateFilterPage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Template Filter</h1>
            <p className="text-muted-foreground">
              Apply template filter to your images
            </p>
          </div>

          <ImageFilter
            title="Template Image Filter"
            description="Upload an image and apply a template filter with adjustable intensity"
            filterType="template"
          />

          <AboutDescription
            title="About Template Filter"
            description="Template filter description and functionality."
            sections={[
              {
                title: "When to Use",
                content: [
                  "Use case 1",
                  "Use case 2",
                  "Use case 3"
                ]
              },
              {
                title: "Technical Details",
                content: [
                  "Technical detail 1",
                  "Technical detail 2",
                  "Technical detail 3"
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