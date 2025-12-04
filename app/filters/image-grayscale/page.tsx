import { ImageFilter } from "@/components/shared/image-filter"
import { AboutDescription } from "@/components/ui/about-description"
import toolContent from "./image-grayscale.json"

export default function ImageGrayscalePage() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{toolContent.pageTitle}</h1>
            <p className="text-muted-foreground">
              {toolContent.pageDescription}
            </p>
          </div>

          <ImageFilter
            title="Grayscale Image Filter"
            description="Upload an image and apply a grayscale filter with adjustable intensity"
            filterType="grayscale"
          />


          <AboutDescription
            title={toolContent.aboutTitle}
            description={toolContent.aboutDescription}
            sections={toolContent.sections}
          />
        </div>

        <div className="lg:col-span-1">
        </div>
      </div>
    </div>
  )
}
