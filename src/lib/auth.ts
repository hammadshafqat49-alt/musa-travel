import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'musa-secret-key-2026');

export async function signToken(payload: object) {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 60 });
    return payload;
  } catch {
    return null;
  }
}

export async function getAgent() {
  const cookieStore = await cookies();
  const token = cookieStore.get('agent_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function requireAgent() {
  const agent = await getAgent();
  if (!agent) throw new Error('Unauthorized');
  return agent;
}
