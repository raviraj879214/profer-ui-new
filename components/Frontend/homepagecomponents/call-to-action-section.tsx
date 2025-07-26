import Link from "next/link"

export default function CallToActionSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 space-y-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What are you waiting for?</h2>
        <Link
          href="#"
          className="inline-flex h-12 items-center justify-center rounded-md bg-profer-orange px-8 py-3 text-lg font-medium text-white shadow transition-colors hover:bg-profer-orange/90"
          prefetch={false}
        >
          Join for free today
        </Link>
      </div>
    </section>
  )
}
