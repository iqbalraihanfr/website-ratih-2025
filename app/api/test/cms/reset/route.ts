import { NextResponse } from "next/server";
import { isCmsTestMode } from "@/lib/cms-test-mode";
import { resetMockCmsStore } from "@/features/cms/shared/mock-store";

export async function POST() {
  if (!isCmsTestMode()) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await resetMockCmsStore();

  return NextResponse.json({ ok: true });
}
