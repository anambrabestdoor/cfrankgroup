import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get(ADMIN_COOKIE_NAME)?.value ||
    cookieStore.get("abd_admin_token")?.value ||
    cookieStore.get("token")?.value;
  const session = token ? await verifyAdminToken(token) : null;

  return <AdminClient initialSession={session} />;
}
