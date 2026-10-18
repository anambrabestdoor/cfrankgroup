import { redirect } from "next/navigation";

export default function AccountPage() {
  // Customers do not register accounts — order flow is completed directly via WhatsApp
  redirect("/shop");
}
