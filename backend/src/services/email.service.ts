import { Resend } from 'resend';

export function escapeHtml(text: unknown): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatMultilineText(text: unknown): string {
  return escapeHtml(text).replace(/\n/g, '<br/>');
}

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new Resend(apiKey);
}

export function getNotificationRecipient(): string {
  return process.env.FORM_NOTIFICATION_EMAIL || 'accounts@eneindustries.com';
}

export function getNotificationSender(): string {
  return process.env.RESEND_FROM_EMAIL || 'notifications@eneindustries.com';
}

interface BaseEmailWrapperOptions {
  title: string;
  badge: string;
  badgeColor?: string;
  contentHtml: string;
  footerNote?: string;
}

function renderEmailTemplate({
  title,
  badge,
  badgeColor = '#059669',
  contentHtml,
  footerNote = 'You received this notification because a visitor submitted a form on the E&E Industries website.',
}: BaseEmailWrapperOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 28px 32px; text-align: left;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      E&amp;E <span style="color: #10b981;">Industries</span>
                    </div>
                    <div style="font-size: 12px; color: #94a3b8; margin-top: 4px; font-weight: 500;">
                      Industrial, Solar &amp; Engineering Solutions
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <span style="display: inline-block; padding: 6px 12px; background-color: ${escapeHtml(badgeColor)}; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 9999px;">
                      ${escapeHtml(badge)}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title Banner -->
          <tr>
            <td style="padding: 24px 32px 12px 32px; border-bottom: 1px solid #f1f5f9;">
              <h1 style="margin: 0; font-size: 18px; font-weight: 700; color: #0f172a; line-height: 1.4;">
                ${escapeHtml(title)}
              </h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 24px 32px 32px 32px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;"><strong>E&amp;E Industries Website Notification System</strong></p>
              <p style="margin: 0 0 4px 0;">${escapeHtml(footerNote)}</p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">Hit &ldquo;Reply&rdquo; in your email client to respond directly to the customer.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderFieldRow(label: string, value: unknown, isHighlight: boolean = false): string {
  if (value === null || value === undefined || value === '') return '';
  return `
    <tr>
      <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-weight: 600; color: #475569; width: 35%; vertical-align: top; ${isHighlight ? 'background-color: #f8fafc;' : ''}">
        ${escapeHtml(label)}
      </td>
      <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #0f172a; font-weight: 500; ${isHighlight ? 'background-color: #f8fafc;' : ''}">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

export class EmailService {
  /**
   * Dispatches an enquiry notification email for both Homepage and Contact Page forms.
   */
  static async sendEnquiryNotification(data: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    city?: string;
    address?: string;
    serviceRequired: string;
    monthlyBill?: string;
    solarType?: string;
    subject?: string;
    message: string;
    createdAt?: string;
  }): Promise<{ success: boolean; id?: string; error?: string }> {
    const resend = getResendClient();
    if (!resend) {
      console.log('[email-service] RESEND_API_KEY not configured. Skipping enquiry email notification.');
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    const isHomepage = Boolean(
      (data.subject && data.subject.toLowerCase().includes('homepage')) ||
      (data.address && data.address.toLowerCase().includes('homepage'))
    );

    const formOrigin = isHomepage ? 'Homepage "Get In Touch" Lead' : 'Contact Page Enquiry Form';
    const emailSubject = isHomepage
      ? `New Website Enquiry (Homepage) – ${data.fullName}`
      : `New Contact Enquiry – ${data.fullName}`;

    const submissionTime = data.createdAt
      ? new Date(data.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'short' }) + ' (PKT)'
      : new Date().toISOString();

    const fieldsHtml = `
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
        ${renderFieldRow('Submission ID', data.id, true)}
        ${renderFieldRow('Form Source', formOrigin, true)}
        ${renderFieldRow('Full Name', data.fullName)}
        ${renderFieldRow('Email Address', data.email)}
        ${renderFieldRow('Phone Number', data.phone || 'Not provided')}
        ${renderFieldRow('City / Location', data.city)}
        ${renderFieldRow('Service Required', data.serviceRequired)}
        ${renderFieldRow('Monthly Electricity Bill', data.monthlyBill)}
        ${renderFieldRow('Solar System Type', data.solarType)}
        ${renderFieldRow('Subject', data.subject)}
        ${renderFieldRow('Submission Time', submissionTime)}
      </table>

      <div style="background-color: #f8fafc; border-left: 4px solid #10b981; border-radius: 6px; padding: 16px; margin-top: 16px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin-bottom: 8px;">
          Message &amp; Project Scope:
        </div>
        <div style="font-size: 13px; line-height: 1.6; color: #0f172a;">
          ${formatMultilineText(data.message)}
        </div>
      </div>
    `;

    const html = renderEmailTemplate({
      title: emailSubject,
      badge: isHomepage ? 'Homepage Lead' : 'Contact Form',
      badgeColor: '#059669',
      contentHtml: fieldsHtml,
    });

    const to = getNotificationRecipient();
    const from = getNotificationSender();

    try {
      const response = await resend.emails.send({
        from,
        to,
        replyTo: data.email,
        subject: emailSubject,
        html,
      });

      if (response.error) {
        console.error('[email-service] Resend API returned error for enquiry:', response.error);
        return { success: false, error: response.error.message };
      }

      console.log(`[email-service] Enquiry notification email successfully dispatched to ${to} (Resend ID: ${response.data?.id})`);
      return { success: true, id: response.data?.id };
    } catch (err: any) {
      console.error('[email-service] Exception while sending enquiry email:', err?.message || err);
      return { success: false, error: err?.message || 'Unknown error' };
    }
  }

  /**
   * Dispatches a custom quotation request notification email.
   */
  static async sendQuoteNotification(data: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    company?: string;
    country: string;
    solutionType: string;
    projectType: string;
    estimatedCapacity?: string;
    estimatedBudget?: string;
    timeline?: string;
    message?: string;
    status?: string;
    createdAt?: string;
  }): Promise<{ success: boolean; id?: string; error?: string }> {
    const resend = getResendClient();
    if (!resend) {
      console.log('[email-service] RESEND_API_KEY not configured. Skipping quote email notification.');
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    const emailSubject = `New Quote Request – ${data.fullName}${data.company ? ` (${data.company})` : ''}`;
    const submissionTime = data.createdAt
      ? new Date(data.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'short' }) + ' (PKT)'
      : new Date().toISOString();

    const fieldsHtml = `
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
        ${renderFieldRow('Request ID', data.id, true)}
        ${renderFieldRow('Form Source', 'Custom Quotation Estimator (/request-a-quote)', true)}
        ${renderFieldRow('Client Name', data.fullName)}
        ${renderFieldRow('Business Email', data.email)}
        ${renderFieldRow('Phone Number', data.phone)}
        ${renderFieldRow('Company / Organization', data.company || 'Not provided')}
        ${renderFieldRow('Country / Region', data.country)}
        ${renderFieldRow('Technology / Solution Type', data.solutionType.toUpperCase())}
        ${renderFieldRow('Project Environment', data.projectType.toUpperCase())}
        ${renderFieldRow('Estimated Capacity', data.estimatedCapacity || 'Not specified')}
        ${renderFieldRow('Estimated Budget', data.estimatedBudget || 'Not specified')}
        ${renderFieldRow('Deployment Timeline', data.timeline || 'Not specified')}
        ${renderFieldRow('Status', (data.status || 'pending').toUpperCase())}
        ${renderFieldRow('Submission Time', submissionTime)}
      </table>

      ${
        data.message
          ? `
        <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; border-radius: 6px; padding: 16px; margin-top: 16px;">
          <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin-bottom: 8px;">
            Project Scope Notes / Analyzer Context:
          </div>
          <div style="font-size: 13px; line-height: 1.6; color: #0f172a;">
            ${formatMultilineText(data.message)}
          </div>
        </div>
      `
          : ''
      }
    `;

    const html = renderEmailTemplate({
      title: emailSubject,
      badge: 'Quotation Request',
      badgeColor: '#0284c7',
      contentHtml: fieldsHtml,
    });

    const to = getNotificationRecipient();
    const from = getNotificationSender();

    try {
      const response = await resend.emails.send({
        from,
        to,
        replyTo: data.email,
        subject: emailSubject,
        html,
      });

      if (response.error) {
        console.error('[email-service] Resend API returned error for quote request:', response.error);
        return { success: false, error: response.error.message };
      }

      console.log(`[email-service] Quote notification email successfully dispatched to ${to} (Resend ID: ${response.data?.id})`);
      return { success: true, id: response.data?.id };
    } catch (err: any) {
      console.error('[email-service] Exception while sending quote email:', err?.message || err);
      return { success: false, error: err?.message || 'Unknown error' };
    }
  }

  /**
   * Dispatches a review submission notification email.
   */
  static async sendReviewNotification(data: {
    id: string;
    name: string;
    email: string;
    company?: string;
    role?: string;
    service: string;
    rating: number;
    review: string;
    status: string;
    createdAt?: string;
  }): Promise<{ success: boolean; id?: string; error?: string }> {
    const resend = getResendClient();
    if (!resend) {
      console.log('[email-service] RESEND_API_KEY not configured. Skipping review email notification.');
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    const starIcons = '★'.repeat(Math.max(1, Math.min(5, data.rating))) + '☆'.repeat(Math.max(0, 5 - data.rating));
    const emailSubject = `New Client Review Submitted – ${data.name} (${data.rating}/5 Stars)`;
    const submissionTime = data.createdAt
      ? new Date(data.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'short' }) + ' (PKT)'
      : new Date().toISOString();

    const fieldsHtml = `
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 20px;">
        ${renderFieldRow('Review ID', data.id, true)}
        ${renderFieldRow('Form Source', 'Client Testimonials Modal Submission', true)}
        ${renderFieldRow('Client Name', data.name)}
        ${renderFieldRow('Client Email', data.email)}
        ${renderFieldRow('Company / Organization', data.company || 'Not specified')}
        ${renderFieldRow('Role / Designation', data.role || 'Not specified')}
        ${renderFieldRow('Service / Project Delivered', data.service)}
        ${renderFieldRow('Rating Given', `${starIcons} (${data.rating} / 5 Stars)`)}
        ${renderFieldRow('Moderation Status', data.status.toUpperCase(), true)}
        ${renderFieldRow('Submission Time', submissionTime)}
      </table>

      <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 16px; margin-top: 16px;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; margin-bottom: 8px;">
          Submitted Review Content:
        </div>
        <div style="font-size: 13px; line-height: 1.6; color: #0f172a; font-style: italic;">
          &ldquo;${formatMultilineText(data.review)}&rdquo;
        </div>
      </div>

      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px; margin-top: 16px; font-size: 12px; color: #1e40af; line-height: 1.5;">
        <strong>Admin Notice:</strong> This review is currently marked as <strong>${escapeHtml(data.status)}</strong> and will not appear publicly on the website until approved in the administration portal.
      </div>
    `;

    const html = renderEmailTemplate({
      title: emailSubject,
      badge: 'Client Review',
      badgeColor: '#f59e0b',
      contentHtml: fieldsHtml,
      footerNote: 'This review was submitted via the public client review form on the E&E Industries website and requires admin moderation.',
    });

    const to = getNotificationRecipient();
    const from = getNotificationSender();

    try {
      const response = await resend.emails.send({
        from,
        to,
        replyTo: data.email,
        subject: emailSubject,
        html,
      });

      if (response.error) {
        console.error('[email-service] Resend API returned error for client review:', response.error);
        return { success: false, error: response.error.message };
      }

      console.log(`[email-service] Review notification email successfully dispatched to ${to} (Resend ID: ${response.data?.id})`);
      return { success: true, id: response.data?.id };
    } catch (err: any) {
      console.error('[email-service] Exception while sending review email:', err?.message || err);
      return { success: false, error: err?.message || 'Unknown error' };
    }
  }
}
