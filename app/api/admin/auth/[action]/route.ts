import { NextRequest, NextResponse } from 'next/server';
import {
  verifyAdminCredentials,
  registerNewAdminUser,
  createSessionToken,
  decodeSessionToken,
  DEFAULT_ADMIN_USERS,
  type AdminUserRole
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'fastonmed_admin_session';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ action: string }> }
) {
  const { action } = await context.params;

  // Sign In action
  if (action === 'login') {
    try {
      const body = await request.json();
      const identifier = String(body?.identifier || body?.email || '').trim();
      const password = String(body?.password || '').trim();

      if (!identifier) {
        return NextResponse.json(
          { success: false, error: 'Please enter your username or email.' },
          { status: 400 }
        );
      }
      if (!password) {
        return NextResponse.json(
          { success: false, error: 'Please enter your password.' },
          { status: 400 }
        );
      }

      const user = verifyAdminCredentials(identifier, password);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Invalid username/email or password.' },
          { status: 401 }
        );
      }

      const token = createSessionToken(user);
      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role
        }
      });

      // Set HTTP-only session cookie
      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
  }

  // Sign Up action
  if (action === 'signup') {
    try {
      const body = await request.json();
      const name = String(body?.name || '').trim();
      const email = String(body?.email || '').trim();
      const password = String(body?.password || '').trim();
      const role = (body?.role || 'Administrator') as AdminUserRole;

      if (!name) {
        return NextResponse.json({ success: false, error: 'Full name is required.' }, { status: 400 });
      }
      if (!email || !email.includes('@')) {
        return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
      }
      if (!password || password.length < 6) {
        return NextResponse.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
      }

      const result = registerNewAdminUser({
        name,
        email,
        password,
        role
      });

      if (!result.success || !result.user) {
        return NextResponse.json({ success: false, error: result.error || 'Failed to create user.' }, { status: 400 });
      }

      const token = createSessionToken(result.user);
      const response = NextResponse.json({
        success: true,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          username: result.user.username,
          role: result.user.role
        }
      });

      response.cookies.set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
  }

  // Sign Out / Logout action
  if (action === 'logout') {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.set({
      name: COOKIE_NAME,
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0
    });
    return response;
  }

  return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 404 });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ action: string }> }
) {
  const { action } = await context.params;

  if (action === 'me') {
    const cookie = request.cookies.get(COOKIE_NAME)?.value;
    if (!cookie) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const session = decodeSessionToken(cookie);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: session
    });
  }

  if (action === 'demo-accounts') {
    return NextResponse.json({
      success: true,
      accounts: DEFAULT_ADMIN_USERS.map((u) => ({
        name: u.name,
        email: u.email,
        username: u.username,
        role: u.role
      }))
    });
  }

  return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 404 });
}
