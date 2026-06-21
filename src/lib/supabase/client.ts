import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  if (url.endsWith("/rest/v1/")) {
    url = url.substring(0, url.length - "/rest/v1/".length);
  } else if (url.endsWith("/rest/v1")) {
    url = url.substring(0, url.length - "/rest/v1".length);
  }
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
  return createBrowserClient(url, anonKey);
}
