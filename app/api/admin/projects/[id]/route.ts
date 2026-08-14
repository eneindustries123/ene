import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth';
import { getProjectById, updateProject, deleteProject, isSlugUnique } from '@/lib/projects-store';
import { projectSchema } from '@/lib/validators';
import { z } from 'zod';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const existing = await getProjectById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = projectSchema.parse(body);

    if (parsed.slug !== existing.slug && !isSlugUnique(parsed.slug, id)) {
      return NextResponse.json(
        { error: 'Slug already exists. Please choose a unique URL slug.' },
        { status: 400 }
      );
    }

    const updated = await updateProject(id, parsed);
    return NextResponse.json({ success: true, project: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message || 'Validation error' }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const isAuth = await verifyAdminSession();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;
  const existing = await getProjectById(id);
  if (!existing) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const { confirmTitle } = body || {};

    if (!confirmTitle || confirmTitle.trim() !== existing.title.trim()) {
      return NextResponse.json(
        { error: `Title confirmation mismatch. Please type exact project title "${existing.title}" to confirm permanent deletion.` },
        { status: 400 }
      );
    }

    await deleteProject(id);
    return NextResponse.json({ success: true, message: `Project "${existing.title}" permanently deleted.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete project' }, { status: 500 });
  }
}
