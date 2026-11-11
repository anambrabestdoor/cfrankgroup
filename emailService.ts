import { Resend } from 'resend';
import { brand } from './lib/brand';

export interface OrderEmailPayload {
  orderId: string;
  customerName: string;
  email: string;
  shippingAddress: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  date?: string;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Lazy initialization of the Resend client to avoid app crashing if key is absent
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!resendClient && RESEND_API_KEY) {
    try {
      resendClient = new Resend(RESEND_API_KEY);
      console.log('[EmailService] Resend SDK initialized successfully with API key.');
    } catch (e) {
      console.error('[EmailService] Failed to initialize Resend SDK:', e);
    }
  }
  return resendClient;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export class EmailService {
  /**
   * Dispatches order invoice receipt and waybill tracking details.
   */
  static async sendOrderReceipt(
    order: OrderEmailPayload,
    trackingInfo: { carrier: string; trackingNumber: string }
  ): Promise<{ invoiceSuccess: boolean; shippingSuccess: boolean }> {
    console.log(`[EmailService] Beginning e-commerce dispatch for Order ${order.orderId}...`);

    const invoiceHtml = this.renderInvoiceTemplate(order);
    const shippingHtml = this.renderShippingTemplate(order, trackingInfo);

    let invoiceSuccess = false;
    let shippingSuccess = false;

    // Send Invoice (Order Confirmation)
    try {
      const resend = getResendClient();
      if (resend) {
        const fromEmail = process.env.RESEND_FROM_EMAIL || `${brand.name} <orders@cfrankgroup.com>`;
        const recipient = order.email;

        console.log(`[EmailService] Attempting to send live invoice to ${recipient}...`);
        const invoiceResponse = await resend.emails.send({
          from: fromEmail,
          to: [recipient],
          subject: `Order Confirmation #${order.orderId} - ${brand.name}`,
          html: invoiceHtml
        });

        if (invoiceResponse.error) {
          console.error('[EmailService] Resend invoice response error:', invoiceResponse.error);
        } else {
          console.log(`[EmailService] Live invoice dispatched via Resend. ID: ${invoiceResponse.data?.id}`);
          invoiceSuccess = true;
        }

        // Send Shipping tracking confirmation
        console.log(`[EmailService] Attempting to send waybill details to ${recipient}...`);
        const shippingResponse = await resend.emails.send({
          from: fromEmail,
          to: [recipient],
          subject: `Waybill & Dispatch Details #${order.orderId} - ${brand.name}`,
          html: shippingHtml
        });

        if (shippingResponse.error) {
          console.error('[EmailService] Resend shipping response error:', shippingResponse.error);
        } else {
          console.log(`[EmailService] Live waybill mail dispatched. ID: ${shippingResponse.data?.id}`);
          shippingSuccess = true;
        }
      } else {
        console.warn('[EmailService] RESEND_API_KEY environment variable is not configured.');
      }
    } catch (err: any) {
      console.error('[EmailService] Connection dropout or Resend dispatch failed:', err);
    }

    if (!invoiceSuccess) {
      console.log(`[EmailService] [Fallback Log] Invoice generated for ${order.email} (Order #${order.orderId}). Total: ₦${order.total.toLocaleString()}`);
    }

    return { invoiceSuccess, shippingSuccess };
  }

  /**
   * Broadcasts trade newsletters & stock notifications.
   */
  static async sendPromotionalBroadcast(
    recipients: string[],
    payload: { title: string; subtitle: string; voucherCode: string; discountPercent: number; heroImage?: string }
  ): Promise<{ successCount: number; failedCount: number }> {
    let successCount = 0;
    let failedCount = 0;

    const resend = getResendClient();
    const fromEmail = process.env.RESEND_FROM_EMAIL || `${brand.name} <orders@cfrankgroup.com>`;

    for (const recipient of recipients) {
      const emailHtml = this.renderNewsletterTemplate(recipient, payload);
      let sent = false;

      if (resend) {
        try {
          const response = await resend.emails.send({
            from: fromEmail,
            to: [recipient],
            subject: payload.title,
            html: emailHtml
          });

          if (!response.error) {
            successCount++;
            sent = true;
          } else {
            console.error(`[EmailService] Resend broadcast error for ${recipient}:`, response.error);
            failedCount++;
          }
        } catch (err) {
          console.error(`[EmailService] Failed to send broadcast to ${recipient}:`, err);
          failedCount++;
        }
      }

      if (!sent) {
        console.log(`[EmailService] [Audit Log] Trade notice [${payload.voucherCode}] registered for ${recipient}`);
        if (!resend) successCount++;
      }
    }

    return { successCount, failedCount };
  }

  /**
   * Sends a 6-digit verification code to the recipient's email using Resend.
   */
  static async sendVerificationCode(email: string, code: string): Promise<{ success: boolean; error?: string }> {
    console.log(`[EmailService] Beginning verification code dispatch to ${email}...`);
    const codeHtml = this.renderVerificationCodeTemplate(code);
    let sent = false;

    try {
      const resend = getResendClient();
      if (resend) {
        const fromEmail = process.env.RESEND_FROM_EMAIL || `${brand.name} <orders@cfrankgroup.com>`;
        const response = await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: `${code.split('').join(' ')} is your ${brand.name} verification code`,
          html: codeHtml
        });

        if (response.error) {
          console.error('[EmailService] Resend verification response error:', response.error);
        } else {
          console.log(`[EmailService] Live verification code dispatched via Resend. ID: ${response.data?.id}`);
          sent = true;
        }
      } else {
        console.warn('[EmailService] RESEND_API_KEY environment variable is missing.');
      }
    } catch (err: any) {
      console.error('[EmailService] Resend verification dispatch failed:', err);
    }

    if (!sent) {
      console.log(`[EmailService] [Audit Log] Verification code ${code} generated for ${email}`);
    }

    return { success: true };
  }

  private static renderVerificationCodeTemplate(code: string): string {
    const formattedCode = code.split('').join(' ');
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Verification Code - ${escapeHtml(brand.name)}</title>
        </head>
        <body style="margin: 0; padding: 40px 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="450" style="background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin: 0 auto;">
            <!-- Brand Header -->
            <tr>
              <td style="padding: 30px 40px 15px 40px; text-align: center; background-color: #171A1D;">
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; letter-spacing: 0.05em; color: #ffffff; font-weight: 900; text-transform: uppercase;">
                  ${escapeHtml(brand.name)}
                </div>
                <div style="font-size: 11px; color: #B99A62; margin-top: 4px;">
                  CAC ${escapeHtml(brand.cacNumber)} • Official Business Portal
                </div>
              </td>
            </tr>

            <!-- Copy -->
            <tr>
              <td style="padding: 30px 40px; text-align: center;">
                <p style="font-size: 15px; color: #334155; margin: 0 0 20px 0;">
                  Your one-time portal verification code:
                </p>
                <div style="font-family: Courier, monospace; font-size: 32px; font-weight: bold; letter-spacing: 0.25em; color: #171A1D; background-color: #f8fafc; border: 2px dashed #B99A62; padding: 18px; display: inline-block; border-radius: 6px; min-width: 220px;">
                  ${formattedCode}
                </div>
                <p style="font-size: 12px; color: #64748b; margin: 20px 0 0 0; line-height: 1.5;">
                  This code expires in 15 minutes. Never share this code with anyone.
                </p>
              </td>
            </tr>

            <!-- Footer Message -->
            <tr>
              <td style="padding: 20px 40px; border-top: 1px solid #eaeaea; text-align: center; background-color: #f8fafc;">
                <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                  ${escapeHtml(brand.address)}<br>
                  Phone: ${escapeHtml(brand.phoneDisplay)} | Email: ${escapeHtml(brand.email)}
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private static renderInvoiceTemplate(order: OrderEmailPayload): string {
    const timestamp = order.date ? new Date(order.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : new Date().toLocaleDateString();

    const itemsRows = order.items.map((item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #0f172a;">
          ${escapeHtml(item.productName)}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #475569; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #0f172a; text-align: right;">
          ₦${item.price.toLocaleString()}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; color: #0f172a; text-align: right; font-weight: bold;">
          ₦${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Invoice #${escapeHtml(order.orderId)}</title>
        </head>
        <body style="margin: 0; padding: 40px 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin: 0 auto;">
            <!-- Brand Header -->
            <tr>
              <td style="padding: 30px 40px; background-color: #171A1D; text-align: left;">
                <div style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 0.05em;">
                  ${escapeHtml(brand.name).toUpperCase()}
                </div>
                <div style="font-size: 12px; color: #B99A62; margin-top: 4px;">
                  Official Order Invoice • CAC ${escapeHtml(brand.cacNumber)}
                </div>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding: 30px 40px 10px 40px;">
                <h1 style="font-size: 18px; font-weight: bold; color: #171A1D; margin: 0 0 10px 0;">
                  Thank you for your order, ${escapeHtml(order.customerName)}.
                </h1>
                <p style="font-size: 13px; line-height: 1.6; color: #475569; margin: 0;">
                  Your order has been recorded. Our fulfilment team will verify availability, conduct pre-dispatch inspection, and coordinate waybill delivery to your project destination.
                </p>
              </td>
            </tr>

            <!-- Order Specs metadata table -->
            <tr>
              <td style="padding: 20px 40px 10px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e2e8f0; background-color: #f8fafc; padding: 15px; border-radius: 6px;">
                  <tr>
                    <td style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold; padding-bottom: 5px;">
                      Order ID Reference
                    </td>
                    <td style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold; padding-bottom: 5px; text-align: right;">
                      Date
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Courier, monospace; font-size: 14px; font-weight: bold; color: #003296; padding-bottom: 15px;">
                      ${escapeHtml(order.orderId)}
                    </td>
                    <td style="font-size: 13px; color: #0f172a; padding-bottom: 15px; text-align: right;">
                      ${timestamp}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold; padding-bottom: 5px;">
                      Delivery Site Address
                    </td>
                    <td style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold; padding-bottom: 5px; text-align: right;">
                      Warehouse Pickup / Waybill
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #0f172a; line-height: 1.4; max-width: 250px;">
                      ${escapeHtml(order.shippingAddress)}
                    </td>
                    <td style="font-size: 13px; color: #003296; text-align: right; font-weight: bold;">
                      Maraim Plaza, Ogidi
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Itemized Receipt -->
            <tr>
              <td style="padding: 20px 40px 10px 40px;">
                <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; color: #003296; margin: 0 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">
                  Ordered Doors & Sanitary Fittings
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <thead>
                    <tr>
                      <th align="left" style="font-size: 11px; text-transform: uppercase; color: #64748b; padding-bottom: 8px;">Product</th>
                      <th align="center" style="font-size: 11px; text-transform: uppercase; color: #64748b; padding-bottom: 8px; width: 50px;">Qty</th>
                      <th align="right" style="font-size: 11px; text-transform: uppercase; color: #64748b; padding-bottom: 8px; width: 90px;">Unit Price</th>
                      <th align="right" style="font-size: 11px; text-transform: uppercase; color: #64748b; padding-bottom: 8px; width: 100px;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsRows}
                  </tbody>
                </table>
              </td>
            </tr>

            <!-- Subtotal and Charges Panel -->
            <tr>
              <td style="padding: 10px 40px 30px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width: 50%;"></td>
                    <td style="width: 50%;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; font-size: 13px; color: #475569;">Subtotal</td>
                          <td align="right" style="padding: 8px 0; font-size: 13px; color: #0f172a; font-weight: bold;">
                            ₦${order.total.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0 0 0; font-size: 15px; color: #0f172a; font-weight: bold; border-top: 1px solid #e2e8f0;">Total</td>
                          <td align="right" style="padding: 12px 0 0 0; font-size: 16px; color: #003296; font-weight: 900; border-top: 1px solid #e2e8f0;">
                            ₦${order.total.toLocaleString()}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer Banner -->
            <tr>
              <td style="padding: 25px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="font-size: 11px; color: #64748b; margin: 0; line-height: 1.5;">
                  <strong>${escapeHtml(brand.name)}</strong><br>
                  ${escapeHtml(brand.address)}<br>
                  Phone: ${escapeHtml(brand.phoneDisplay)} | Email: ${escapeHtml(brand.email)}
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private static renderShippingTemplate(order: OrderEmailPayload, tracking: { carrier: string; trackingNumber: string }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Waybill & Dispatch Notice #${escapeHtml(order.orderId)}</title>
        </head>
        <body style="margin: 0; padding: 40px 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin: 0 auto;">
            <!-- Brand Header -->
            <tr>
              <td style="padding: 30px 40px; background-color: #171A1D; text-align: left;">
                <div style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 0.05em;">
                  ${escapeHtml(brand.name).toUpperCase()}
                </div>
                <div style="font-size: 12px; color: #B99A62; margin-top: 4px;">
                  Dispatch & Logistics Waybill Coordination
                </div>
              </td>
            </tr>

            <!-- Title & Status -->
            <tr>
              <td style="padding: 30px 40px; text-align: center;">
                <div style="display: inline-block; background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; font-size: 12px; font-weight: bold; text-transform: uppercase; padding: 6px 16px; border-radius: 9999px; margin-bottom: 15px;">
                  Waybill Dispatched
                </div>
                <h1 style="font-size: 20px; font-weight: bold; color: #0f172a; margin: 0 0 10px 0;">
                  Your doors have been loaded for transit.
                </h1>
                <p style="font-size: 13px; line-height: 1.6; color: #475569; max-width: 480px; margin: 0 auto;">
                  Good news, ${escapeHtml(order.customerName)}! Your order #${escapeHtml(order.orderId)} has been loaded and dispatched via <strong>${escapeHtml(tracking.carrier)}</strong>.
                </p>
              </td>
            </tr>

            <!-- Tracking Card -->
            <tr>
              <td style="padding: 10px 40px 30px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #003296; background-color: #f0f7ff; padding: 25px; text-align: center; border-radius: 6px;">
                  <tr>
                    <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #475569; padding-bottom: 5px;">
                      Logistics Transport Line / Carrier
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 16px; font-weight: bold; color: #0f172a; padding-bottom: 15px;">
                      ${escapeHtml(tracking.carrier)}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #475569; padding-bottom: 5px;">
                      Waybill / Waybill Slip Number
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Courier, monospace; font-size: 20px; font-weight: bold; color: #003296; padding-bottom: 15px;">
                      ${escapeHtml(tracking.trackingNumber)}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer Message -->
            <tr>
              <td style="padding: 25px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.6;">
                  For dispatch inquiries or logistics details, contact our sales desk directly on WhatsApp at <a href="https://wa.me/${escapeHtml(brand.whatsappNumber)}" style="color: #171A1D; font-weight: bold;">${escapeHtml(brand.phoneDisplay)}</a>.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  private static renderNewsletterTemplate(
    email: string,
    payload: { title: string; subtitle: string; voucherCode: string; discountPercent: number; heroImage?: string }
  ): string {
    const appUrl = brand.appUrl;
    const unsubscribeLink = `${appUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${escapeHtml(payload.title)}</title>
        </head>
        <body style="margin: 0; padding: 40px 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin: 0 auto;">
            <tr>
              <td style="padding: 30px 40px; background-color: #171A1D; text-align: left;">
                <div style="font-size: 22px; font-weight: 900; color: #ffffff; letter-spacing: 0.05em;">
                  ${escapeHtml(brand.name).toUpperCase()}
                </div>
                <div style="font-size: 12px; color: #B99A62; margin-top: 4px;">
                  Contractor & Trade Notification
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px 40px; text-align: center;">
                <h1 style="font-size: 20px; font-weight: bold; color: #171A1D; margin: 0 0 10px 0;">
                  ${escapeHtml(payload.title)}
                </h1>
                <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                  ${escapeHtml(payload.subtitle)}
                </p>
                <div style="padding: 15px; background-color: #f8fafc; border: 1px dashed #B99A62; border-radius: 6px; display: inline-block;">
                  <span style="font-size: 12px; color: #64748b; display: block;">Trade Voucher Code:</span>
                  <span style="font-size: 20px; font-weight: bold; color: #171A1D; font-family: Courier, monospace;">${escapeHtml(payload.voucherCode)}</span>
                  <span style="font-size: 12px; color: #166534; display: block; font-weight: bold; margin-top: 4px;">Save ${payload.discountPercent}% on Bulk Packages</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0; background-color: #f8fafc;">
                <p style="font-size: 11px; color: #94a3b8; margin: 0;">
                  ${escapeHtml(brand.name)} • ${escapeHtml(brand.address)}<br>
                  <a href="${unsubscribeLink}" style="color: #64748b; text-decoration: underline;">Unsubscribe</a>
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }
}
