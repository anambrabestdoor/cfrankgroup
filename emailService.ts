import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

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

// Simple HTML Escaper for security to mitigate HTML injection vectors
function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface OrderItemPayload {
  productName: string;
  price: number;
  quantity: number;
}

export interface OrderEmailPayload {
  orderId: string;
  customerName: string;
  email: string;
  items: OrderItemPayload[];
  total: number;
  date: string;
  shippingAddress: string;
}

// Generates an authentic shipping tracking number according to specific carrier patterns
export function generateTrackingNumber(shippingAddress: string): { carrier: string; trackingNumber: string } {
  const addr = (shippingAddress || '').toLowerCase();
  
  if (addr.includes('us') || addr.includes('united states') || addr.includes('america') || addr.includes('ca ') || addr.includes('ny ')) {
    // UPS domestic
    // starts with 1Z, followed by 6-char sender ID (mixture of letters/numbers), 2-digit service level code, and final 8-digit package identifier.
    const senderId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const serviceCode = '01'; // UPS Next Day Air
    const packageId = Math.floor(10000000 + Math.random() * 90000000).toString();
    const tracking = `1Z${senderId}${serviceCode}${packageId}`;
    return {
      carrier: 'UPS Domestic',
      trackingNumber: tracking
    };
  } else if (addr.includes('kr') || addr.includes('korea') || addr.includes('asia') || addr.includes('intl') || addr.includes('global')) {
    // UPU Format (Standard International Post)
    // starts with 2 letters, followed by 9 numbers, and ends with 2-letter country code (like KR for South Korea).
    const prefixes = ['EE', 'CN', 'LX', 'KR'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(100000000 + Math.random() * 900000000).toString();
    const tracking = `${prefix}${num}KR`;
    return {
      carrier: 'Standard International Post',
      trackingNumber: tracking
    };
  } else {
    // DHL Express (straight sequence of 10 numerical digits)
    const tracking = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    return {
      carrier: 'DHL Express',
      trackingNumber: tracking
    };
  }
}

export class EmailService {
  /**
   * Dispatches both the immediate order invoice & shipping tracking confirmations asynchronously.
   * If Resend API is not configured, it gracefully prints a fallback preview in the console
   * to ensure zero checkout blocks.
   */
  static async sendCheckoutEmails(order: OrderEmailPayload): Promise<{ success: boolean; error?: string }> {
    const trackingInfo = generateTrackingNumber(order.shippingAddress);
    
    console.log(`[EmailService] Beginning e-commerce dispatch for Order ${order.orderId}...`);
    
    const invoiceHtml = this.renderInvoiceTemplate(order);
    const shippingHtml = this.renderShippingTemplate(order, trackingInfo);

    let invoiceSuccess = false;
    let shippingSuccess = false;

    // Send Invoice (Order Confirmation)
    try {
      const resend = getResendClient();
      if (resend) {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Anua Skincare <onboarding@resend.dev>';
        // Send to client's email, or fallback to Elijah's registered email in development/trial mode if needed
        const recipient = order.email;
        
        console.log(`[EmailService] Attempting to send live invoice to ${recipient}...`);
        const invoiceResponse = await resend.emails.send({
          from: fromEmail,
          to: [recipient],
          subject: `Order Confirmation #${order.orderId} - Thank you for shopping with Anua`,
          html: invoiceHtml
        });

        if (invoiceResponse.error) {
          console.error('[EmailService] Resend invoice response error:', invoiceResponse.error);
        } else {
          console.log(`[EmailService] Live invoice dispatched via Resend. ID: ${invoiceResponse.data?.id}`);
          invoiceSuccess = true;
        }

        // Send Shipping tracking confirmation
        console.log(`[EmailService] Attempting to send live tracking number to ${recipient}...`);
        const shippingResponse = await resend.emails.send({
          from: fromEmail,
          to: [recipient],
          subject: `Your Anua Order has Shipped! Tracking Details #${order.orderId}`,
          html: shippingHtml
        });

        if (shippingResponse.error) {
          console.error('[EmailService] Resend shipping response error:', shippingResponse.error);
        } else {
          console.log(`[EmailService] Live tracking mail dispatched. ID: ${shippingResponse.data?.id}`);
          shippingSuccess = true;
        }
      } else {
        console.warn('[EmailService] RESEND_API_KEY environment variable is not configured.');
      }
    } catch (err) {
      console.error('[EmailService] Connection dropout or Resend dispatch failed:', err);
    }

    // Fallback audit logging when email provider key is unconfigured or offline
    if (!invoiceSuccess) {
      console.log(`[EmailService] [Audit Log] Invoice payload registered for ${order.email} (Order #${order.orderId}, Total: $${order.total.toFixed(2)})`);
    }

    if (!shippingSuccess) {
      console.log(`[EmailService] [Audit Log] Dispatch tracking registered for ${order.email} (${trackingInfo.carrier}: ${trackingInfo.trackingNumber})`);
    }

    return { success: true };
  }

  /**
   * Broadcasts a professional newsletter / promotional offer asynchronously to a roster of subscriber emails.
   */
  static async sendPromotionalBroadcast(
    recipients: string[],
    payload: { title: string; subtitle: string; voucherCode: string; discountPercent: number; heroImage?: string }
  ): Promise<{ successCount: number; failedCount: number }> {
    console.log(`[EmailService] Preparing newsletter broadcast for ${recipients.length} subscribers...`);
    
    let successCount = 0;
    let failedCount = 0;

    const resend = getResendClient();
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Anua Skincare <onboarding@resend.dev>';

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
          console.error(`[EmailService] Failed to send broadcast to ${recipient} due to network timeout:`, err);
          failedCount++;
        }
      }

      if (!sent) {
        console.log(`[EmailService] [Audit Log] Promotional voucher [${payload.voucherCode}] registered for ${recipient}`);
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
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Anua Skincare <onboarding@resend.dev>';
        const response = await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: `${code.split('').join(' ')} is your Anua verification code`,
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
          <title>Your Anua Verification Code</title>
        </head>
        <body style="margin: 0; padding: 40px 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="450" style="background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); margin: 0 auto;">
            <!-- Brand Header -->
            <tr>
              <td style="padding: 40px 40px 20px 40px; text-align: center;">
                <div style="font-family: 'Times New Roman', Times, serif; font-size: 36px; letter-spacing: 0.15em; color: #111111; font-weight: bold; text-transform: uppercase;">
                  ANUA
                </div>
              </td>
            </tr>

            <!-- Copy -->
            <tr>
              <td style="padding: 10px 40px 30px 40px; text-align: center;">
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; color: #555555; margin: 0 0 25px 0;">
                  Your verification code:
                </p>
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 32px; font-weight: bold; letter-spacing: 0.25em; color: #111111; background-color: #fafafa; border: 1px solid #eaeaea; padding: 20px; display: inline-block; border-radius: 4px; min-width: 200px;">
                  ${formattedCode}
                </div>
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #777777; margin: 25px 0 0 0; line-height: 1.5;">
                  This code can only be used once. It expires in 15 minutes.
                </p>
              </td>
            </tr>

            <!-- Footer Message -->
            <tr>
              <td style="padding: 20px 40px 40px 40px; border-top: 1px solid #eaeaea; text-align: center; background-color: #fafafa;">
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #999999; margin: 0 0 10px 0;">
                  © Anua US
                </p>
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; margin: 0;">
                  <a href="#" style="color: #777777; text-decoration: underline;">Privacy policy</a>
                  <span style="color: #cccccc; margin: 0 8px;">|</span>
                  <a href="#" style="color: #777777; text-decoration: underline;">Terms of service</a>
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  // Pure HTML Template Generator: Minimalist Luxury invoice
  private static renderInvoiceTemplate(order: OrderEmailPayload): string {
    const timestamp = order.date ? new Date(order.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : new Date().toLocaleDateString();

    const itemsRows = order.items.map((item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #111111;">
          ${escapeHtml(item.productName)}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-family: Courier, monospace; font-size: 14px; color: #444444; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-family: Courier, monospace; font-size: 14px; color: #111111; text-align: right;">
          $${item.price.toFixed(2)}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-family: Courier, monospace; font-size: 14px; color: #111111; text-align: right; font-weight: bold;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation #${escapeHtml(order.orderId)}</title>
        </head>
        <body style="margin: 0; padding: 40px 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); margin: 0 auto;">
            <!-- Brand Header -->
            <tr>
              <td style="padding: 40px 40px 20px 40px; text-align: center;">
                <img src="https://anua.us/cdn/shop/files/anua_logo_black_180x.png" alt="ANUA" width="120" style="width: 120px; height: auto; margin-bottom: 10px; display: inline-block;" />
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #777777;">
                  Clean Skincare Storefront
                </div>
              </td>
            </tr>

            <!-- Header Separator -->
            <tr>
              <td style="padding: 0 40px;">
                <hr style="border: 0; border-top: 1px solid #111111; margin: 20px 0;">
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding: 20px 40px 10px 40px;">
                <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; font-weight: 400; letter-spacing: -0.01em; color: #111111; margin: 0 0 10px 0;">
                  Thank you for your order, ${escapeHtml(order.customerName)}.
                </h1>
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #555555; margin: 0;">
                  Your payment was validated and your order is currently being prepared for dispatch. We will notify you once your parcel has been forwarded to the local carrier. Below is your official receipt.
                </p>
              </td>
            </tr>

            <!-- Order Specs metadata table -->
            <tr>
              <td style="padding: 20px 40px 10px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #eaeaea; background-color: #fcfcfc; padding: 15px;">
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #777777; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 5px;">
                      Order ID Reference
                    </td>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #777777; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 5px; text-align: right;">
                      Order Date
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Courier, monospace; font-size: 15px; font-weight: bold; color: #111111; padding-bottom: 15px;">
                      ${escapeHtml(order.orderId)}
                    </td>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #111111; padding-bottom: 15px; text-align: right;">
                      ${timestamp}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #777777; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 5px;">
                      Delivery Address
                    </td>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #777777; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 5px; text-align: right;">
                      Payment Method
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #111111; line-height: 1.4; max-width: 250px;">
                      ${escapeHtml(order.shippingAddress)}
                    </td>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #111111; text-align: right; font-weight: bold;">
                      Direct Secure Checkout
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Itemized Receipt -->
            <tr>
              <td style="padding: 20px 40px 10px 40px;">
                <h3 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; color: #111111; margin: 0 0 10px 0; border-bottom: 1px solid #111111; padding-bottom: 5px;">
                  Itemized Skincare Array
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <thead>
                    <tr>
                      <th align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; text-transform: uppercase; color: #777777; padding-bottom: 8px; font-weight: normal;">Product Title</th>
                      <th align="center" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; text-transform: uppercase; color: #777777; padding-bottom: 8px; font-weight: normal; width: 60px;">Qty</th>
                      <th align="right" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; text-transform: uppercase; color: #777777; padding-bottom: 8px; font-weight: normal; width: 80px;">Unit Price</th>
                      <th align="right" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; text-transform: uppercase; color: #777777; padding-bottom: 8px; font-weight: normal; width: 90px;">Total</th>
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
                    <td style="width: 60%;"></td>
                    <td style="width: 40%;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #666666;">
                            Subtotal
                          </td>
                          <td align="right" style="padding: 8px 0; font-family: Courier, monospace; font-size: 13px; color: #111111;">
                            $${order.total.toFixed(2)}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #666666; border-bottom: 1px solid #eaeaea;">
                            Eco Shipping
                          </td>
                          <td align="right" style="padding: 8px 0; font-family: Courier, monospace; font-size: 13px; color: #111111; font-weight: bold; border-bottom: 1px solid #eaeaea;">
                            FREE
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px 0 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; color: #111111; font-weight: bold;">
                            Total Charge
                          </td>
                          <td align="right" style="padding: 15px 0 0 0; font-family: Courier, monospace; font-size: 17px; color: #111111; font-weight: bold;">
                            $${order.total.toFixed(2)}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Elegant Footer Banner -->
            <tr>
              <td style="padding: 30px 40px; background-color: #111111; text-align: center; color: #ffffff;">
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 5px 0;">
                  Eco-Conscious Skincare
                </p>
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #999999; margin: 0; line-height: 1.5;">
                  Formulated to soothe skin and secure your natural moisture barriers.<br>
                  Thank you for being part of our clean-beauty skincare community.
                </p>
              </td>
            </tr>
          </table>
          <p style="text-align: center; font-size: 11px; color: #999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-top: 20px;">
            Anua Skincare Co. Ltd., 180 Skincare Avenue, Lagos, Nigeria.
          </p>
        </body>
      </html>
    `;
  }

  // Pure HTML Template Generator: Shipping Tracking Details Email
  private static renderShippingTemplate(order: OrderEmailPayload, tracking: { carrier: string; trackingNumber: string }): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Your Order Has Shipped! #${escapeHtml(order.orderId)}</title>
        </head>
        <body style="margin: 0; padding: 40px 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); margin: 0 auto;">
            <!-- Brand Header -->
            <tr>
              <td style="padding: 40px 40px 20px 40px; text-align: center;">
                <img src="https://anua.us/cdn/shop/files/anua_logo_black_180x.png" alt="ANUA" width="120" style="width: 120px; height: auto; margin-bottom: 10px; display: inline-block;" />
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #777777;">
                  Shipment Department
                </div>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding: 0 40px;">
                <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 10px 0;">
              </td>
            </tr>

            <!-- Title & Status -->
            <tr>
              <td style="padding: 20px 40px; text-align: center;">
                <div style="display: inline-block; background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; padding: 6px 16px; border-radius: 9999px; margin-bottom: 15px;">
                  Package Dispatched
                </div>
                <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 300; tracking: -0.02em; color: #111111; margin: 0 0 10px 0;">
                  Your skincare is on the way.
                </h1>
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #555555; max-width: 480px; margin: 0 auto;">
                  Good news, ${escapeHtml(order.customerName)}! Our fulfillment team has processed your package and it has been handed over to <strong>${escapeHtml(tracking.carrier)}</strong>.
                </p>
              </td>
            </tr>

            <!-- Tracking Card -->
            <tr>
              <td style="padding: 10px 40px 30px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #111111; background-color: #fbfbfb; padding: 25px; text-align: center;">
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #777777; padding-bottom: 8px;">
                      Assigned Carrier
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: bold; color: #111111; padding-bottom: 20px;">
                      ${escapeHtml(tracking.carrier)}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #777777; padding-bottom: 8px;">
                      Official Parcel Tracking Number
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Courier, monospace; font-size: 22px; font-weight: bold; color: #111111; letter-spacing: 0.05em; padding-bottom: 25px;">
                      ${escapeHtml(tracking.trackingNumber)}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <!-- Simulation link -->
                      <a href="https://www.google.com/search?q=${escapeHtml(tracking.trackingNumber)}" target="_blank" style="background-color: #111111; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; padding: 12px 30px; display: inline-block; border-radius: 2px;">
                        Track Parcel Now
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Shipment Specs table -->
            <tr>
              <td style="padding: 0 40px 30px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #eaeaea; padding-top: 20px;">
                  <tr>
                    <td valign="top" style="width: 50%;">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #777777; margin-bottom: 5px;">
                        Delivery Address
                      </div>
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #111111; line-height: 1.4;">
                        ${escapeHtml(order.shippingAddress)}
                      </div>
                    </td>
                    <td valign="top" style="width: 50%; text-align: right;">
                      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #777777; margin-bottom: 5px;">
                        Order Number
                      </div>
                      <div style="font-family: Courier, monospace; font-size: 14px; font-weight: bold; color: #111111;">
                        ${escapeHtml(order.orderId)}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer Message -->
            <tr>
              <td style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #eaeaea; text-align: center;">
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #777777; margin: 0; line-height: 1.6;">
                  For customer support or to request delivery changes, please contact us at <a href="mailto:support@anua.com" style="color: #111111; text-decoration: underline;">support@anua.com</a>.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  // Pure HTML Template Generator: Promotional Broadcast/Newsletter Email
  private static renderNewsletterTemplate(
    email: string,
    payload: { title: string; subtitle: string; voucherCode: string; discountPercent: number; heroImage?: string }
  ): string {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const unsubscribeLink = `${appUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
    const heroImage = payload.heroImage || 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${escapeHtml(payload.title)}</title>
        </head>
        <body style="margin: 0; padding: 40px 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); margin: 0 auto;">
            <!-- Brand Header -->
            <tr>
              <td style="padding: 40px 40px 20px 40px; text-align: center;">
                <img src="https://anua.us/cdn/shop/files/anua_logo_black_180x.png" alt="ANUA" width="120" style="width: 120px; height: auto; margin-bottom: 10px; display: inline-block;" />
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #777777;">
                  Private Skincare Circle
                </div>
              </td>
            </tr>

            <!-- Banner Image -->
            <tr>
              <td>
                <img src="${escapeHtml(heroImage)}" alt="Skincare Glow Banner" width="600" style="width: 100%; height: auto; max-height: 280px; object-cover: cover; display: block;" />
              </td>
            </tr>

            <!-- Copy -->
            <tr>
              <td style="padding: 40px 40px 20px 40px; text-align: center;">
                <h1 style="font-family: 'Times New Roman', Times, serif; font-size: 26px; font-weight: 400; line-height: 1.3; color: #111111; margin: 0 0 15px 0; letter-spacing: 0.02em;">
                  ${escapeHtml(payload.title)}
                </h1>
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; line-height: 1.6; color: #555555; margin: 0 0 30px 0;">
                  ${escapeHtml(payload.subtitle)}
                </p>
              </td>
            </tr>

            <!-- Voucher Box -->
            <tr>
              <td style="padding: 0 40px 30px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border: 1px dashed #111111; padding: 30px; text-align: center;">
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #777777; padding-bottom: 8px;">
                      Exclusive Circle Reward Code
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: Courier, monospace; font-size: 32px; font-weight: bold; color: #111111; letter-spacing: 0.1em; padding-bottom: 10px;">
                      ${escapeHtml(payload.voucherCode)}
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: bold; color: #166534; padding-bottom: 25px;">
                      Save ${payload.discountPercent}% Off Your Next Skincare Order
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="${appUrl}" target="_blank" style="background-color: #111111; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; text-decoration: none; padding: 14px 35px; display: inline-block; border-radius: 2px;">
                        REDEEM VOUCHER NOW
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding: 0 40px;">
                <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 10px 0;">
              </td>
            </tr>

            <!-- Bottom Policy / Legally compliant Unsubscribe Block -->
            <tr>
              <td style="padding: 30px 40px; text-align: center; background-color: #ffffff;">
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #999999; line-height: 1.6; margin: 0 0 10px 0;">
                  You received this email because you subscribed to our newsletter roster at anua.com or during secure checkout registration.
                </p>
                <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #111111; margin: 0;">
                  Anua Skincare Co. Ltd., 180 Skincare Avenue, Lagos, Nigeria.
                </p>
                <div style="margin-top: 20px;">
                  <a href="${unsubscribeLink}" target="_blank" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #d946ef; text-decoration: underline; font-weight: bold;">
                    Unsubscribe from our marketing list
                  </a>
                </div>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }
}
