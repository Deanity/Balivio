/**
 * emailService.ts
 *
 * Sends transactional emails via Resend SDK.
 * Handles booking confirmation e-vouchers with
 * a branded HTML template.
 */

import { Resend } from 'resend';
import { env } from '@/config/env';

let resend: Resend | null = null;

function getResendClient(): Resend {
  if (!resend) {
    resend = new Resend(env.RESEND_API_KEY);
  }
  return resend;
}

// =============================================
// FORMATTERS
// =============================================
function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// =============================================
// TYPES
// =============================================
export interface BookingConfirmationData {
  customerName: string;
  customerEmail: string;
  bookingCode: string;
  villaName: string;
  villaLocation: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  subtotal: number;
  serviceFee: number;
  taxFee: number;
  totalPrice: number;
  paymentMethod: string;
  paymentCode: string;
}

// =============================================
// EMAIL TEMPLATE
// =============================================
function buildBookingConfirmationHTML(data: BookingConfirmationData): string {
  const paymentMethodLabel: Record<string, string> = {
    transfer: 'Transfer Bank',
    ewallet: 'E-Wallet (OVO / DANA / GoPay)',
    card: 'Kartu Kredit / Debit',
  };

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Konfirmasi Booking — Balivio</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- ===== HEADER ===== -->
          <tr>
            <td style="background:linear-gradient(135deg,#0D5C54 0%,#0A4842 100%);padding:40px 48px;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display:inline-flex;align-items:center;gap:12px;">
                      <div style="width:44px;height:44px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;">🌴</div>
                      <span style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Balivio</span>
                    </div>
                    <p style="margin:12px 0 0;color:rgba(255,255,255,0.75);font-size:13px;font-weight:500;letter-spacing:0.5px;">
                      BALI VILLA BOOKING PLATFORM
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ===== SUCCESS BANNER ===== -->
          <tr>
            <td style="background:#10B981;padding:20px 48px;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin:0;color:#ffffff;font-size:15px;font-weight:700;letter-spacing:0.3px;">
                      ✅ &nbsp; Pembayaran Berhasil — Booking Dikonfirmasi!
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ===== BODY ===== -->
          <tr>
            <td style="padding:40px 48px;">

              <!-- Greeting -->
              <p style="margin:0 0 8px;font-size:22px;font-weight:800;color:#0f172a;">
                Halo, ${data.customerName}! 👋
              </p>
              <p style="margin:0 0 32px;font-size:14px;color:#64748b;line-height:1.6;">
                Terima kasih telah memesan melalui <strong>Balivio</strong>. Pembayaran kamu sudah diterima dan booking villa berikut telah dikonfirmasi.
              </p>

              <!-- Booking Code Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#f0fdf4;border:1.5px dashed #10B981;border-radius:16px;padding:20px 24px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:1.5px;">Kode Booking</p>
                    <p style="margin:0;font-size:28px;font-weight:900;color:#0D5C54;letter-spacing:4px;font-family:monospace;">${data.bookingCode}</p>
                    <p style="margin:8px 0 0;font-size:11px;color:#94a3b8;">Tunjukkan kode ini saat check-in di villa</p>
                  </td>
                </tr>
              </table>

              <!-- Villa Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="background:#f8fafc;border-radius:16px;padding:24px;">
                    <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Detail Villa</p>
                    
                    <p style="margin:0 0 4px;font-size:18px;font-weight:800;color:#0f172a;">${data.villaName}</p>
                    <p style="margin:0 0 20px;font-size:13px;color:#64748b;">📍 ${data.villaLocation}</p>

                    <!-- Check-in / Check-out -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="48%" style="background:#ffffff;border-radius:12px;padding:16px;border:1px solid #e2e8f0;">
                          <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Check-In</p>
                          <p style="margin:0;font-size:13px;font-weight:700;color:#0f172a;">${formatDate(data.checkIn)}</p>
                          <p style="margin:4px 0 0;font-size:11px;color:#64748b;">ab 15.00 WIB</p>
                        </td>
                        <td width="4%"></td>
                        <td width="48%" style="background:#ffffff;border-radius:12px;padding:16px;border:1px solid #e2e8f0;">
                          <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Check-Out</p>
                          <p style="margin:0;font-size:13px;font-weight:700;color:#0f172a;">${formatDate(data.checkOut)}</p>
                          <p style="margin:4px 0 0;font-size:11px;color:#64748b;">maks 12.00 WIB</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Duration & Guests -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                      <tr>
                        <td width="48%" style="background:#ffffff;border-radius:12px;padding:14px 16px;border:1px solid #e2e8f0;text-align:center;">
                          <p style="margin:0;font-size:20px;font-weight:900;color:#0D5C54;">${data.nights}</p>
                          <p style="margin:2px 0 0;font-size:11px;color:#64748b;font-weight:600;">Malam</p>
                        </td>
                        <td width="4%"></td>
                        <td width="48%" style="background:#ffffff;border-radius:12px;padding:14px 16px;border:1px solid #e2e8f0;text-align:center;">
                          <p style="margin:0;font-size:20px;font-weight:900;color:#0D5C54;">${data.guests}</p>
                          <p style="margin:2px 0 0;font-size:11px;color:#64748b;font-weight:600;">Tamu</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Payment Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#f8fafc;border-radius:16px;padding:24px;">
                    <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Rincian Pembayaran</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#64748b;">Subtotal (${data.nights} malam)</td>
                        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#0f172a;text-align:right;">${formatIDR(data.subtotal)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#64748b;">Biaya Layanan (10%)</td>
                        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#0f172a;text-align:right;">${formatIDR(data.serviceFee)}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-size:13px;color:#64748b;">PPN (11%)</td>
                        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#0f172a;text-align:right;">${formatIDR(data.taxFee)}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding:12px 0 0;">
                          <div style="border-top:1.5px solid #e2e8f0;"></div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0 0;font-size:15px;font-weight:800;color:#0f172a;">Total Dibayar</td>
                        <td style="padding:12px 0 0;font-size:20px;font-weight:900;color:#0D5C54;text-align:right;">${formatIDR(data.totalPrice)}</td>
                      </tr>
                    </table>

                    <!-- Payment Method -->
                    <div style="margin-top:16px;padding:12px 16px;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;">
                      <p style="margin:0;font-size:11px;color:#94a3b8;font-weight:600;">Metode Pembayaran</p>
                      <p style="margin:4px 0 0;font-size:13px;font-weight:700;color:#0f172a;">
                        ${paymentMethodLabel[data.paymentMethod] ?? data.paymentMethod}
                      </p>
                      <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;font-family:monospace;">Ref: ${data.paymentCode}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Important Notes -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#fffbeb;border-left:4px solid #F59E0B;border-radius:0 12px 12px 0;padding:16px 20px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#92400E;">📋 Penting untuk dibawa saat check-in:</p>
                    <ul style="margin:0;padding-left:16px;font-size:12px;color:#78350F;line-height:1.8;">
                      <li>Tunjukkan kode booking <strong>${data.bookingCode}</strong> atau email ini</li>
                      <li>KTP / Paspor untuk verifikasi identitas</li>
                      <li>Konfirmasikan waktu kedatangan ke villa via WhatsApp</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${env.FRONTEND_URL}/dashboard?tab=bookings" 
                       style="display:inline-block;background:#0D5C54;color:#ffffff;font-size:14px;font-weight:700;padding:14px 36px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">
                      Lihat Detail Booking Saya →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ===== FOOTER ===== -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 48px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">
                Pertanyaan? Hubungi kami di <a href="mailto:support@balivio.id" style="color:#0D5C54;font-weight:600;">support@balivio.id</a>
              </p>
              <p style="margin:0;font-size:11px;color:#cbd5e1;">
                © ${new Date().getFullYear()} Balivio — Bali Villa Booking Platform. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// =============================================
// SEND BOOKING CONFIRMATION
// =============================================
export async function sendBookingConfirmationEmail(
  data: BookingConfirmationData
): Promise<void> {
  if (!env.RESEND_API_KEY || env.RESEND_API_KEY === 'your_resend_api_key_here') {
    console.warn('⚠️  RESEND_API_KEY not configured — skipping email send.');
    return;
  }

  const client = getResendClient();

  const { error } = await client.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [data.customerEmail],
    subject: `✅ Booking Dikonfirmasi — ${data.bookingCode} | ${data.villaName}`,
    html: buildBookingConfirmationHTML(data),
  });

  if (error) {
    // Log error but don't throw — payment already succeeded
    console.error('❌ Resend email error:', error);
  } else {
    console.log(`📧 Confirmation email sent to ${data.customerEmail} for booking ${data.bookingCode}`);
  }
}
