import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const phone = String(body?.phone ?? "").trim();
    const expertise = String(body?.expertise ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email and message are required." },
        { status: 400 },
      );
    }

    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "—"}`,
      `Expertise: ${expertise || "—"}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const html = `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
      <p><strong>Expertise:</strong> ${escapeHtml(expertise || "—")}</p>
      <hr />
      <p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
    `;

    const result = await sendEmail({
      to: "info@tasheel.law",
      subject: `New Contact from Tasheel Legal Website — ${name}`,
      text,
      html,
    });

    if (result.sent || result.skipped) {
      // skipped means no provider configured; still acknowledge receipt
      return NextResponse.json({
        success: true,
        message: "Message sent successfully",
      });
    }

    return NextResponse.json(
      { success: false, error: result.error || "Failed to send message" },
      { status: 500 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
