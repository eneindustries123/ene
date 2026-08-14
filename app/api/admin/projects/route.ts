import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getAllProjects, createProject, isSlugUnique } from '@/lib/projects-store';
import { projectSchema } from '@/lib/validators';
import { z } from 'zod';

export async function GET() {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projects = await getAllProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = projectSchema.parse(body);

    if (!isSlugUnique(parsed.slug)) {
      return NextResponse.json(
        { error: 'Slug already exists. Please choose a unique URL slug.' },
        { status: 400 }
      );
    }

    const created = await createProject(parsed);
    return NextResponse.json({ success: true, project: created }, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to create project' }, { status: 500 });
  }
}
