import { NextResponse } from "next/server";
import { verifyFirebaseAdminToken } from "@/lib/firebase/admin-auth";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface PostPayload {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  img_url: string;
  alt_img: string;
  author_id: string | null;
  published_at: string;
}

const unauthorized = (message: string) => NextResponse.json({ error: message }, { status: 401 });

const getAdminSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey || serviceRoleKey === "your_supabase_service_role_key") {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi.");
  }

  return createServerSupabase(true);
};

const verifyRequest = async (request: Request) => {
  try {
    await verifyFirebaseAdminToken(request.headers.get("authorization"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Akses admin ditolak.";
    return { error: unauthorized(message) };
  }

  return { error: null };
};

export async function POST(request: Request) {
  const { error: authError } = await verifyRequest(request);
  if (authError) return authError;

  try {
    const payload = (await request.json()) as PostPayload;
    const supabase = getAdminSupabase();
    const { error } = await supabase.from("posts").insert([payload]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan artikel.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { error: authError } = await verifyRequest(request);
  if (authError) return authError;

  try {
    const { id, payload } = (await request.json()) as { id?: string; payload?: PostPayload };

    if (!id || !payload) {
      return NextResponse.json({ error: "ID dan data artikel wajib dikirim." }, { status: 400 });
    }

    const supabase = getAdminSupabase();
    const { error } = await supabase.from("posts").update(payload).eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui artikel.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { error: authError } = await verifyRequest(request);
  if (authError) return authError;

  try {
    const { id } = (await request.json()) as { id?: string };

    if (!id) {
      return NextResponse.json({ error: "ID artikel wajib dikirim." }, { status: 400 });
    }

    const supabase = getAdminSupabase();
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus artikel.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
