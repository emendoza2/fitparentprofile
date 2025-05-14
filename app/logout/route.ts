import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Clear cookies if needed (Supabase client should handle this, but you can clear manually if required)
  // cookies().delete('sb:token');

  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url, { status: 302 });
}
