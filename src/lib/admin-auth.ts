import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

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
