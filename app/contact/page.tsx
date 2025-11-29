import { ContactForm } from "./contact-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | TOOLS WORX",
  description: "Get in touch with TOOLS WORX for support, questions, or feedback about our online conversion tools and calculators.",
}

export default function ContactPage() {

  return (
    <div className="container py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-muted-foreground">
          Have a question or need help? We're here to assist you.
        </p>
      </div>

        <ContactForm />
    </div>
  )
}