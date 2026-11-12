import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

// Returns the signed-in admin's identity so the layout can build the sidebar.
export async function GET(req: Request) {
  const guard = await requireAdmin(req);
  if (!guard.ok) return guard.response;

  const { ctx } = guard;
  return NextResponse.json({
    user: {
      id: ctx.userId,
      email: ctx.email,
      fullName: ctx.fullName,
      role: ctx.role,
      isApproved: ctx.isApproved,
    },
  });
}
