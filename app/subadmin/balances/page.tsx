import { auth } from "@/auth";
import PageClient from "./PageClient";

export default async function Page() {
  const session = await auth(); // ✅ exécute côté serveur
  const userId = session?.user?.id ?? "";
  const user = session?.user;

  return (
    <PageClient
      userId={userId}
    />
  );
}
