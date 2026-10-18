import { redirect } from "next/navigation";

export default function SafeboxPage() {
  redirect("/admin");
}
