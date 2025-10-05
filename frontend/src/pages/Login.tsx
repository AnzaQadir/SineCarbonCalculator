import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useUserStore } from '@/stores/userStore';
import { checkUserExists } from '@/services/api';
import { setUserData } from '@/services/session';
import { useNavigate } from 'react-router-dom';

const API_BASE = (() => {
  const envBase = (import.meta as any).env?.VITE_API_BASE_URL || (import.meta as any).env?.VITE_API_BASE || (import.meta as any).env?.VITE_BACKEND_URL;
  if (typeof window !== 'undefined') {
    const sameOrigin = `${window.location.protocol}//${window.location.host}`;
    if (!envBase) {
      if (window.location.port === '8080') return '/api';
      return 'http://localhost:3000/api';
    }
    if (envBase === sameOrigin || envBase === 'http://localhost:8080' || envBase === 'https://localhost:8080') {
      return '/api';
    }
  }
  return envBase as string;
})();

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.message || 'Login failed');
      }
      const j = await res.json().catch(() => ({}));
      const emailFromApi: string | undefined = j?.email;

      // 1) Immediate header update for instant feedback
      if (emailFromApi) {
        const fallbackName = (emailFromApi.split('@')[0] || 'Friend');
        setUser({ name: fallbackName, email: emailFromApi });
      }

      // 2) Enrich user data asynchronously (doesn't block navigation)
      (async () => {
        try {
          if (emailFromApi) {
            const resp = await checkUserExists(emailFromApi);
            if (resp?.success && resp?.exists && resp?.user) {
              const u = resp.user;
              if (u?.id) localStorage.setItem('zerrah_user_id', u.id);
              setUser({ id: u.id, name: u.firstName || (emailFromApi.split('@')[0] || 'Friend'), email: u.email });
              setUserData({
                email: u.email,
                firstName: u.firstName || (emailFromApi.split('@')[0] || 'Friend'),
                age: u.age,
                gender: u.gender,
                profession: u.profession,
                country: u.country,
                city: u.city,
                household: u.household,
              });
            }
          }
        } catch {}
      })();

      // 3) Client-side navigate to Home so store persists and header shows immediately
      navigate('/');
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left: Illustration */}
        <div className="relative">
          <div className="rounded-3xl overflow-hidden bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
            <img
              src="/images/cute_panda.png"
              alt="Bobo waving in a bamboo grove at sunrise"
              className="w-full h-[440px] object-cover"
            />
          </div>
          <ul className="mt-4 grid grid-cols-3 text-sm text-[#385256]">
            <li>🔒 Privacy-first</li>
            <li>🌿 Guilt-free</li>
            <li>⚡ 2-min insights</li>
          </ul>
        </div>

        {/* Right: Login Card */}
        <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-8">
          <h1 className="text-3xl font-bold text-[#1f2f31]">Log in</h1>
          <p className="text-sm text-[#5b6b6f] mt-1">
            New to Zerrah? <a href="/signup" className="text-[#16626D] font-medium">Sign up for free</a>
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-[#24383b]">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-1 w-full rounded-xl border border-black/10 px-4 py-3 focus:ring-2 focus:ring-[#16626D] outline-none"
                placeholder="you@domain.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-[#24383b]">Password</label>
                <a href="#" className="text-xs text-[#16626D] font-medium">Forgot password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="mt-1 w-full rounded-xl border border-black/10 px-4 py-3 focus:ring-2 focus:ring-[#16626D] outline-none"
                placeholder="••••"
              />
              <p className="text-xs text-[#6b7b7e] mt-1">Demo password: <code>1234</code></p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#16626D] text-white font-semibold py-3 hover:bg-[#14575F] transition disabled:opacity-60"
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="rounded-xl border border-black/10 py-3 bg-white"> Apple</button>
              <button type="button" className="rounded-xl border border-black/10 py-3 bg-white">G Google</button>
            </div>

            <p className="text-xs text-center text-[#6b7b7e]">
              Protected with TLS · We never sell your data
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;


