import { NextResponse } from "next/server";
import { verifyFirebaseAdminToken } from "@/lib/firebase/admin-auth";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const verifyRequest = async (request: Request) => {
  try {
    await verifyFirebaseAdminToken(request.headers.get("authorization"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Akses admin ditolak.";
    return { error: NextResponse.json({ error: message }, { status: 401 }) };
  }
  return { error: null };
};

const getAdminSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey || serviceRoleKey === "your_supabase_service_role_key") {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi.");
  }
  return createServerSupabase(true);
};

export async function POST(request: Request) {
  const { error: authError } = await verifyRequest(request);
  if (authError) return authError;

  try {
    const { table, payload } = await request.json();
    if (!table || !payload) return NextResponse.json({ error: "Table dan payload wajib diisi." }, { status: 400 });

    const supabase = getAdminSupabase();
    const { error } = await supabase.from(table).insert(Array.isArray(payload) ? payload : [payload]);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan data." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { error: authError } = await verifyRequest(request);
  if (authError) return authError;

  try {
    const { table, id, payload } = await request.json();
    if (!table || !id || !payload) return NextResponse.json({ error: "Table, id, dan payload wajib diisi." }, { status: 400 });

    const supabase = getAdminSupabase();
    const { error } = await supabase.from(table).update(payload).eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Gagal memperbarui data." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { error: authError } = await verifyRequest(request);
  if (authError) return authError;

  try {
    const { table, id } = await request.json();
    if (!table || !id) return NextResponse.json({ error: "Table dan id wajib diisi." }, { status: 400 });

    const supabase = getAdminSupabase();
    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus data." }, { status: 500 });
  }
}
