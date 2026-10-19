import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_SITE_SETTINGS } from "@/lib/settings";
import { DOOR_PRODUCTS } from "@/app/data/doorsData";

export const dynamic = "force-dynamic";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

const FRANKIE_SYSTEM_PROMPT = `
You are Frankie, the official AI assistant and trade specialist for Anambra Best Door (operated by CFrank Enterprise).

BUSINESS CONTEXT & SPECIFICATIONS:
- Business Name: Anambra Best Door Enterprises
- Parent Registered Entity: CFrank Enterprise
- Sole Proprietor: Chidera Frank Okonkwo
- CAC Registration: BN 9943925 (Registered under CAMA Act, Active status)
- Physical Depot Location: No. 16/17 Maraim Plaza, Building Material International Market, Ogidi, Anambra State, Nigeria
- Contact Phone: +234 707 007 0305
- WhatsApp: 2347070070305
- Sales Email: anambrabestdoor@gmail.com
- Working Hours: Monday - Saturday: 8:00 AM - 5:30 PM

CORE PRODUCTS CATALOGUE:
1. Foreign Luxury HDF Room Doors: Imported high-density fibreboard interior doors, Watson designs, complete pre-hung packages with matching frame casings, architraves, hinges, and mortise locks.
2. Turkish Steel Security Doors: Heavy-gauge steel security entrance doors, 1.5mm - 2.0mm steel leaf and frame gauges, multi-point deadbolt locks, cast aluminum decorative panels, and bulletproof models.
3. Waterproof Bathroom Doors: WPC composite and aluminium-edged doors designed for high-moisture bathrooms, en-suite toilets, and wet areas.
4. Watson & American Panel Doors: Decorative interior panel doors for residential homes, duplexes, and estates.
5. Sanitary Wares & Bathroom Fittings: Dual-flush ceramic water closets, vanity wash hand basins, executive dining sinks, power showers, and brass mixer taps.

STANDARD SIZING GUIDE:
- Standard Single Room Door: 3ft x 7ft (900mm x 2100mm)
- One-and-a-half Leaf Entrance: 4ft x 7ft (1200mm x 2100mm)
- Double Leaf Luxury Entrance: 4.5ft - 5ft x 7ft (1500mm x 2100mm)

LOGISTICS & DISPATCH:
- Direct physical loading at Maraim Plaza, Ogidi.
- Nationwide waybill delivery across all 36 states (Asaba, Lagos, Abuja, Port Harcourt, Enugu, Benin, etc.) via verified transport parks.
- Before loading, our depot team sends clear photos and a video clip of the exact door to the customer's WhatsApp for sign-off.

CRITICAL SCOPE RULE:
You are STRICTLY built to help customers with Anambra Best Door products, door materials, dimensions, depot visits, pricing guidance, and orders.
If a customer asks ANY question outside this scope (e.g. general knowledge, math, programming, politics, jokes, unrelated products, essay writing, or non-door topics), you MUST politely and warmly refuse.
Explain in a friendly manner:
"I am specifically built to help you with Anambra Best Door products, sizing, depot visits, and building fittings. I'm not designed for questions outside our services, but I'd be glad to help you find the right doors or sanitary fittings for your project!"

COMMUNICATION STYLE:
- Friendly, helpful, Nigerian trade-savvy, and professional.
- No corporate jargon, no generic AI slogans like "elevate your space" or "curated for you".
- No em dashes (—). Use regular hyphens (-) or commas.
- Keep answers concise, clear, and actionable.
- Encourage customer to chat on WhatsApp (+234 707 007 0305) or call admin for custom architectural quotes or waybill bookings.
`.trim();

/**
 * Intelligent deterministic fallback engine when Gemini API key is missing or unavailable.
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

  // 2. Pricing & Quotes
  if (q.includes("price") || q.includes("cost") || q.includes("how much") || q.includes("rate") || q.includes("quote")) {
    return {
      message:
        "Our doors range depending on leaf gauge, design, and complete frame package:\n\n• Foreign HDF Interior Doors: from ₦145,000 to ₦185,000 (complete pre-hung set with matching architrave & locks)\n• Turkish Steel Security Doors: heavy-gauge security entrance doors with 14-point locking systems\n• Waterproof Bathroom Doors: from ₦85,000\n• Water Closets & Basins: available from single units to full estate quantities.\n\nBecause prices vary based on dimensions and custom architrave choices, you can chat directly with our sales team on WhatsApp for an instant itemized bill of quantities.",
      suggested_actions: [
        { label: "Chat on WhatsApp for Quote", action_type: "link", payload: waUrl },
        { label: "Call Admin Directly", action_type: "call", payload: callUrl },
        { label: "What sizes are available?", action_type: "prompt", payload: "What door sizes do you have?" },
      ],
    };
  }

  // 3. HDF Doors
  if (q.includes("hdf") || q.includes("room door") || q.includes("interior door") || q.includes("wooden door") || q.includes("watson")) {
    return {
      message:
        "Our Foreign Luxury HDF Room Doors come as complete pre-hung packages. Each unit includes:\n\n• High-density acoustic core leaf\n• Matching jamb frame casing & decorative architraves\n• Mortise lockset, handle set & heavy-duty bearing hinges\n• Standard 3ft x 7ft (900mm x 2100mm) dimension\n\nThey are ideal for bedrooms, master suites, and apartments. Would you like to check available designs or arrange delivery?",
      suggested_actions: [
        { label: "View HDF Collection", action_type: "link", payload: "/collections/hdf-doors" },
        { label: "Request WhatsApp Video", action_type: "link", payload: waUrl },
      ],
    };
  }

  // 4. Security Doors / Steel Doors / Turkish
  if (q.includes("security") || q.includes("steel") || q.includes("turkish") || q.includes("bullet") || q.includes("entrance door")) {
    return {
      message:
        "Our Turkish Steel Security Doors are built for maximum entrance protection:\n\n• Heavy 1.5mm to 2.0mm electro-galvanized steel leaf & reinforced steel frame\n• 14-point to 18-point deadbolt perimeter locking mechanism\n• Cast aluminum decorative panels & weather-sealed sills\n• Available in single leaf (3ft & 4ft x 7ft) and double leaf (4.5ft to 5ft x 7ft) configurations.\n\nAll units are available for physical inspection at our Ogidi depot.",
      suggested_actions: [
        { label: "View Security Doors", action_type: "link", payload: "/collections/security-doors" },
        { label: "Confirm Stock on WhatsApp", action_type: "link", payload: waUrl },
      ],
    };
  }

  // 5. Bathroom / Sanitary Wares
  if (q.includes("toilet") || q.includes("bathroom") || q.includes("sanitary") || q.includes("wc") || q.includes("basin") || q.includes("water closet")) {
    return {
      message:
        "We stock both 100% waterproof WPC composite doors and premium sanitary wares:\n\n• Waterproof Bathroom Doors: moisture-resistant leaves with aluminium edge protection for high-humidity areas.\n• Ceramic Water Closets: dual-flush executive and wall-hung models\n• Vanity & Hand Basins: dining wash basins, vanity counters & brassware.\n\nAll sanitary fittings are packaged with foam corners for safe transit.",
      suggested_actions: [
        { label: "View Sanitary Catalogue", action_type: "link", payload: "/collections/sanitary-fittings" },
        { label: "Inquire on WhatsApp", action_type: "link", payload: waUrl },
      ],
    };
  }

  // 6. Sizing & Dimensions
  if (q.includes("size") || q.includes("dimension") || q.includes("height") || q.includes("width") || q.includes("3ft") || q.includes("4ft")) {
    return {
      message:
        "Here are standard door opening sizes we supply:\n\n• 3ft x 7ft (900mm x 2100mm): Standard room & interior HDF doors\n• 4ft x 7ft (1200mm x 2100mm): One-and-a-half leaf entrance security doors\n• 4.5ft - 5ft x 7ft (1500mm x 2100mm): Double leaf grand entrance doors\n\nWe also handle custom on-demand frame adjustments for non-standard wall openings.",
      suggested_actions: [
        { label: "Discuss Wall Opening on WhatsApp", action_type: "link", payload: waUrl },
        { label: "Call Admin", action_type: "call", payload: callUrl },
      ],
    };
  }

  // 7. Location & Depot Visit
  if (q.includes("location") || q.includes("where") || q.includes("depot") || q.includes("address") || q.includes("ogidi") || q.includes("onitsha") || q.includes("visit") || q.includes("shop")) {
    return {
      message:
        "You can inspect stock in person at our physical depot:\n\n• Address: No. 16/17 Maraim Plaza, Building Material International Market, Ogidi, Anambra State.\n• Hours: Monday - Saturday: 8:00 AM - 5:30 PM\n• Proprietor: Chidera Frank Okonkwo (CFrank Enterprise, CAC BN 9943925)\n\nSite engineers, contractors, and homeowners are always welcome to inspect door finishes and lock mechanisms before loading.",
      suggested_actions: [
        { label: "Call Depot Admin", action_type: "call", payload: callUrl },
        { label: "WhatsApp Location Pin", action_type: "link", payload: waUrl },
      ],
    };
  }

  // 8. Delivery & Waybill
  if (q.includes("delivery") || q.includes("waybill") || q.includes("ship") || q.includes("transport") || q.includes("lagos") || q.includes("abuja") || q.includes("ph") || q.includes("asaba")) {
    return {
      message:
        "We deliver nationwide from our Ogidi depot:\n\n• Southeast / Asaba: Same-day or 24-hour delivery\n• South-South / Port Harcourt / Warri: 24 to 48 hours\n• Lagos / Ibadan / Southwest: 1 to 3 days\n• Abuja / Northern States: 2 to 4 days\n\nEvery order receives photo and video sign-off on WhatsApp prior to loading, and you receive the transport park waybill invoice and driver contact directly.",
      suggested_actions: [
        { label: "Confirm Haulage on WhatsApp", action_type: "link", payload: waUrl },
        { label: "Read Shipping Policy", action_type: "link", payload: "/shipping" },
      ],
    };
  }

  // 9. CAC & Entity Verification
  if (q.includes("cac") || q.includes("registration") || q.includes("scam") || q.includes("real") || q.includes("legit") || q.includes("frank")) {
    return {
      message:
        "Anambra Best Door is fully registered and verified under the Corporate Affairs Commission:\n\n• Business Entity: CFrank Enterprise\n• Registration Number: BN 9943925\n• Sole Proprietor: Chidera Frank Okonkwo\n• Status: Active\n\nYou can click 'Verify CAC' in our site footer or about page to inspect the official CAC status extract.",
      suggested_actions: [
        { label: "About Us & CAC Details", action_type: "link", payload: "/about" },
        { label: "Chat on WhatsApp", action_type: "link", payload: waUrl },
      ],
    };
  }

  // Default friendly response
  return {
    message:
      "Hello! I'm Frankie, trade specialist at Anambra Best Door (CFrank Enterprise). I can assist you with foreign HDF room doors, Turkish steel security doors, waterproof bathroom doors, sanitary fittings, dimensions, and nationwide waybill dispatch from our Ogidi depot.\n\nWhat kind of doors or project are you working on?",
    suggested_actions: [
      { label: "What HDF room doors are in stock?", action_type: "prompt", payload: "What HDF room doors are in stock?" },
      { label: "Turkish security door sizes", action_type: "prompt", payload: "Tell me about Turkish security door sizes." },
      { label: "Chat on WhatsApp", action_type: "link", payload: waUrl },
      { label: "Call Admin", action_type: "call", payload: callUrl },
    ],
  };
}

/**
 * Call Google Gemini with Frankie's prompt and failover models
 */
async function callGemini(apiKey: string, model: string, userMessage: string, history: ChatTurn[]): Promise<string | null> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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
        parts: [{ text: FRANKIE_SYSTEM_PROMPT }],
      },
      generationConfig: {
        temperature: 0.5,
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

    // Fallback to local intelligence engine
    const fallbackResponse = runDeterministicFrankie(message);
    return NextResponse.json(fallbackResponse);
  } catch (error: any) {
    console.error("[FRANKIE_API_ERROR]", error);
    const waUrl = `https://wa.me/${DEFAULT_SITE_SETTINGS.whatsappNumber}?text=${encodeURIComponent("Hello CFrank Enterprise, I need assistance with a door order.")}`;
    const callUrl = `tel:${DEFAULT_SITE_SETTINGS.phone}`;

    return NextResponse.json({
      message:
        "I'm temporarily having trouble connecting to the network. You can reach our sales desk directly on WhatsApp or call us at our Ogidi depot.",
      suggested_actions: [
        { label: "Chat on WhatsApp", action_type: "link", payload: waUrl },
        { label: "Call Admin", action_type: "call", payload: callUrl },
      ],
    });
  }
}
