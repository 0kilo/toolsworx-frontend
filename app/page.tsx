import { ConverterCard } from "@/components/converters/converter-card"
import { HeaderAd, InContentAd } from "@/components/ads/ad-unit"
import { converters, getPopularConverters } from "@/lib/converters/registry"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function HomePage() {
  const popularConverters = getPopularConverters()

  return (
    <div className="container py-8 md:py-12">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 sm:text-5xl md:text-6xl">
          Free Online Conversion Tools
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Convert documents, images, videos, and units instantly. Fast, secure, and completely free.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search converters..."
            className="pl-10 h-12"
          />
        </div>
      </section>

      {/* Top Ad */}
      <HeaderAd />

      {/* Popular Converters */}
      <section id="converters" className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Popular Converters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularConverters.map((converter) => (
            <ConverterCard key={converter.id} converter={converter} />
          ))}
        </div>
      </section>

      {/* Middle Ad */}
      <InContentAd />

      {/* All Converters by Category */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">All Converters</h2>

        {/* Temperature */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            Temperature Conversions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {converters
              .filter((c) => c.category === "temperature")
              .map((converter) => (
                <ConverterCard key={converter.id} converter={converter} />
              ))}
          </div>
        </div>

        {/* Distance */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            Distance Conversions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {converters
              .filter((c) => c.category === "distance")
              .map((converter) => (
                <ConverterCard key={converter.id} converter={converter} />
              ))}
          </div>
        </div>

        {/* Weight */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            Weight Conversions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {converters
              .filter((c) => c.category === "weight")
              .map((converter) => (
                <ConverterCard key={converter.id} converter={converter} />
              ))}
          </div>
        </div>

        {/* Volume */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            Volume Conversions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {converters
              .filter((c) => c.category === "volume")
              .map((converter) => (
                <ConverterCard key={converter.id} converter={converter} />
              ))}
          </div>
        </div>

        {/* File Conversions */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            File Conversions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {converters
              .filter((c) => ["document", "image", "video", "audio"].includes(c.category))
              .map((converter) => (
                <ConverterCard key={converter.id} converter={converter} />
              ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="mb-16">
        <div className="bg-muted rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">About Our Conversion Tools</h2>
          <p className="text-lg text-muted-foreground mb-4">
            We provide fast, accurate, and completely free conversion tools for all your needs.
            Whether you need to convert documents, images, videos, or units of measurement,
            we&apos;ve got you covered.
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>100% Free - No registration required</li>
            <li>Privacy Focused - Files are automatically deleted after conversion</li>
            <li>Fast & Accurate - Powered by industry-standard conversion libraries</li>
            <li>Mobile Friendly - Works perfectly on all devices</li>
            <li>Regular Updates - New converters added frequently</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
