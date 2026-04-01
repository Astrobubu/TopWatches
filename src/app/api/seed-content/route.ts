import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

const LOCATIONS = [
  {
    area_name: "Deira",
    slug: "deira",
    hero_image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
    intro_text: `<p>Deira is the historic heart of Dubai's trading culture and home to the world-famous <strong>Gold Souq</strong> — one of the largest gold markets on the planet. For over a century, Deira has been the epicenter of luxury goods trading in the Gulf, making it a natural destination for discerning watch collectors.</p><p>Golden Planet Watches is proudly located in the Gold Souq, at Al Dukhan Building, Shop No. 3. Our presence in this iconic market means you benefit from decades of established trust, competitive pricing driven by healthy market dynamics, and the ability to see and handle timepieces in person before committing.</p><p>Whether you're a resident of Deira or visiting from abroad, our location puts authenticated luxury watches within easy reach — just steps from the gold and spice souqs that make this district legendary.</p>`,
    why_buy_here: `<p>Deira offers unique advantages for luxury watch buyers that no other district in Dubai can match:</p><ul><li><strong>Gold Souq Heritage:</strong> The Gold Souq has been a trusted marketplace for precious goods since the 1940s. Buying here carries a level of market credibility built over generations.</li><li><strong>Competitive Pricing:</strong> The concentration of dealers in Deira creates healthy competition, ensuring you get fair market prices on pre-owned and new timepieces.</li><li><strong>In-Person Inspection:</strong> Unlike online-only dealers, our Gold Souq location lets you inspect, try on, and authenticate watches before purchase.</li><li><strong>Tax Advantages:</strong> Dubai's zero income tax and low import duties on luxury goods mean prices are often significantly lower than in Europe, the US, or Asia.</li><li><strong>Easy Access:</strong> Deira is served by multiple metro stations (Union, Baniyas Square, Al Ras) and is minutes from Dubai Creek and the airport.</li></ul>`,
    landmarks: [
      { name: "Gold Souq", description: "One of the world's largest gold markets, home to hundreds of retailers selling gold, precious stones, and luxury watches. Golden Planet Watches is located here." },
      { name: "Spice Souq", description: "Adjacent to the Gold Souq, this aromatic market has been a trading hub for centuries — a testament to Deira's deep commercial roots." },
      { name: "Deira City Centre", description: "One of Dubai's original mega-malls, offering a modern shopping experience just minutes from the traditional souqs." },
    ],
    faqs: [
      { question: "Where exactly is Golden Planet Watches in Deira?", answer: "We are located at Al Dukhan Building, Shop No. 3, Gold Souq, Deira, Dubai. You can find us easily by entering the Gold Souq from the main entrance near Al Ras Metro Station." },
      { question: "Is it safe to buy luxury watches in the Gold Souq?", answer: "Absolutely. The Gold Souq is one of the most regulated markets in Dubai. Golden Planet Watches provides certificates of authenticity with every purchase, and we've been trusted by collectors since 2010." },
      { question: "Can I negotiate prices at Golden Planet Watches?", answer: "Our prices are competitive and transparent. While the Gold Souq has a tradition of negotiation, we price our watches fairly from the start based on current market values. We're always happy to discuss." },
      { question: "Do you offer delivery from Deira to other parts of Dubai?", answer: "Yes, we offer free insured delivery across all of Dubai. Your watch will be securely packaged and delivered with full tracking." },
      { question: "What brands do you carry at your Deira location?", answer: "We carry Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, TAG Heuer, IWC, and other prestigious brands. Our inventory changes regularly — WhatsApp us to check availability of specific models." },
    ],
    map_embed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.5!2d55.297!3d25.270!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43225ff1b867%3A0x24e1f970e9697fb6!2sGold%20Souq!5e0!3m2!1sen!2sae!4v1" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
    nearby_areas: ["bur-dubai", "karama", "downtown-dubai"],
    seo_title: "Buy Luxury Watches in Deira, Dubai | Gold Souq Watch Dealer",
    seo_description: "Buy authenticated Rolex, Patek Philippe & AP watches in Deira's Gold Souq. Golden Planet Watches - trusted since 2010. Visit our shop or WhatsApp us today.",
    published: true,
  },
  {
    area_name: "Downtown Dubai",
    slug: "downtown-dubai",
    hero_image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=1600&q=80",
    intro_text: `<p><strong>Downtown Dubai</strong> is the crown jewel of the city — home to the Burj Khalifa, Dubai Mall, and the iconic Dubai Fountain. This is where luxury meets spectacle, and it's one of the most sought-after addresses for both residents and visitors seeking the finest things in life.</p><p>For luxury watch enthusiasts in Downtown Dubai, Golden Planet Watches offers a curated selection of authenticated timepieces delivered directly to your door. While the Dubai Mall houses several authorized brand boutiques, Golden Planet specializes in <strong>pre-owned and hard-to-find references</strong> at prices that authorized dealers simply can't offer.</p><p>Whether you live in the Burj Khalifa residences, Boulevard Point, or any of Downtown's premium towers, we bring the Gold Souq's expertise to your doorstep with free insured delivery.</p>`,
    why_buy_here: `<p>Downtown Dubai residents and visitors choose Golden Planet Watches for compelling reasons:</p><ul><li><strong>Access to Discontinued Models:</strong> The authorized boutiques in Dubai Mall carry current collections only. We specialize in discontinued and hard-to-find references that serious collectors seek — models you simply won't find at retail.</li><li><strong>Pre-Owned Value:</strong> A pre-owned Rolex Submariner or Patek Philippe Nautilus can save you 15-30% compared to retail, with the same quality and our authentication guarantee.</li><li><strong>Free Delivery to Downtown:</strong> We deliver anywhere in Downtown Dubai — to your residence, hotel, or office — fully insured with real-time tracking.</li><li><strong>WhatsApp Convenience:</strong> Skip the mall crowds. Browse our collection, ask questions, and place orders entirely through WhatsApp. Perfect for busy Downtown professionals.</li><li><strong>Investment Perspective:</strong> Many luxury watches, particularly Rolex and Patek Philippe, have appreciated significantly. Our team can advise on models with strong investment potential.</li></ul>`,
    landmarks: [
      { name: "Burj Khalifa", description: "The world's tallest building at 828 meters. Home to luxury residences, the Armani Hotel, and observation decks with breathtaking views of Dubai." },
      { name: "The Dubai Mall", description: "One of the world's largest shopping destinations with over 1,200 stores, including authorized boutiques for Rolex, Cartier, Omega, and more." },
      { name: "Dubai Fountain", description: "The world's largest choreographed fountain system, performing nightly at the base of Burj Khalifa — a symbol of Dubai's commitment to grandeur." },
    ],
    faqs: [
      { question: "Do you deliver luxury watches to Downtown Dubai?", answer: "Yes, we offer free insured delivery to all of Downtown Dubai, including Burj Khalifa residences, Boulevard towers, and hotels. Delivery is typically same-day or next-day." },
      { question: "How are your prices compared to Dubai Mall authorized dealers?", answer: "Our pre-owned watches are typically 15-30% less than retail prices at authorized dealers. For discontinued models, we often have the only available examples in the market." },
      { question: "Can I see watches in person before buying?", answer: "Absolutely. You can visit our Gold Souq showroom in Deira (15 minutes from Downtown by car), or we can arrange a viewing appointment at a convenient location in Downtown." },
      { question: "Are your watches covered by manufacturer warranty?", answer: "Many of our watches still carry their original manufacturer warranty. For all others, Golden Planet Watches provides our own 12-month comprehensive warranty covering mechanical issues." },
      { question: "What's the best luxury watch to buy as an investment in 2026?", answer: "Rolex Submariner, Daytona, and GMT-Master II remain strong investment pieces. Patek Philippe Nautilus and Audemars Piguet Royal Oak also consistently appreciate. Contact us for current market analysis." },
    ],
    nearby_areas: ["business-bay", "difc", "deira"],
    seo_title: "Buy Luxury Watches in Downtown Dubai | Free Delivery | Golden Planet Watches",
    seo_description: "Luxury watches delivered to Downtown Dubai. Pre-owned Rolex, Patek Philippe, AP at better prices than Dubai Mall. Free insured delivery. WhatsApp us.",
    published: true,
  },
  {
    area_name: "Jumeirah",
    slug: "jumeirah",
    hero_image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1600&q=80",
    intro_text: `<p><strong>Jumeirah</strong> is Dubai's most prestigious beachfront neighbourhood, stretching along the Arabian Gulf coast. Home to the iconic Burj Al Arab, Madinat Jumeirah, and some of the city's most exclusive villas, Jumeirah represents the pinnacle of luxury living in the UAE.</p><p>Jumeirah residents understand quality and craftsmanship. That same discernment applies to timepieces. Golden Planet Watches serves the Jumeirah community with authenticated luxury watches from the world's most coveted brands, delivered directly to your villa or residence.</p><p>From the beachfront villas of Jumeirah 1 to the gated communities of Jumeirah Islands, we bring Gold Souq authenticity and expertise to Dubai's most exclusive coastal neighbourhood.</p>`,
    why_buy_here: `<p>Jumeirah's affluent community deserves a watch dealer that matches their standards:</p><ul><li><strong>Curated Selection:</strong> We understand Jumeirah's aesthetic — classic elegance with a touch of distinction. Our collection is curated with this sensibility in mind.</li><li><strong>Privacy & Discretion:</strong> Many of our Jumeirah clients value privacy. We offer discreet delivery and private viewing appointments.</li><li><strong>Beach-Ready Timepieces:</strong> Living by the coast means you need watches that can handle salt, sand, and surf. We carry excellent dive watches from Rolex, Omega, and TAG Heuer.</li><li><strong>Concierge Service:</strong> Looking for a specific reference? Our personal concierge service will source it for you globally, authenticate it, and deliver it to your door.</li></ul>`,
    landmarks: [
      { name: "Burj Al Arab", description: "The world's most iconic luxury hotel, shaped like a sail. A symbol of Jumeirah and Dubai's commitment to being the best." },
      { name: "Madinat Jumeirah", description: "A luxurious resort complex with traditional Arabian architecture, boutique shopping, and waterway views." },
      { name: "Jumeirah Beach", description: "Miles of pristine white sand beach along the Arabian Gulf, one of Dubai's most desirable locations for luxury living." },
    ],
    faqs: [
      { question: "Do you deliver watches to Jumeirah?", answer: "Yes, we provide free insured delivery to all Jumeirah sub-communities including Jumeirah 1, 2, 3, Jumeirah Islands, and Jumeirah Park." },
      { question: "What dive watches do you recommend for Jumeirah's beach lifestyle?", answer: "The Rolex Submariner is the quintessential dive watch. We also recommend the Omega Seamaster and TAG Heuer Aquaracer for excellent water resistance and beach-ready durability." },
      { question: "Can I arrange a private viewing at my Jumeirah residence?", answer: "Yes, we offer private viewing appointments for Jumeirah residents. Contact us via WhatsApp to schedule a convenient time." },
    ],
    nearby_areas: ["palm-jumeirah", "dubai-marina", "al-barsha"],
    seo_title: "Buy Luxury Watches in Jumeirah, Dubai | Golden Planet Watches",
    seo_description: "Authenticated luxury watches for Jumeirah residents. Rolex, Patek Philippe, AP & more. Free delivery to Jumeirah 1, 2, 3 and Jumeirah Islands. WhatsApp us.",
    published: true,
  },
  {
    area_name: "Palm Jumeirah",
    slug: "palm-jumeirah",
    hero_image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
    intro_text: `<p>The <strong>Palm Jumeirah</strong> is Dubai's most recognisable landmark — a man-made island in the shape of a palm tree, visible from space. Home to Atlantis The Royal, ultra-luxury villas, and some of the world's most expensive real estate, the Palm attracts a global clientele that demands nothing but the best.</p><p>Palm Jumeirah residents include international business leaders, celebrities, and discerning collectors who appreciate the finest timepieces. Golden Planet Watches serves this exclusive community with authenticated luxury watches delivered directly to the Palm.</p>`,
    why_buy_here: `<p>Palm Jumeirah's exclusive community benefits from our specialised service:</p><ul><li><strong>Ultra-Luxury Focus:</strong> We carry the references Palm residents seek — Patek Philippe Grand Complications, Audemars Piguet Royal Oak Offshore, Rolex Daytona in precious metals.</li><li><strong>Direct-to-Door:</strong> Skip the mainland traffic. We deliver directly to your Palm villa or apartment, fully insured.</li><li><strong>Multi-Currency Transactions:</strong> Many Palm residents transact in USD, EUR, or GBP. We accommodate all major currencies.</li><li><strong>Resort-Style Service:</strong> Just as the Palm's hotels deliver five-star experiences, we bring that same level of service to luxury watch buying.</li></ul>`,
    landmarks: [
      { name: "Atlantis The Royal", description: "Dubai's newest ultra-luxury resort on the crescent of the Palm, featuring celebrity chef restaurants and exclusive experiences." },
      { name: "The Pointe", description: "Waterfront dining and entertainment district at the tip of the Palm, with stunning views of Atlantis." },
      { name: "Nakheel Mall", description: "The Palm's premier shopping destination, located at the trunk of the island with luxury retail and dining." },
    ],
    faqs: [
      { question: "How quickly can you deliver to Palm Jumeirah?", answer: "We typically deliver to the Palm within the same day. For urgent requests, we can arrange express delivery within 2-3 hours." },
      { question: "Do you buy watches from Palm Jumeirah residents?", answer: "Yes, we purchase pre-owned luxury watches. WhatsApp us photos and details of your timepiece for a quick valuation. We can arrange collection from your Palm residence." },
      { question: "What's the most popular watch among Palm Jumeirah residents?", answer: "The Rolex Daytona and Patek Philippe Nautilus are consistently our most requested models from Palm Jumeirah clients, followed by the AP Royal Oak." },
    ],
    nearby_areas: ["jumeirah", "dubai-marina", "jbr"],
    seo_title: "Luxury Watches in Palm Jumeirah | Delivered to Your Door | Golden Planet Watches",
    seo_description: "Premium luxury watches for Palm Jumeirah residents. Rolex, Patek Philippe, AP delivered to your villa. Authenticated & insured. WhatsApp for availability.",
    published: true,
  },
  {
    area_name: "Dubai Marina",
    slug: "dubai-marina",
    hero_image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&q=80",
    intro_text: `<p><strong>Dubai Marina</strong> is a vibrant waterfront community with stunning skyscrapers, a lively promenade, and a cosmopolitan population. Known for its yachts, rooftop bars, and dynamic lifestyle, the Marina attracts young professionals and entrepreneurs who appreciate both style and substance.</p><p>Golden Planet Watches serves Dubai Marina's fashion-forward community with timepieces that match their dynamic lifestyle — from sporty Omega Seamasters to iconic Rolex GMT-Masters.</p>`,
    why_buy_here: `<p>Dubai Marina's dynamic community finds unique value in our service:</p><ul><li><strong>Lifestyle-Matched Selection:</strong> We curate watches for the Marina lifestyle — sporty yet sophisticated, water-resistant yet elegant.</li><li><strong>Young Collector Programs:</strong> Starting your collection? We can guide first-time buyers toward entry-level luxury pieces from TAG Heuer, Omega, and Cartier that hold their value.</li><li><strong>Quick Delivery:</strong> Same-day delivery to all Marina towers including Marina Heights, Princess Tower, and Cayan Tower.</li><li><strong>Trade-Up Options:</strong> Ready to upgrade from your TAG Heuer to a Rolex? We offer trade-in programs that make stepping up easier.</li></ul>`,
    landmarks: [
      { name: "Marina Walk", description: "A 7km waterfront promenade lined with restaurants, cafes, and luxury yacht berths — the social heart of the Marina." },
      { name: "Ain Dubai", description: "The world's tallest observation wheel at 250 meters, offering panoramic views of the Marina, Palm Jumeirah, and beyond." },
      { name: "Marina Mall", description: "A boutique shopping destination at the heart of the Marina community, with waterfront dining and entertainment." },
    ],
    faqs: [
      { question: "What's a good first luxury watch for a Dubai Marina professional?", answer: "The Omega Seamaster Aqua Terra (around AED 20,000-25,000) or TAG Heuer Carrera (around AED 15,000-20,000) are excellent entry points that hold their value well." },
      { question: "Can I trade in my current watch for an upgrade?", answer: "Yes, we accept trade-ins. WhatsApp us details and photos of your current watch and let us know what you're looking to upgrade to. We'll give you a fair valuation." },
      { question: "Do you deliver to JLT as well?", answer: "Yes, we deliver to JLT (Jumeirah Lake Towers), DMCC, and all surrounding areas. Free insured delivery across Dubai." },
    ],
    nearby_areas: ["jbr", "palm-jumeirah", "al-barsha"],
    seo_title: "Buy Luxury Watches in Dubai Marina | Golden Planet Watches",
    seo_description: "Luxury watches for Dubai Marina residents. Rolex, Omega, TAG Heuer & more. Free same-day delivery to all Marina towers. Trade-in programs available.",
    published: true,
  },
  {
    area_name: "JBR",
    slug: "jbr",
    hero_image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
    intro_text: `<p><strong>Jumeirah Beach Residence (JBR)</strong> is Dubai's premier beachfront living destination, with a stunning Walk promenade, direct beach access, and a thriving community of residents and visitors. The Walk at JBR is one of the most popular leisure destinations in the city.</p><p>Golden Planet Watches delivers authenticated luxury timepieces to JBR residents and hotel guests, bringing Gold Souq expertise to this iconic beachfront address.</p>`,
    why_buy_here: `<p>JBR's beachfront lifestyle calls for watches that combine elegance with durability:</p><ul><li><strong>Beach-Proof Luxury:</strong> Living steps from the beach means you need a watch that handles saltwater. We specialise in dive-rated luxury watches from Rolex, Omega, and Breitling.</li><li><strong>Tourist-Friendly Service:</strong> Visiting JBR? We offer delivery to all JBR hotels including Hilton, Ritz-Carlton, and Sofitel. Take home an authenticated luxury watch as the ultimate Dubai souvenir.</li><li><strong>Bluewaters Island Access:</strong> Just across the bridge from JBR, Bluewaters Island adds another dimension of luxury living. We serve both communities.</li></ul>`,
    landmarks: [
      { name: "The Walk at JBR", description: "A 1.7km beachfront promenade with shops, restaurants, and entertainment — one of Dubai's most popular outdoor destinations." },
      { name: "Bluewaters Island", description: "Connected to JBR by a pedestrian bridge, home to Ain Dubai and Caesar's Palace." },
      { name: "JBR Beach", description: "One of Dubai's most popular public beaches, with crystal-clear waters and views of Ain Dubai and Palm Jumeirah." },
    ],
    faqs: [
      { question: "Can you deliver watches to my JBR hotel?", answer: "Yes, we deliver to all hotels in JBR and Bluewaters Island. We can coordinate with your hotel concierge for a smooth handover." },
      { question: "What water-resistant watches do you recommend for beach living?", answer: "The Rolex Submariner (300m), Omega Seamaster Planet Ocean (600m), and Tudor Pelagos (500m) are all excellent choices for beachfront living." },
    ],
    nearby_areas: ["dubai-marina", "palm-jumeirah", "al-barsha"],
    seo_title: "Luxury Watches in JBR Dubai | Beach-Ready Timepieces | Golden Planet Watches",
    seo_description: "Luxury watches for JBR residents and visitors. Water-resistant Rolex, Omega & more. Delivery to JBR hotels and residences. WhatsApp us today.",
    published: true,
  },
  {
    area_name: "Business Bay",
    slug: "business-bay",
    hero_image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=1600&q=80",
    intro_text: `<p><strong>Business Bay</strong> is Dubai's central business district, home to gleaming office towers, luxury residences, and the picturesque Dubai Water Canal. This is where Dubai's business elite live and work — professionals who understand that a luxury watch is both a personal statement and a business asset.</p><p>Golden Planet Watches provides Business Bay's professionals with timepieces that command respect in the boardroom. A well-chosen watch speaks volumes about attention to detail, taste, and success.</p>`,
    why_buy_here: `<p>Business Bay professionals benefit from our tailored approach:</p><ul><li><strong>Boardroom-Ready:</strong> We curate watches that project authority — Rolex Datejust, Patek Philippe Calatrava, and Omega Constellation are boardroom staples.</li><li><strong>Office Delivery:</strong> We deliver to your Business Bay office or residential tower. No need to take time out of your workday.</li><li><strong>Corporate Gifting:</strong> Looking for executive gifts? We advise on appropriate luxury watches for corporate gifting occasions.</li><li><strong>Dubai Canal Views:</strong> The beautiful Dubai Water Canal runs through Business Bay. Enjoy your new timepiece against one of Dubai's most scenic backdrops.</li></ul>`,
    landmarks: [
      { name: "Dubai Water Canal", description: "A stunning 3.2km waterway connecting Business Bay to the Arabian Gulf, with waterfront dining and pedestrian bridges." },
      { name: "Bay Avenue", description: "A lifestyle mall and promenade in the heart of Business Bay, with dining, retail, and a vibrant community atmosphere." },
      { name: "Executive Towers", description: "One of Business Bay's most prominent residential and commercial complexes, housing offices and luxury apartments." },
    ],
    faqs: [
      { question: "What watch makes the best impression in a business meeting?", answer: "A Rolex Datejust 41 in Oystersteel (around AED 35,000-45,000) is a timeless choice. For a bolder statement, the Audemars Piguet Royal Oak or Omega Constellation are excellent options." },
      { question: "Do you offer corporate gifting services?", answer: "Yes, we can help select appropriate luxury watches for corporate gifts, milestones, or awards. We offer bulk pricing and gift packaging. WhatsApp us to discuss your needs." },
      { question: "Can you deliver to my office in Business Bay?", answer: "Absolutely. We deliver to all Business Bay towers and offices. Just provide your building name and office number, and we'll handle the rest." },
    ],
    nearby_areas: ["downtown-dubai", "difc", "bur-dubai"],
    seo_title: "Luxury Watches for Business Bay Professionals | Golden Planet Watches Dubai",
    seo_description: "Boardroom-ready luxury watches delivered to Business Bay. Rolex, Patek Philippe, AP for professionals. Office delivery available. WhatsApp us.",
    published: true,
  },
  {
    area_name: "DIFC",
    slug: "difc",
    hero_image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=1600&q=80",
    intro_text: `<p>The <strong>Dubai International Financial Centre (DIFC)</strong> is the Middle East's leading financial hub, home to global banks, investment firms, and the region's most sophisticated professionals. DIFC is where wealth is managed, deals are made, and excellence is the baseline expectation.</p><p>Golden Planet Watches understands DIFC's clientele. Our watches are selected for professionals who view a timepiece as both a personal pleasure and a strategic asset — an heirloom that appreciates in value while commanding respect.</p>`,
    why_buy_here: `<p>DIFC professionals have unique requirements that we're positioned to meet:</p><ul><li><strong>Investment-Grade Timepieces:</strong> Many DIFC professionals view watches as alternative investments. We advise on models with the strongest appreciation potential.</li><li><strong>Wealth Preservation:</strong> In an era of market volatility, blue-chip watches from Rolex, Patek Philippe, and AP have proven to be reliable stores of value.</li><li><strong>Art & Finance Intersection:</strong> DIFC's Art Nights and Gallery District attract those who appreciate craftsmanship. Haute horlogerie sits at this same intersection of art and finance.</li><li><strong>Swift Service:</strong> Time is money in DIFC. Our WhatsApp ordering and same-day delivery ensure minimal disruption to your schedule.</li></ul>`,
    landmarks: [
      { name: "Gate Village", description: "DIFC's art and lifestyle hub, featuring world-class galleries, fine dining restaurants, and boutique retail." },
      { name: "The Gate Building", description: "The iconic arch-shaped building that serves as DIFC's landmark and houses the Dubai Financial Market authority." },
      { name: "DIFC Art Galleries", description: "Home to the Middle East's largest concentration of art galleries, including Christie's regional headquarters." },
    ],
    faqs: [
      { question: "Which watches are the best investments right now?", answer: "Rolex Daytona (especially steel models), Patek Philippe Nautilus 5711 (discontinued but highly sought), and AP Royal Oak 15202 are among the strongest performers. Market conditions change — WhatsApp us for current guidance." },
      { question: "Do you provide authentication certificates?", answer: "Yes, every watch comes with a Golden Planet Watches certificate of authenticity. For additional assurance, we can arrange independent third-party authentication." },
      { question: "Can I pay in USD or EUR?", answer: "Yes, we accept AED, USD, EUR, and GBP. We can quote in your preferred currency." },
    ],
    nearby_areas: ["downtown-dubai", "business-bay", "bur-dubai"],
    seo_title: "Investment-Grade Luxury Watches for DIFC Professionals | Golden Planet Watches",
    seo_description: "Luxury watches for DIFC finance professionals. Investment-grade Rolex, Patek Philippe, AP. Same-day delivery to DIFC. Multi-currency accepted.",
    published: true,
  },
  {
    area_name: "Al Barsha",
    slug: "al-barsha",
    hero_image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1600&q=80",
    intro_text: `<p><strong>Al Barsha</strong> is one of Dubai's most popular residential districts, known for its central location, excellent connectivity, and proximity to the Mall of the Emirates. A diverse and thriving community, Al Barsha is home to families, professionals, and entrepreneurs.</p><p>Golden Planet Watches serves Al Barsha residents with authenticated luxury timepieces at prices that deliver genuine value — an important consideration for smart buyers who know that luxury doesn't have to mean overpaying.</p>`,
    why_buy_here: `<p>Al Barsha residents enjoy practical advantages when buying from Golden Planet Watches:</p><ul><li><strong>Value-Conscious Luxury:</strong> Al Barsha residents are savvy. Our pre-owned watches offer 15-30% savings over retail while maintaining the same prestige and quality.</li><li><strong>Mall of the Emirates Proximity:</strong> While MoE has some watch retailers, we offer references and prices you won't find there.</li><li><strong>Family Occasions:</strong> Luxury watches make meaningful gifts for graduations, weddings, and milestones. We help families choose timepieces that become heirlooms.</li><li><strong>Central Delivery:</strong> Al Barsha's central location means fast delivery from our Gold Souq showroom.</li></ul>`,
    landmarks: [
      { name: "Mall of the Emirates", description: "One of Dubai's premier shopping destinations, featuring Ski Dubai, luxury brands, and world-class dining." },
      { name: "Al Barsha Pond Park", description: "A beautiful green space with a lake, jogging tracks, and family-friendly facilities — a favourite weekend destination." },
      { name: "MOE Metro Station", description: "Direct metro access connects Al Barsha to the rest of Dubai, including our Gold Souq location in Deira." },
    ],
    faqs: [
      { question: "What's a good luxury watch for a milestone gift?", answer: "For graduations, the Omega Speedmaster or TAG Heuer Monaco are classic choices. For weddings, a Rolex Datejust or Cartier Santos carries timeless elegance. Contact us to discuss your occasion." },
      { question: "How far is your showroom from Al Barsha?", answer: "Our Gold Souq showroom in Deira is about 25 minutes from Al Barsha by car, or you can take the Metro (Red Line to Green Line). We also offer free delivery to Al Barsha." },
    ],
    nearby_areas: ["dubai-marina", "jbr", "jumeirah"],
    seo_title: "Buy Luxury Watches in Al Barsha, Dubai | Golden Planet Watches",
    seo_description: "Luxury watches for Al Barsha residents. Pre-owned Rolex, Omega, Cartier at great value. Free delivery from Gold Souq. WhatsApp for availability.",
    published: true,
  },
  {
    area_name: "Bur Dubai",
    slug: "bur-dubai",
    hero_image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
    intro_text: `<p><strong>Bur Dubai</strong> is one of the oldest and most culturally rich districts in the city, sitting across Dubai Creek from Deira. Home to the Dubai Museum, Al Fahidi Historical Neighbourhood, and the bustling Textile Souq, Bur Dubai is where Dubai's heritage meets its commercial present.</p><p>Just a short abra ride from our Gold Souq showroom in Deira, Bur Dubai residents have easy access to Golden Planet Watches. We also offer free delivery to all Bur Dubai addresses.</p>`,
    why_buy_here: `<p>Bur Dubai's unique position offers watch buyers distinct advantages:</p><ul><li><strong>Heritage District Benefits:</strong> Being close to the Gold Souq means you can visit us easily for in-person viewings.</li><li><strong>Abra Ride Away:</strong> A traditional abra ride across Dubai Creek takes just 5 minutes and costs 1 AED — making our Gold Souq showroom the closest luxury watch destination.</li><li><strong>Cultural Context:</strong> Luxury watches are deeply appreciated in Gulf culture. Bur Dubai's heritage district is the perfect place to invest in a timepiece that bridges tradition and modernity.</li></ul>`,
    landmarks: [
      { name: "Dubai Museum", description: "Housed in the 18th-century Al Fahidi Fort, this museum showcases Dubai's transformation from fishing village to global metropolis." },
      { name: "Al Fahidi Historical District", description: "A beautifully preserved neighbourhood with traditional wind-tower architecture, art galleries, and cultural cafes." },
      { name: "Textile Souq", description: "A bustling market along the creek known for fabrics and tailoring — part of Bur Dubai's vibrant trading heritage." },
    ],
    faqs: [
      { question: "How do I get from Bur Dubai to your Gold Souq showroom?", answer: "The easiest way is the traditional abra (water taxi) across Dubai Creek — a 5-minute ride for just 1 AED. You can also drive (10 minutes) or take the Metro to Al Ras Station." },
      { question: "Do you deliver to Bur Dubai?", answer: "Yes, free insured delivery to all Bur Dubai areas including Al Fahidi, Mankhool, and Al Raffa." },
    ],
    nearby_areas: ["deira", "karama", "business-bay"],
    seo_title: "Luxury Watches in Bur Dubai | Near Gold Souq | Golden Planet Watches",
    seo_description: "Buy luxury watches in Bur Dubai. Just an abra ride from our Gold Souq showroom. Rolex, Patek Philippe, Omega. Free delivery across Bur Dubai.",
    published: true,
  },
  {
    area_name: "Karama",
    slug: "karama",
    hero_image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80",
    intro_text: `<p><strong>Karama</strong> is one of Dubai's most established residential communities, known for its central location, diverse population, and excellent value. A melting pot of cultures, Karama is home to a community that appreciates quality and understands the difference between genuine luxury and imitation.</p><p>Golden Planet Watches is committed to serving Karama's community with 100% authenticated luxury timepieces. In a market where counterfeits exist, our authentication guarantee provides the peace of mind that genuine watch enthusiasts deserve.</p>`,
    why_buy_here: `<p>Karama's central location and value-conscious community find genuine benefits in our approach:</p><ul><li><strong>Guaranteed Authenticity:</strong> Every watch from Golden Planet Watches comes with a certificate of authenticity. We stake our 16-year reputation on every piece we sell.</li><li><strong>Entry-Level Luxury:</strong> We carry authenticated pre-owned TAG Heuer, Omega, and Cartier starting from AED 8,000 — making genuine luxury accessible.</li><li><strong>Central Location:</strong> Karama is centrally located, making our Gold Souq showroom easy to reach by Metro (ADCB Station) or car.</li><li><strong>Layaway Options:</strong> Ask about our flexible payment arrangements for qualifying purchases.</li></ul>`,
    landmarks: [
      { name: "Karama Market", description: "A well-known shopping district popular with residents and tourists, featuring electronics, clothing, and household goods." },
      { name: "Karama Centre", description: "A community shopping complex serving as the social and commercial hub of the neighbourhood." },
      { name: "Zabeel Park", description: "One of Dubai's largest parks, located adjacent to Karama, offering green spaces, a lake, and the Dubai Frame." },
    ],
    faqs: [
      { question: "How can I be sure a watch from Golden Planet is authentic?", answer: "Every watch undergoes multi-point authentication by our certified watchmakers. We provide a certificate of authenticity, and we're happy to arrange independent third-party verification at your request." },
      { question: "What's the most affordable luxury watch you carry?", answer: "Pre-owned TAG Heuer and entry-level Omega models start from around AED 8,000-12,000. These are genuine luxury timepieces that hold their value well." },
      { question: "Is Karama close to the Gold Souq?", answer: "Yes, Karama is about 10-15 minutes from the Gold Souq by car or Metro. You can also take the abra from the nearby creek crossing points." },
    ],
    nearby_areas: ["bur-dubai", "business-bay", "downtown-dubai"],
    seo_title: "Authentic Luxury Watches in Karama, Dubai | Golden Planet Watches",
    seo_description: "Guaranteed authentic luxury watches for Karama residents. TAG Heuer from AED 8K. Rolex, Omega, Cartier. Certificate of authenticity with every watch.",
    published: true,
  },
]

export async function GET() { return seed() }
export async function POST() { return seed() }

async function seed() {
  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ error: "No admin client" }, { status: 500 })

  const results = { locations: 0, errors: [] as string[] }

  for (const loc of LOCATIONS) {
    const { error } = await admin.from("location_pages").upsert(loc, { onConflict: "slug" })
    if (error) {
      results.errors.push(`${loc.area_name}: ${error.message}`)
    } else {
      results.locations++
    }
  }

  return NextResponse.json({
    message: `Seeded ${results.locations} location pages`,
    errors: results.errors,
  })
}
