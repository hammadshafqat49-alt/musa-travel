import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from './db';

const adminSecret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || 'musa-admin-secret-key-2026');

export async function signAdminToken(payload: object) {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(adminSecret);
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, adminSecret, { clockTolerance: 60 });
    return payload;
  } catch {
    return null;
  }
}

export async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) throw new Error('Unauthorized');
  return admin;
}

export async function getAdminPermissions(role: string): Promise<string[]> {
  try {
    const row = await db.prepare("SELECT permissions FROM roles WHERE name = ?").get(role) as any;
    if (!row || !row.permissions) return [];
    return JSON.parse(row.permissions) as string[];
  } catch {
    return [];
  }
}

export async function getAdminWithPermissions() {
  const admin = await requireAdmin();
  const permissions = await getAdminPermissions(String(admin.role || 'admin'));
  return { admin, permissions };
}

export async function requirePermission(permission: string) {
  const { admin, permissions } = await getAdminWithPermissions();
  if (!permissions.includes(permission)) {
    throw new Error('Forbidden');
  }
  return admin;
}

export async function requireAnyPermission(permissions: string[]) {
  const { admin, permissions: userPerms } = await getAdminWithPermissions();
  if (!permissions.some((p) => userPerms.includes(p))) {
    throw new Error('Forbidden');
  }
  return admin;
}

export function adminErrorResponse(error: any) {
  const status =
    error?.message === 'Forbidden' ? 403 :
    error?.message === 'Unauthorized' ? 401 : 500;
  return NextResponse.json({ error: error.message || 'Failed' }, { status });
}
