export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["Organization", "LocalBusiness", "Store"],
        name: "Golden Planet Watches",
        url: "https://goldenplanetwatches.com",
        logo: "https://goldenplanetwatches.com/favicon.ico",
        description:
          "Trusted luxury watch dealer in Dubai offering authenticated pre-owned and new timepieces from Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, TAG Heuer, and IWC.",
        foundingDate: "2010",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Dubai",
          addressCountry: "AE",
        },
        areaServed: [
          { "@type": "City", name: "Dubai" },
          { "@type": "Place", name: "Deira, Dubai" },
          { "@type": "Place", name: "Downtown Dubai" },
          { "@type": "Place", name: "Jumeirah, Dubai" },
          { "@type": "Place", name: "Palm Jumeirah, Dubai" },
          { "@type": "Place", name: "Dubai Marina" },
          { "@type": "Place", name: "Business Bay, Dubai" },
          { "@type": "Place", name: "DIFC, Dubai" },
        ],
        knowsLanguage: ["en", "ar", "fa", "ru", "zh"],
        priceRange: "$$$$",
        currenciesAccepted: "AED, USD",
        brand: [
          { "@type": "Brand", name: "Rolex" },
          { "@type": "Brand", name: "Patek Philippe" },
          { "@type": "Brand", name: "Audemars Piguet" },
          { "@type": "Brand", name: "Omega" },
          { "@type": "Brand", name: "Cartier" },
          { "@type": "Brand", name: "TAG Heuer" },
          { "@type": "Brand", name: "IWC" },
        ],
        sameAs: [],
      }}
    />
  )
}

export function WebSiteSchema() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Golden Planet Watches",
        url: "https://goldenplanetwatches.com",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://goldenplanetwatches.com/collections?search={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  )
}

export function ProductSchema({
  name,
  brand,
  description,
  price,
  image,
  condition,
  reference,
  url,
}: {
  name: string
  brand: string
  description: string
  price: number
  image: string
  condition: string
  reference: string
  url: string
}) {
  const conditionMap: Record<string, string> = {
    Unworn: "https://schema.org/NewCondition",
    Excellent: "https://schema.org/UsedCondition",
    "Very Good": "https://schema.org/UsedCondition",
    Good: "https://schema.org/UsedCondition",
    Fair: "https://schema.org/UsedCondition",
  }

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        brand: { "@type": "Brand", name: brand },
        description,
        sku: reference,
        image,
        url,
        itemCondition: conditionMap[condition] || "https://schema.org/UsedCondition",
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: "AED",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Golden Planet Watches",
          },
        },
      }}
    />
  )
}

export function ArticleSchema({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  author,
}: {
  title: string
  description: string
  image?: string
  url: string
  datePublished: string
  dateModified?: string
  author: string
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image: image || "https://goldenplanetwatches.com/favicon.ico",
        url,
        datePublished,
        dateModified: dateModified || datePublished,
        author: { "@type": "Person", name: author },
        publisher: {
          "@type": "Organization",
          name: "Golden Planet Watches",
          logo: {
            "@type": "ImageObject",
            url: "https://goldenplanetwatches.com/favicon.ico",
          },
        },
      }}
    />
  )
}

export function FAQSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  )
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  )
}
