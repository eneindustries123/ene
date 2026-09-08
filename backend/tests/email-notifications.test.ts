import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';

// Mock the Resend SDK before importing the app or services
const mockSend = vi.fn();

vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: mockSend,
      },
    })),
  };
});

import app from '../src/server';
import { EmailService, escapeHtml, formatMultilineText } from '../src/services/email.service';

describe('Transactional Email Notifications via Resend', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 're_test_mock_key_12345';
    process.env.FORM_NOTIFICATION_EMAIL = 'accounts@eneindustries.com';
    process.env.RESEND_FROM_EMAIL = 'notifications@eneindustries.com';
    mockSend.mockResolvedValue({
      data: { id: 'mock-resend-msg-id-123' },
      error: null,
    });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('1. HTML Sanitization & Helper Logic', () => {
    it('properly escapes dangerous HTML characters to prevent injection in emails', () => {
      const maliciousInput = '<script>alert("XSS & attack")</script>\'test\'';
      const escaped = escapeHtml(maliciousInput);
      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&quot;');
      expect(escaped).toContain('&#39;');
    });

    it('formats multi-line strings into HTML line breaks after escaping', () => {
      const multiline = 'Line 1\n<b>Line 2</b>\nLine 3';
      const formatted = formatMultilineText(multiline);
      expect(formatted).toBe('Line 1<br/>&lt;b&gt;Line 2&lt;/b&gt;<br/>Line 3');
    });
  });

  describe('2. Homepage Get In Touch Form Email Trigger', () => {
    it('sends structured notification email with Reply-To header when homepage enquiry is submitted', async () => {
      const payload = {
        fullName: 'Ali Raza',
        email: 'ali.raza@industrial-client.pk',
        phone: '+92 300 9876543',
        company: 'Homepage Lead (Solar Energy)',
        subject: 'Homepage Lead for Solar Energy',
        serviceRequired: 'Solar Energy',
        message: 'Service Type: Solar Energy\nMessage: Interested in 100kW rooftop solar system.',
      };

      const res = await request(app).post('/api/enquiries').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.id).toBeDefined();

      // Check Resend send mock
      expect(mockSend).toHaveBeenCalledTimes(1);
      const emailArg = mockSend.mock.calls[0][0];

      expect(emailArg.from).toBe('notifications@eneindustries.com');
      expect(emailArg.to).toBe('accounts@eneindustries.com');
      expect(emailArg.replyTo).toBe('ali.raza@industrial-client.pk');
      expect(emailArg.subject).toContain('New Website Enquiry (Homepage) – Ali Raza');
      expect(emailArg.html).toContain('Ali Raza');
      expect(emailArg.html).toContain('ali.raza@industrial-client.pk');
      expect(emailArg.html).toContain('+92 300 9876543');
      expect(emailArg.html).toContain('Solar Energy');
      expect(emailArg.html).toContain('Interested in 100kW rooftop solar system.');
      expect(emailArg.html).toContain('Homepage &quot;Get In Touch&quot; Lead');
    });
  });

  describe('3. Contact Page Direct Enquiry Form Email Trigger', () => {
    it('sends complete contact enquiry notification including solar options and city', async () => {
      const payload = {
        fullName: 'Fatima Noor',
        email: 'fatima@textilemills.com',
        phone: '+92 321 4455667',
        city: 'Faisalabad, Punjab',
        address: 'Plot 45, Industrial Estate',
        serviceRequired: 'Solar Energy',
        monthlyBill: 'PKR 100,000 – 250,000 / month',
        solarType: 'On-Grid Net Metering',
        subject: 'Industrial Solar Survey Request',
        message: 'We require a load audit and rooftop feasibility study for our spinning unit.',
      };

      const res = await request(app).post('/api/enquiries').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      expect(mockSend).toHaveBeenCalledTimes(1);
      const emailArg = mockSend.mock.calls[0][0];

      expect(emailArg.from).toBe('notifications@eneindustries.com');
      expect(emailArg.to).toBe('accounts@eneindustries.com');
      expect(emailArg.replyTo).toBe('fatima@textilemills.com');
      expect(emailArg.subject).toContain('New Contact Enquiry – Fatima Noor');
      expect(emailArg.html).toContain('Fatima Noor');
      expect(emailArg.html).toContain('fatima@textilemills.com');
      expect(emailArg.html).toContain('Faisalabad, Punjab');
      expect(emailArg.html).toContain('PKR 100,000 – 250,000 / month');
      expect(emailArg.html).toContain('On-Grid Net Metering');
      expect(emailArg.html).toContain('Industrial Solar Survey Request');
      expect(emailArg.html).toContain('Contact Page Enquiry Form');
    });
  });

  describe('4. Custom Quotation Request Form Email Trigger', () => {
    it('sends comprehensive quote request notification with engineering specifications and Reply-To', async () => {
      const payload = {
        fullName: 'Tariq Mehmood',
        email: 'tariq.m@steelworks.com.pk',
        phone: '+92 333 1122334',
        company: 'Prime Steel Works',
        country: 'Lahore, Pakistan',
        solutionType: 'solar',
        projectType: 'industrial',
        estimatedCapacity: '1 MW - 5 MW',
        estimatedBudget: 'PKR 50M - 100M',
        timeline: '3 - 6 months',
        message: 'Source: ENE Solar Bill Analyzer\nPreliminary recommendation: 1.5 MWp On-Grid\nPlease provide detailed bill of quantities.',
      };

      const res = await request(app).post('/api/quote-requests').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      expect(mockSend).toHaveBeenCalledTimes(1);
      const emailArg = mockSend.mock.calls[0][0];

      expect(emailArg.from).toBe('notifications@eneindustries.com');
      expect(emailArg.to).toBe('accounts@eneindustries.com');
      expect(emailArg.replyTo).toBe('tariq.m@steelworks.com.pk');
      expect(emailArg.subject).toContain('New Quote Request – Tariq Mehmood (Prime Steel Works)');
      expect(emailArg.html).toContain('Tariq Mehmood');
      expect(emailArg.html).toContain('Prime Steel Works');
      expect(emailArg.html).toContain('SOLAR');
      expect(emailArg.html).toContain('INDUSTRIAL');
      expect(emailArg.html).toContain('1 MW - 5 MW');
      expect(emailArg.html).toContain('PKR 50M - 100M');
      expect(emailArg.html).toContain('3 - 6 months');
      expect(emailArg.html).toContain('Preliminary recommendation: 1.5 MWp On-Grid');
      expect(emailArg.html).toContain('Custom Quotation Estimator (/request-a-quote)');
    });
  });

  describe('5. Client Review Submission Form Email Trigger', () => {
    it('sends review moderation notification email with rating, reviewer info, and admin notice', async () => {
      const payload = {
        name: 'Bilal Farooq',
        email: 'bilal@logistics-hub.pk',
        company: 'Logistics Hub Multan',
        role: 'Chief Operating Officer',
        service: '1.2MW Commercial Solar Array',
        rating: 5,
        review: 'Exceptional solar EPC delivery with top-tier project management and transparent communication.',
        consent: true,
      };

      const res = await request(app).post('/api/reviews/submit').send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);

      expect(mockSend).toHaveBeenCalledTimes(1);
      const emailArg = mockSend.mock.calls[0][0];

      expect(emailArg.from).toBe('notifications@eneindustries.com');
      expect(emailArg.to).toBe('accounts@eneindustries.com');
      expect(emailArg.replyTo).toBe('bilal@logistics-hub.pk');
      expect(emailArg.subject).toContain('New Client Review Submitted – Bilal Farooq (5/5 Stars)');
      expect(emailArg.html).toContain('Bilal Farooq');
      expect(emailArg.html).toContain('bilal@logistics-hub.pk');
      expect(emailArg.html).toContain('Logistics Hub Multan');
      expect(emailArg.html).toContain('Chief Operating Officer');
      expect(emailArg.html).toContain('1.2MW Commercial Solar Array');
      expect(emailArg.html).toContain('5 / 5 Stars');
      expect(emailArg.html).toContain('Exceptional solar EPC delivery');
      expect(emailArg.html).toContain('will not appear publicly on the website until approved');
    });
  });

  describe('6. Validation Failures & No Email Sent', () => {
    it('does NOT trigger email sending when enquiry payload validation fails', async () => {
      const invalidPayload = {
        fullName: 'A', // too short
        email: 'not-an-email',
        serviceRequired: '',
        message: 'short',
      };

      const res = await request(app).post('/api/enquiries').send(invalidPayload);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('does NOT trigger email sending when quote request payload validation fails', async () => {
      const invalidPayload = {
        fullName: '',
        email: 'invalid-email',
        // missing required fields
      };

      const res = await request(app).post('/api/quote-requests').send(invalidPayload);

      expect(res.status).toBe(400);
      expect(mockSend).not.toHaveBeenCalled();
    });

    it('does NOT trigger email sending when review submission fails validation', async () => {
      const invalidPayload = {
        name: 'A',
        email: 'bad-email',
        rating: 10, // max 5
        consent: false, // consent must be true
      };

      const res = await request(app).post('/api/reviews/submit').send(invalidPayload);

      expect(res.status).toBe(400);
      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  describe('7. Failure Isolation & Non-blocking Resilience', () => {
    it('returns 201 success to client even when Resend API returns an error', async () => {
      mockSend.mockResolvedValueOnce({
        data: null,
        error: { message: 'Domain not verified in Resend dashboard' },
      });

      const res = await request(app).post('/api/enquiries').send({
        fullName: 'Hamza Sheikh',
        email: 'hamza@sheikh-enterprises.com',
        phone: '+92 300 1122334',
        serviceRequired: 'Fabrication & Design',
        message: 'Inquiry for custom steel warehouse fabrication and PEB structures.',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.id).toBeDefined();
    });

    it('returns 201 success to client even when Resend API throws an unexpected network error', async () => {
      mockSend.mockRejectedValueOnce(new Error('Resend network timeout 504'));

      const res = await request(app).post('/api/quote-requests').send({
        fullName: 'Hamza Sheikh',
        email: 'hamza@sheikh-enterprises.com',
        phone: '+92 300 1122334',
        country: 'Pakistan',
        solutionType: 'hybrid',
        projectType: 'commercial',
        message: 'Resilience test quote request.',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('8. Custom Environment Variable Configuration', () => {
    it('uses custom FORM_NOTIFICATION_EMAIL and RESEND_FROM_EMAIL when set in process.env', async () => {
      process.env.FORM_NOTIFICATION_EMAIL = 'custom-leads@eneindustries.com';
      process.env.RESEND_FROM_EMAIL = 'custom-sender@eneindustries.com';

      const res = await request(app).post('/api/enquiries').send({
        fullName: 'Naveed Akhtar',
        email: 'naveed@company.com',
        phone: '+92 300 7788990',
        serviceRequired: 'Trading & Contracting',
        message: 'Requesting procurement catalog and pricing for solar inverters.',
      });

      expect(res.status).toBe(201);
      expect(mockSend).toHaveBeenCalledTimes(1);

      const emailArg = mockSend.mock.calls[0][0];
      expect(emailArg.to).toBe('custom-leads@eneindustries.com');
      expect(emailArg.from).toBe('custom-sender@eneindustries.com');
    });

    it('gracefully skips sending email when RESEND_API_KEY is not set', async () => {
      delete process.env.RESEND_API_KEY;

      const res = await request(app).post('/api/enquiries').send({
        fullName: 'Sohail Khan',
        email: 'sohail@company.com',
        phone: '+92 300 5566778',
        serviceRequired: 'Solar Energy',
        message: 'Testing graceful skip when RESEND_API_KEY is not configured.',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(mockSend).not.toHaveBeenCalled();
    });
  });
});
