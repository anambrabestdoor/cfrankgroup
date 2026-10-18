import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export interface SupportAgent {
  id: string;
  name: string;
  avatar: string;
  roleTitle: string;
  status: "online" | "offline" | "busy";
  email: string;
  department: string;
}

export const DEPARTMENTS = [
  { id: "general",     label: "General Inquiry",    emoji: "💬", description: "Questions about ANUA, policies, or anything else" },
  { id: "skincare",    label: "Skincare Advice",     emoji: "🌿", description: "Routine building, ingredient questions & skin concerns" },
  { id: "orders",      label: "Orders & Shipping",   emoji: "📦", description: "Track orders, returns, refunds & delivery" },
  { id: "technical",   label: "Technical Support",   emoji: "🛠️", description: "Website issues, account problems, payment errors" },
  { id: "suggestions", label: "Suggestions",         emoji: "💡", description: "Product feedback, wishlist items & ideas" },
];

let SUPPORT_AGENTS: SupportAgent[] = [
  {
    id: "agent-1",
    name: "Sophia Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    roleTitle: "Lead Skincare Specialist",
    status: "online",
    email: "sophia@anuaglobal.com",
    department: "skincare",
  },
  {
    id: "agent-2",
    name: "Mia Kim",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    roleTitle: "K-Beauty Advisor",
    status: "online",
    email: "mia@anuaglobal.com",
    department: "general",
  },
  {
    id: "agent-3",
    name: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    roleTitle: "Dermatology Care Specialist",
    status: "online",
    email: "elena@anuaglobal.com",
    department: "skincare",
  },
  {
    id: "agent-4",
    name: "James Park",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    roleTitle: "Order & Delivery Support",
    status: "online",
    email: "james@anuaglobal.com",
    department: "orders",
  },
  {
    id: "agent-5",
    name: "Lena Kovacs",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    roleTitle: "Technical Support Specialist",
    status: "online",
    email: "lena@anuaglobal.com",
    department: "technical",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dept = searchParams.get("department");
  const agents = dept
    ? SUPPORT_AGENTS.filter((a) => a.department === dept)
    : SUPPORT_AGENTS;
  return NextResponse.json(agents);
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const payload = token ? db.verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }
    const { name, avatar, roleTitle, email, department } = await req.json();
    if (!name || !avatar) {
      return NextResponse.json({ error: "Agent name and avatar image URL are required." }, { status: 400 });
    }
    const newAgent: SupportAgent = {
      id: `agent-${Date.now()}`,
      name,
      avatar,
      roleTitle: roleTitle || "Skincare Specialist",
      status: "online",
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@anuaglobal.com`,
      department: department || "general",
    };
    SUPPORT_AGENTS.push(newAgent);
    return NextResponse.json(newAgent, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add support agent." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const payload = token ? db.verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const { id, ...updates } = await req.json();
    const idx = SUPPORT_AGENTS.findIndex((a) => a.id === id);
    if (idx === -1) return NextResponse.json({ error: "Agent not found." }, { status: 404 });
    SUPPORT_AGENTS[idx] = { ...SUPPORT_AGENTS[idx], ...updates };
    return NextResponse.json(SUPPORT_AGENTS[idx]);
  } catch {
    return NextResponse.json({ error: "Failed to update agent." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const payload = token ? db.verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Agent ID required." }, { status: 400 });
    SUPPORT_AGENTS = SUPPORT_AGENTS.filter((a) => a.id !== id);
    return NextResponse.json({ success: true, message: "Agent removed." });
  } catch {
    return NextResponse.json({ error: "Failed to delete agent." }, { status: 500 });
  }
}


