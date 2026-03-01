const { supabase, supabaseAdmin, ok, err, options, CORS } = require('./_shared');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return options();

  const path   = event.path.replace('/.netlify/functions/auth', '').replace('/api/auth', '');
  const method = event.httpMethod;
  const body   = event.body ? JSON.parse(event.body) : {};

  // POST /api/auth/signup
  if (path === '/signup' && method === 'POST') {
    const { email, fullName } = body;
    if (!email) return err(400, 'Email is required.');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          data: { full_name: fullName || '' },
          emailRedirectTo: process.env.APP_URL,
        },
      });
      if (error) return err(400, error.message);
      return ok({ success: true, message: 'Check your email for a 6-digit verification code.' });
    } catch {
      return err(500, 'Failed to send verification email.');
    }
  }

  // POST /api/auth/verify-otp
  if (path === '/verify-otp' && method === 'POST') {
    const { email, token } = body;
    if (!email || !token) return err(400, 'Email and code are required.');
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
      if (error) return err(400, 'Invalid or expired code. Please try again.');
      const { data: profile } = await supabaseAdmin
        .from('profiles').select('*').eq('id', data.user.id).single();
      return ok({
        success: true,
        accessToken:  data.session.access_token,
        refreshToken: data.session.refresh_token,
        user: { ...data.user, profile },
      });
    } catch {
      return err(500, 'Verification failed.');
    }
  }

  // POST /api/auth/signin
  if (path === '/signin' && method === 'POST') {
    const { email } = body;
    if (!email) return err(400, 'Email is required.');
    try {
      await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
      return ok({ success: true, message: 'Check your email for a verification code.' });
    } catch {
      return err(500, 'Failed to send sign-in code.');
    }
  }

  // POST /api/auth/refresh
  if (path === '/refresh' && method === 'POST') {
    const { refreshToken } = body;
    if (!refreshToken) return err(400, 'Refresh token required.');
    try {
      const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
      if (error) return err(401, 'Session expired. Please sign in again.');
      return ok({ accessToken: data.session.access_token, refreshToken: data.session.refresh_token });
    } catch {
      return err(500, 'Failed to refresh session.');
    }
  }

  return err(404, 'Not found.');
};
