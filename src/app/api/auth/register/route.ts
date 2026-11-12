// POST /api/auth/register
// Server-side registration: creates the Supabase Auth user with the
// service role (email auto-confirmed, since Authentica handles the
// actual verification independently) and inserts the profiles row
// with all the new required intake fields. Verification status
// (email_verified / phone_verified) is tracked separately and only
// flipped to true by /api/auth/otp/verify once Authentica confirms
// the code.
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { fullName, email, phone, nationality, address, city, password } = body as Record<
    string,
    string | undefined
  >;

  if (!fullName || !email || !phone || !nationality || !address || !city || !password) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Authentica, not Supabase, verifies the email code
    user_metadata: { full_name: fullName, phone, nationality, address, city },
  });

  if (createError) {
    const isDuplicate = createError.message.toLowerCase().includes("already");
    return NextResponse.json(
      {
        error: isDuplicate
          ? "This email is already registered. Please log in instead."
          : createError.message,
      },
      { status: isDuplicate ? 409 : 400 },
    );
  }

  const userId = created.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Account creation failed unexpectedly." }, { status: 500 });
  }

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: userId,
    full_name: fullName,
    phone,
    nationality,
    address,
    city,
    role: "client",
    is_approved: false,
    email_verified: false,
    phone_verified: false,
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ userId, email });
}
