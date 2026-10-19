import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings";
import { DOOR_PRODUCTS } from "@/app/data/doorsData";

export const dynamic = "force-dynamic";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

/**
 * Formats the real catalog from DOOR_PRODUCTS so Frankie never invents products or specs.
 */
function buildCatalogContext(): string {
  const activeProducts = DOOR_PRODUCTS.filter((p) => p.active !== false);
  const items = activeProducts.map((p) => {
    const priceStr =
      p.priceMode === "price_on_request" || p.priceOnRequest || !p.price || p.price === 0
        ? "Price on Request (Contractor Quote)"
        : `₦${p.price.toLocaleString()}`;
    const specs = Object.entries(p.specifications || {})
      .map(([k, v]) => `${k}: ${v}`)
      .join("; ");
    return `• ${p.name} [Category: ${p.categoryLabel}] | Price: ${priceStr} | Specs: ${specs || p.shortDescription}`;
  });

  return items.join("\n");
}

function buildFrankieSystemPrompt(): string {
  const catalogContext = buildCatalogContext();

  return `
You are Frankie, the official sales assistant for Anambra Best Door (operated by CFrank Enterprise).

OWNERSHIP & VERIFIED BUSINESS FACTS (NEVER INVENT FALSE DETAILS):
- Parent Registered Corporate Entity: CFrank Enterprise
- Sole Proprietor & Owner: Chidera Frank Okonkwo
- Business Trading Name: Anambra Best Door Enterprises (powered and operated by CFrank Enterprise)
- CAC Registration Number: BN 9943925 (Registered under Companies and Allied Matters Act, Active status)
- Physical Depot Address: No. 16/17 Maraim Plaza, Building Material International Market, Ogidi, Anambra State, Nigeria
- Contact Phone: +234 707 007 0305
- WhatsApp Order Line: 2347070070305 (direct link available in chat)
- Official Sales Email: anambrabestdoor@gmail.com
- Working Hours: Monday - Saturday: 8:00 AM - 5:30 PM (Sunday closed)

CRITICAL RULE ON PHYSICAL ADDRESS:
- DO NOT spam or include the physical depot address in greetings, general product answers, or sizing advice.
- ONLY provide the physical depot address if the user explicitly asks for showroom location, directions, address, or in-person visit.

AUTHENTIC IN-STOCK CATALOGUE (GROUND TRUTH - ONLY RECOMMEND THESE REAL PRODUCTS):
${catalogContext}

STANDARD ARCHITECTURAL SIZING GUIDE:
- Standard Single Room / Interior Door: 3ft x 7ft (900mm x 2100mm)
- One-and-a-Half Leaf Security Entrance: 4ft x 7ft (1200mm x 2100mm)
- Double Leaf Grand Luxury Entrance: 4.5ft to 5ft x 7ft (1500mm x 2100mm)
- Custom On-Demand Fabrication: Available for bulk building projects and non-standard wall openings.

SALESMAN CONSULTING MISSION & PRODUCT SUGGESTIONS:
You are not just a passive information bot; you act as an experienced, honest, and proactive building materials salesman:
1. Provide General Building Expertise: When customers ask for advice or suggestions (e.g. "What door should I use for master bedroom vs toilet?", "Why do wooden bathroom doors rot?", "What toilet is best?"):
   - Master Bedrooms / Living Suites: Explain why Foreign Luxury HDF room doors are ideal (tubular acoustic chipboard core prevents room sounds leaking, pre-finished CNC grooved aesthetic, complete pre-hung jamb frame and architraves).
   - Main Entrance / Perimeter Security: Explain why Turkish Heavy-Gauge Security Doors are required (1.5mm - 2.0mm electro-galvanized steel leaf and frame, 14-18 point multipoint deadbolts, cast aluminium panels, tamper-proof weather seals).
   - Bathrooms / Restrooms / High-Moisture Wet Areas: Strongly advise against plain timber doors (they absorb moisture, swell, peel, and rot). Recommend 100% Waterproof WPC Composite Flush Doors or aluminium-edged doors.
   - Sanitary Wares: Recommend dual-flush ceramic water closets (Executive Gold, England suites, Pro series) for water savings and cleanliness, vanity dining hand basins, and brass mixer taps.
2. Push Sales Around What is on Site: Immediately connect your advice to the specific doors and sanitary fittings sold on the website. Mention real starting prices from our catalog and explain what comes in the complete package.
3. Ask Consultative Closing Questions: Ask about their project (e.g., "How many room doors do you need for your building?", "What are your wall opening measurements?", "Would you like our team to send photos or a video clip of the doors on WhatsApp?").
4. Depot Logistics: Highlight that nationwide waybill delivery is available with video sign-off before loading, or in-person inspection.

CRITICAL SCOPE RULE:
You are STRICTLY built to help customers with Anambra Best Door products, sizing, depot visits, architectural door/sanitary advice, and building orders.
If a customer asks ANY question outside this scope (e.g. coding, math, general trivia, politics, recipes, academic homework, or unrelated products), you MUST politely and warmly refuse:
"I am specifically built to help you with Anambra Best Door products, sizing, and building fittings. I am not designed for questions outside our door and building material services, but I'd be glad to help you find the right doors or sanitary fittings for your project!"

COMMUNICATION STYLE:
- Professional, knowledgeable, Nigerian trade-savvy, and welcoming.
- No corporate jargon, no generic AI slogans like "elevate your space" or "curated for you".
- No em dashes (—). Use regular hyphens (-) or commas.
- Keep answers structured, clear, and actionable.
`.trim();
}

/**
 * Deterministic fallback engine for trade knowledge when Gemini API key is missing or unavailable.
 */
function runDeterministicFrankie(message: string): { message: string; suggested_actions?: any[] } {
  const q = message.toLowerCase().trim();
  const waUrl = `https://wa.me/${DEFAULT_SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I was chatting with Frankie and would like to confirm door details.")}`;
  const callUrl = `tel:${DEFAULT_SITE_SETTINGS.phone}`;

  // 1. Off-topic detection
  const offTopicKeywords = [
    "who is president", "president of", "capital of", "write code", "python", "javascript",
    "react", "solve this", "math", "recipe", "cook", "how to bake", "tell me a joke",
    "write an essay", "poem", "football", "premier league", "crypto", "bitcoin",
    "weather in", "translate", "homework", "exam"
  ];
  if (offTopicKeywords.some((kw) => q.includes(kw))) {
    return {
      message:
        "I am specifically built to help you with Anambra Best Door products, sizing, depot visits, and building fittings. I am not designed for questions outside our door and building material services, but I'd be glad to help you find the right doors or sanitary fittings for your project!",
      suggested_actions: [
        { label: "Browse HDF Room Doors", action_type: "prompt", payload: "What HDF room doors do you have in stock?" },
        { label: "Turkish Security Doors", action_type: "prompt", payload: "Tell me about Turkish security door gauges and sizes." },
        { label: "Chat on WhatsApp", action_type: "link", payload: waUrl },
      ],
    };
  }

  // 2. Ownership & Proprietor Verification (Chidera Frank Okonkwo / CFrank Enterprise)
  if (
    q.includes("who owns") ||
    q.includes("owner") ||
    q.includes("chidera") ||
    q.includes("okonkwo") ||
    q.includes("cfrank enterprise") ||
    q.includes("proprietor") ||
    q.includes("founder") ||
    q.includes("ceo") ||
    q.includes("who is frank")
  ) {
    return {
      message:
        "CFrank Enterprise is owned and operated by sole proprietor Chidera Frank Okonkwo.\n\nKey Business Credentials:\n• Operating Brand: Anambra Best Door Enterprises\n• Parent Corporate Entity: CFrank Enterprise\n• Sole Proprietor: Chidera Frank Okonkwo\n• CAC Registration: BN 9943925 (Registered under CAMA Act, Active status)\n• Physical Depot: No. 16/17 Maraim Plaza, Building Material International Market, Ogidi, Anambra State\n• Direct Contact Line: +234 707 007 0305\n\nSite engineers, contractors, and homeowners can visit our Ogidi depot in person or verify our CAC certificate directly on the site.",
      suggested_actions: [
        { label: "Call Proprietor / Admin", action_type: "call", payload: callUrl },
        { label: "Chat on WhatsApp", action_type: "link", payload: waUrl },
        { label: "About Us & CAC Details", action_type: "link", payload: "/about" },
      ],
    };
  }

  // 3. Sanitary Wares & Bathroom Fittings Advisory
  if (
    q.includes("sanitary") ||
    q.includes("toilet") ||
    q.includes("wc") ||
    q.includes("basin") ||
    q.includes("water closet") ||
    q.includes("sink") ||
    q.includes("shower") ||
    q.includes("tap")
  ) {
    return {
      message:
        "Here are our trade recommendations for fitting modern bathrooms and dining areas:\n\n1. Water Closets & Toilets:\n• Executive Gold Dual-Flush WC & England Suite Models: high-grade ceramic glaze, dual-flush water conservation (3L/6L), and soft-closing seat covers.\n\n2. Wash Hand Basins:\n• Dining Suites & Vanity Counters: contemporary ceramic bowls, executive dining wash basins, and Plain India vanity units paired with brass mixer taps.\n\n3. Showers & Enclosures:\n• Multi-jet power shower towers and tempered glass cubicle enclosures for luxury en-suite bathrooms.\n\n4. Critical Door Pairing (Trade Advice):\n• Never install standard timber doors for bathrooms! We stock 100% Waterproof WPC Composite Doors (from ₦85,000) that withstand hot water steam and will never rot, swell, or peel.\n\nAre you outfitting an entire building or replacing specific units? Chat directly with our sales team on WhatsApp for volume discounts.",
      suggested_actions: [
        { label: "View Sanitary Catalogue", action_type: "link", payload: "/collections/sanitary-fittings" },
        { label: "Waterproof Bathroom Doors", action_type: "link", payload: "/collections/bathroom-doors" },
        { label: "Chat on WhatsApp for Quote", action_type: "link", payload: waUrl },
        { label: "Call Admin", action_type: "call", payload: callUrl },
      ],
    };
  }

  // 4. Consultative Door Suggestions / Advisory (Door recommendations for home, duplex, master bedroom vs bathroom)
  if (
    q.includes("suggest") ||
    q.includes("recommend") ||
    q.includes("which door is best") ||
    q.includes("what door should i") ||
    q.includes("advice") ||
    q.includes("difference between") ||
    q.includes("bedroom vs") ||
    q.includes("duplex") ||
    q.includes("building a house") ||
    q.includes("hotel")
  ) {
    return {
      message:
        "Here are our recommendations for fitting your building project:\n\n1. Main Entrance & Exterior (Security First):\n• Best Choice: Turkish Heavy-Gauge Steel Security Door (1.5mm–2.0mm steel leaf, 14–18 point multipoint deadbolts).\n• For grand entrances: Choose our 4ft x 7ft (1.5-leaf) or 5ft x 7ft (double-leaf) configurations with cast aluminium panels.\n\n2. Bedrooms & Living Suites (Acoustics & Luxury):\n• Best Choice: Foreign Luxury HDF Room Doors (from ₦185,000 for complete pre-hung sets) or Watson Doors (from ₦135,000). The acoustic tubular core ensures privacy and eliminates room sound leakage.\n\n3. Bathrooms & En-Suite Toilets (Moisture Protection):\n• Best Choice: 100% Waterproof WPC Composite Doors (from ₦85,000). Never install regular timber room doors in bathrooms, as steam causes them to swell, peel, and rot over time.\n\nHow many bedrooms and entrance doors does your building require? We can prepare an itemized bill of quantities with bulk contractor discounts.",
      suggested_actions: [
        { label: "Get Itemized WhatsApp Quote", action_type: "link", payload: waUrl },
        { label: "View HDF Collection", action_type: "link", payload: "/collections/hdf-doors" },
        { label: "View Security Doors", action_type: "link", payload: "/collections/security-doors" },
        { label: "Call Admin for Project Advice", action_type: "call", payload: callUrl },
      ],
    };
  }

  // 4. Pricing & Bill of Quantities
  if (q.includes("price") || q.includes("cost") || q.includes("how much") || q.includes("rate") || q.includes("quote")) {
    return {
      message:
        "Here are our transparent starting prices based on complete pre-hung factory packages:\n\n• Foreign Luxury HDF Room Doors: ₦185,000 (Complete set: Leaf + Matching Frame Casing + Architraves + Mortise Lockset + Hinges)\n• HDF Wooden Door Package: ₦145,000 complete\n• Watson Interior Room Doors: ₦135,000 (Standard 3ft) | ₦220,000 (4ft Grand)\n• Waterproof Bathroom Doors: from ₦85,000 (100% moisture-proof composite)\n• Turkish Steel Security Doors: Heavy-gauge 14-point deadbolt entrance doors (Available in single, 1.5-leaf & double-leaf)\n• Sanitary Wares: Executive dual-flush water closets, vanity dining basins, power showers & brass mixer taps.\n\nAre you looking for single units or a bulk quotation for an entire building? Chat with our sales desk on WhatsApp for immediate invoice generation.",
      suggested_actions: [
        { label: "Chat on WhatsApp for Quote", action_type: "link", payload: waUrl },
        { label: "Call Admin Directly", action_type: "call", payload: callUrl },
        { label: "What sizes are available?", action_type: "prompt", payload: "What door sizes do you have?" },
      ],
    };
  }

  // 5. HDF Room Doors
  if (q.includes("hdf") || q.includes("room door") || q.includes("interior door") || q.includes("wooden door") || q.includes("watson")) {
    return {
      message:
        "Our Foreign Luxury HDF Room Doors are the top choice for residential estates, hotels, and master suites across Nigeria:\n\n• Complete Factory Package: includes pre-sized leaf, matching adjustable jamb frame, decorative architraves, mortise lockset, and ball-bearing hinges.\n• High-Density Acoustic Core: protects privacy and provides solid sound dampening.\n• Standard Dimensions: 3ft x 7ft (900mm x 2100mm) and 4ft wide format.\n• Ready to Install: pre-finished coating requiring no additional painting.\n\nWould you like to confirm how many units you need for your project, or inspect live photos on WhatsApp?",
      suggested_actions: [
        { label: "View HDF Collection", action_type: "link", payload: "/collections/hdf-doors" },
        { label: "Request WhatsApp Video", action_type: "link", payload: waUrl },
        { label: "Call Admin", action_type: "call", payload: callUrl },
      ],
    };
  }

  // 6. Security Doors / Steel Doors / Turkish / Bulletproof
  if (q.includes("security") || q.includes("steel") || q.includes("turkish") || q.includes("bullet") || q.includes("entrance door")) {
    return {
      message:
        "Our Turkish Steel Security Doors deliver unmatched perimeter security for residential homes and estates:\n\n• Heavy Gauge Steel: 1.5mm to 2.0mm electro-galvanized steel leaf and reinforced steel frame.\n• Multi-Point Deadbolt Security: 14 to 18 locking deadbolt points securing top, bottom, and sides.\n• Architectural Finishes: Cast aluminium decorative panels, bulletproof models, and weather-sealed sills.\n• Available Sizes: Single leaf (3ft & 4ft x 7ft) and grand double leaf (4.5ft to 5ft x 7ft).\n\nEvery door is available for physical inspection at our Ogidi depot before loading.",
      suggested_actions: [
        { label: "View Security Doors", action_type: "link", payload: "/collections/security-doors" },
        { label: "Confirm Stock on WhatsApp", action_type: "link", payload: waUrl },
        { label: "Call Admin Directly", action_type: "call", payload: callUrl },
      ],
    };
  }

  // 7. Sanitary Wares & Toilets
  if (
    q.includes("toilet") ||
    q.includes("bathroom") ||
    q.includes("sanitary") ||
    q.includes("wc") ||
    q.includes("basin") ||
    q.includes("water closet") ||
    q.includes("sink") ||
    q.includes("shower")
  ) {
    return {
      message:
        "Alongside our doors, we supply commercial-grade sanitary wares and waterproof bathroom doors:\n\n• Waterproof Bathroom Doors: 100% moisture-proof WPC composite doors (from ₦85,000) that will never swell or rot from hot steam.\n• Ceramic Water Closets: Executive Gold dual-flush suites, England suites, and Pro WC series.\n• Wash Hand Basins: Dining basin suites, Plain India vanity counters & executive wash bowls.\n• Showers & Brassware: Power shower towers, glass cubicle shower enclosures, and brass kitchen mixer taps.\n\nAll items are packaged with thick protective corner foam for safe nationwide transit.",
      suggested_actions: [
        { label: "View Sanitary Catalogue", action_type: "link", payload: "/collections/sanitary-fittings" },
        { label: "Inquire on WhatsApp", action_type: "link", payload: waUrl },
        { label: "Call Admin", action_type: "call", payload: callUrl },
      ],
    };
  }

  // 8. Sizing & Dimensions
  if (q.includes("size") || q.includes("dimension") || q.includes("height") || q.includes("width") || q.includes("3ft") || q.includes("4ft") || q.includes("measure")) {
    return {
      message:
        "Here are standard wall opening dimensions we supply:\n\n• 3ft x 7ft (900mm x 2100mm): Standard room & interior HDF doors\n• 4ft x 7ft (1200mm x 2100mm): One-and-a-half leaf entrance security doors & wide bedroom doors\n• 4.5ft to 5ft x 7ft (1500mm x 2100mm): Double leaf grand luxury entrance doors\n\nIf your wall openings are non-standard, CFrank Enterprise provides custom on-demand frame adjustments and contractor fabrication directly at our Ogidi depot.",
      suggested_actions: [
        { label: "Discuss Wall Opening on WhatsApp", action_type: "link", payload: waUrl },
        { label: "Call Admin", action_type: "call", payload: callUrl },
      ],
    };
  }

  // 9. Location & Depot Visit
  if (q.includes("location") || q.includes("where") || q.includes("depot") || q.includes("address") || q.includes("ogidi") || q.includes("onitsha") || q.includes("visit") || q.includes("shop")) {
    return {
      message:
        "You can inspect doors in person at our physical depot:\n\n• Address: No. 16/17 Maraim Plaza, Building Material International Market, Ogidi, Anambra State.\n• Hours: Monday - Saturday: 8:00 AM - 5:30 PM\n• Proprietor: Chidera Frank Okonkwo (CFrank Enterprise, CAC BN 9943925)\n\nContractors, site engineers, and homeowners are always welcome to inspect lock mechanisms, woodgrain finishes, and steel gauges before dispatch.",
      suggested_actions: [
        { label: "Call Depot Admin", action_type: "call", payload: callUrl },
        { label: "WhatsApp Location Pin", action_type: "link", payload: waUrl },
      ],
    };
  }

  // 10. Delivery & Nationwide Waybill
  if (q.includes("delivery") || q.includes("waybill") || q.includes("ship") || q.includes("transport") || q.includes("lagos") || q.includes("abuja") || q.includes("ph") || q.includes("asaba")) {
    return {
      message:
        "We coordinate nationwide waybill delivery directly from our Ogidi depot:\n\n• Southeast / Asaba: Same-day or 24-hour delivery\n• South-South / Port Harcourt / Warri: 24 to 48 hours\n• Lagos / Ibadan / Southwest: 1 to 3 days\n• Abuja / Northern States: 2 to 4 days\n\nEvery order receives WhatsApp photo and video verification before loading. Once loaded, you receive the transport park waybill receipt and driver phone number directly.",
      suggested_actions: [
        { label: "Confirm Haulage on WhatsApp", action_type: "link", payload: waUrl },
        { label: "Call Admin", action_type: "call", payload: callUrl },
      ],
    };
  }

  // 11. CAC & Legitimacy Verification
  if (q.includes("cac") || q.includes("registration") || q.includes("scam") || q.includes("real") || q.includes("legit")) {
    return {
      message:
        "Anambra Best Door is 100% registered and verified with the Corporate Affairs Commission (CAC):\n\n• Corporate Entity: CFrank Enterprise\n• Sole Proprietor: Chidera Frank Okonkwo\n• Registration Number: BN 9943925\n• Status: Active\n• Physical Depot: No. 16/17 Maraim Plaza, Ogidi, Anambra State\n\nYou can click 'Verify CAC' in our site footer or about page to inspect the official CAC certificate extracts.",
      suggested_actions: [
        { label: "About Us & CAC Details", action_type: "link", payload: "/about" },
        { label: "Chat on WhatsApp", action_type: "link", payload: waUrl },
      ],
    };
  }

  // Default friendly sales pitch
  return {
    message:
      "Hello! I'm Frankie, your sales assistant at Anambra Best Door (CFrank Enterprise, owned by Chidera Frank Okonkwo).\n\nI can help you select the right doors for your project, calculate opening sizes, or suggest the best combinations of Foreign HDF room doors, Turkish security steel doors, and waterproof sanitary fittings.\n\nWhat kind of building or renovation project are you working on right now?",
    suggested_actions: [
      { label: "Suggest doors for my house", action_type: "prompt", payload: "Which doors do you recommend for a new duplex?" },
      { label: "What HDF room doors are in stock?", action_type: "prompt", payload: "What HDF room doors are in stock?" },
      { label: "Chat on WhatsApp", action_type: "link", payload: waUrl },
      { label: "Call Admin", action_type: "call", payload: callUrl },
    ],
  };
}

/**
 * Calls Google Gemini REST API with Frankie's prompt and dynamic catalog context.
 */
async function callGemini(apiKey: string, model: string, userMessage: string, history: ChatTurn[]): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const systemPrompt = buildFrankieSystemPrompt();

  const contents = [
    ...history.slice(-8).map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    })),
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini status ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const primaryModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const fallbackModels = (process.env.GEMINI_FALLBACK_MODELS || "gemini-1.5-flash,gemini-1.5-pro")
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    const modelsToTry = [primaryModel, ...fallbackModels];

    if (geminiKey) {
      for (const model of modelsToTry) {
        try {
          const aiResponse = await callGemini(geminiKey, model, message, history);
          if (aiResponse) {
            const waUrl = `https://wa.me/${DEFAULT_SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I was chatting with Frankie and would like to order or verify stock.")}`;
            const callUrl = `tel:${DEFAULT_SITE_SETTINGS.phone}`;

            return NextResponse.json({
              message: aiResponse,
              suggested_actions: [
                { label: "Chat on WhatsApp", action_type: "link", payload: waUrl },
                { label: "Call Admin", action_type: "call", payload: callUrl },
              ],
            });
          }
        } catch (err: any) {
          console.warn(`[FRANKIE_GEMINI] Model ${model} failed:`, err?.message);
        }
      }
    }

    // Fallback to local deterministic trade engine
    const fallbackResponse = runDeterministicFrankie(message);
    return NextResponse.json(fallbackResponse);
  } catch (error: any) {
    console.error("[FRANKIE_API_ERROR]", error);
    const waUrl = `https://wa.me/${DEFAULT_SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I need assistance with a door order.")}`;
    const callUrl = `tel:${DEFAULT_SITE_SETTINGS.phone}`;

    return NextResponse.json({
      message:
        "I'm temporarily having trouble connecting to the network. You can reach our sales desk directly on WhatsApp or call us directly.",
      suggested_actions: [
        { label: "Chat on WhatsApp", action_type: "link", payload: waUrl },
        { label: "Call Admin", action_type: "call", payload: callUrl },
      ],
    });
  }
}
