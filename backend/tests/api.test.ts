import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import { getAdminCredentials, signToken, SESSION_COOKIE_NAME } from '../src/middleware/auth';

describe('E&E Industries Backend API Endpoints', () => {
  let adminCookie: string;
  const adminCredentials = getAdminCredentials();

  beforeAll(() => {
    // Generate valid admin test session token
    const token = signToken({
      email: adminCredentials.email,
      exp: Date.now() + 24 * 60 * 60 * 1000,
    });
    adminCookie = `${SESSION_COOKIE_NAME}=${token}`;
  });

  describe('1. Health Check Endpoint', () => {
    it('GET /api/health returns status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.service).toBe('ene-industries-backend');
    });
  });

  describe('2. Authentication Endpoints', () => {
    it('POST /api/auth/login succeeds with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: adminCredentials.email,
          password: adminCredentials.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it('POST /api/auth/login rejects invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@wrong.com',
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('POST /api/auth/logout clears session', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('GET /api/auth/verify returns authenticated state with valid cookie', async () => {
      const res = await request(app)
        .get('/api/auth/verify')
        .set('Cookie', [adminCookie]);

      expect(res.status).toBe(200);
      expect(res.body.authenticated).toBe(true);
    });
  });

  describe('3. Projects API Endpoints', () => {
    let createdProjectId: string;

    it('GET /api/projects returns public project list', async () => {
      const res = await request(app).get('/api/projects');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /api/projects/:slug returns single project by slug', async () => {
      const res = await request(app).get('/api/projects/mns-university-of-agriculture-multan');
      expect(res.status).toBe(200);
      expect(res.body.slug).toBe('mns-university-of-agriculture-multan');
    });

    it('POST /api/projects requires admin auth', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({
          title: 'Unauthorized Test',
          slug: 'unauthorized-test',
        });

      expect(res.status).toBe(401);
    });

    it('POST /api/projects creates a new project when authenticated (with optional fullStory)', async () => {
      const uniqueSlug = `test-solar-${Date.now()}`;
      const res = await request(app)
        .post('/api/projects')
        .set('Cookie', [adminCookie])
        .send({
          title: 'Automated Test Solar Project',
          slug: uniqueSlug,
          client: 'Test Enterprise',
          location: 'Lahore, Pakistan',
          capacity: '500 kW',
          category: 'Commercial Solar',
          completionYear: 2026,
          summary: 'High performance industrial rooftop photovoltaic array installation.',
          fullStory: '', // optional empty fullStory
          mainImage: '/images/test-project.jpg',
          gallery: ['/images/test-supporting-1.jpg', '/images/test-supporting-video.mp4'], // 1 image + 1 video (valid)
          isFeatured: false,
          status: 'published',
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.slug).toBe(uniqueSlug);
      createdProjectId = res.body.id;
    });

    it('POST /api/projects rejects creation when required fields or gallery are missing', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Cookie', [adminCookie])
        .send({
          title: 'Incomplete Project',
          slug: `incomplete-${Date.now()}`,
          client: 'Incomplete Enterprise',
          // missing location, capacity, mainImage, gallery
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('POST /api/projects rejects creation when gallery has more than 3 items', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Cookie', [adminCookie])
        .send({
          title: 'Too Many Media Items',
          slug: `too-many-media-${Date.now()}`,
          client: 'Test Enterprise',
          location: 'Lahore, Pakistan',
          capacity: '500 kW',
          category: 'Commercial Solar',
          completionYear: 2024,
          summary: 'High performance industrial rooftop photovoltaic array installation.',
          mainImage: '/images/test-project.jpg',
          gallery: [
            '/images/1.jpg',
            '/images/2.jpg',
            '/images/3.jpg',
            '/images/4.jpg', // 4 items (invalid)
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('POST /api/projects rejects creation when gallery contains 2 or more videos', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Cookie', [adminCookie])
        .send({
          title: 'Multiple Videos Project',
          slug: `multiple-videos-${Date.now()}`,
          client: 'Test Enterprise',
          location: 'Lahore, Pakistan',
          capacity: '500 kW',
          category: 'Commercial Solar',
          completionYear: 2024,
          summary: 'High performance industrial rooftop photovoltaic array installation.',
          mainImage: '/images/test-project.jpg',
          gallery: [
            '/images/video-1.mp4',
            '/images/video-2.webm', // 2 videos (invalid)
          ],
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation failed');
    });

    it('PUT /api/projects/:id updates an existing project', async () => {
      if (!createdProjectId) return;

      const res = await request(app)
        .put(`/api/projects/${createdProjectId}`)
        .set('Cookie', [adminCookie])
        .send({
          summary: 'Updated project summary through automated testing.',
          capacity: '750 kW',
        });

      expect(res.status).toBe(200);
      expect(res.body.capacity).toBe('750 kW');
    });

    it('DELETE /api/projects/:id permanently deletes project', async () => {
      if (!createdProjectId) return;

      const res = await request(app)
        .delete(`/api/projects/${createdProjectId}`)
        .set('Cookie', [adminCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('4. Reviews API Endpoints', () => {
    let createdReviewId: string;

    it('GET /api/reviews/approved returns approved featured reviews', async () => {
      const res = await request(app).get('/api/reviews/approved');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /api/reviews/submit accepts client review submission', async () => {
      const res = await request(app)
        .post('/api/reviews/submit')
        .send({
          name: 'Hashim Khan',
          email: 'hashim.khan@testclient.pk',
          company: 'Khan Industrial Works',
          role: 'Technical Lead',
          service: 'Solar EPC & Power Design',
          rating: 5,
          review: 'Outstanding engineering execution from the initial site audit through installation and testing.',
          consent: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.reviewId).toBeDefined();
      createdReviewId = res.body.reviewId;
    });

    it('PATCH /api/reviews/:id moderates review status', async () => {
      if (!createdReviewId) return;

      const res = await request(app)
        .patch(`/api/reviews/${createdReviewId}`)
        .set('Cookie', [adminCookie])
        .send({
          status: 'approved',
          featured: true,
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('approved');
      expect(res.body.featured).toBe(true);
    });

    it('DELETE /api/reviews/:id deletes review from moderation queue', async () => {
      if (!createdReviewId) return;

      const res = await request(app)
        .delete(`/api/reviews/${createdReviewId}`)
        .set('Cookie', [adminCookie]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('5. Enquiries & Quote Requests API Endpoints', () => {
    it('POST /api/enquiries stores contact enquiry', async () => {
      const res = await request(app)
        .post('/api/enquiries')
        .send({
          fullName: 'Zainab Bibi',
          email: 'zainab@corporate.pk',
          phone: '+92 300 1234567',
          city: 'Lahore',
          serviceRequired: 'Solar Energy',
          message: 'We are requesting a site survey for a 200kW commercial rooftop.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('POST /api/quote-requests stores quote request', async () => {
      const res = await request(app)
        .post('/api/quote-requests')
        .send({
          fullName: 'Kamran Ali',
          email: 'kamran@logistics.com',
          phone: '+92 321 7654321',
          country: 'Pakistan',
          solutionType: 'solar',
          projectType: 'commercial',
          estimatedCapacity: '1 MW - 5 MW',
          message: 'Please provide layout estimate and ROI calculation.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });
});
