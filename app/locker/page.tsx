import type { Metadata } from "next";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Locker | Management Terminal",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function LockerPage() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get(ADMIN_COOKIE_NAME)?.value ||
    cookieStore.get("abd_admin_token")?.value ||
    cookieStore.get("token")?.value;
  const session = token ? await verifyAdminToken(token) : null;

  return <AdminClient initialSession={session} />;
}
