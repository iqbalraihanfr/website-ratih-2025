import { NextResponse } from "next/server";
import { verifyFirebaseAdminToken } from "@/lib/firebase/admin-auth";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const getAdminSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey || serviceRoleKey === "your_supabase_service_role_key") {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi.");
  }
  return createServerSupabase(true);
};

export async function GET(request: Request) {
  try {
    await verifyFirebaseAdminToken(request.headers.get("authorization"));

    const supabase = getAdminSupabase();
    const { data, error, count } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ messages: data || [], count: count || 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat pesan kontak.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
