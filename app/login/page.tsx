import { redirect } from "next/navigation";

const APP_URL = (process.env.NEXT_PUBLIC_TMWP_APP_URL || "https://app.toulonwaterpolo.fr").replace(/\/+$/, "");

export default function LoginRedirectPage() {
  redirect(`${APP_URL}/login`);
}
