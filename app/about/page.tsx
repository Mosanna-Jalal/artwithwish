import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="bg-[#FDFAF6]">

        {/* Page header band — sits directly below the fixed navbar */}
        <div className="pt-[72px] sm:pt-20 bg-[#FDFAF6]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 pt-14 sm:pt-20 lg:pt-28 pb-12 sm:pb-16">
            <p
              className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#C9A96E] mb-4"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Our Story
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-light text-[#1A1A1A] max-w-3xl leading-tight mb-8"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Art made from
              <br />
              <em className="not-italic gold-text">intention</em>
            </h1>

            <div className="arabesque-divider mb-10 max-w-xs opacity-50" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              <p
                className="text-base sm:text-lg text-[#4A4540] leading-relaxed"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                ArtWithWish was born from a lifelong love of Arabic letters. Each character
                carries a distinct spirit — a shape formed over centuries of devotion,
                scholarship, and artistic brilliance.
              </p>
              <p
                className="text-sm sm:text-base text-[#4A4540] leading-relaxed"
                style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                Every piece begins with stillness. Before pen meets paper, there is a breath,
                an intention, and a wish — for the person who will receive it, for the meaning
                it will carry in their space.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <section className="bg-[#F5EFE4] py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 lg:gap-12">
              {[
                { numeral: "I", title: "Tradition", text: "Rooted in classical Arabic calligraphy styles: Naskh, Thuluth, Diwani, and Riq'a." },
                { numeral: "II", title: "Intention", text: "Every word written carries meaning. Art created with purpose lasts beyond the canvas." },
                { numeral: "III", title: "Uniqueness", text: "No two pieces are identical. Each artwork is a one-of-a-kind original." },
              ].map((item) => (
                <div key={item.numeral} className="flex flex-col gap-3">
                  <span
                    className="text-4xl sm:text-5xl text-[#C9A96E]/40 font-light"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {item.numeral}
                  </span>
                  <h3
                    className="text-xl sm:text-2xl text-[#1A1A1A] font-light"
                    style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-[#4A4540] leading-relaxed"
                    style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-16 py-20 sm:py-24 text-center">
          <div className="arabesque-divider mb-10 opacity-50" />
          <h2
            className="text-3xl sm:text-4xl text-[#1A1A1A] font-light mb-5"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Begin your collection
          </h2>
          <p
            className="text-sm sm:text-base text-[#4A4540] mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            Browse available works or reach out to commission a custom piece.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/shop"
              className="px-9 py-4 bg-[#1A1A1A] text-[#FDFAF6] text-[10px] sm:text-xs tracking-[0.25em] uppercase hover:bg-[#C9A96E] transition-colors duration-300 text-center"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              View Shop
            </Link>
            <Link
              href="/contact"
              className="px-9 py-4 border border-[#C9A96E] text-[#C9A96E] text-[10px] sm:text-xs tracking-[0.25em] uppercase hover:bg-[#C9A96E] hover:text-[#FDFAF6] transition-all duration-300 text-center"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Contact Us
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
