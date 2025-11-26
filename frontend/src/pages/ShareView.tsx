import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import SocialShareCard from '@/components/SocialShareCard';

interface ShareRecord {
  id: string;
  contentType: string;
  payload: any;
  imageUrl?: string | null;
}

export default function ShareView() {
  const { id } = useParams();
  const [record, setRecord] = useState<ShareRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShare = async () => {
      try {
        setLoading(true);
        const apiBase = import.meta.env.VITE_API_BASE || '/api';
        const res = await fetch(`${apiBase}/share/${id}`);
        const json = await res.json();
        if (!json?.success) throw new Error(json?.error || 'Failed to load');
        setRecord(json.record);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchShare();
  }, [id]);

  if (loading) return <Layout><div className="min-h-[60vh] flex items-center justify-center">Loading…</div></Layout>;
  if (error || !record) return <Layout><div className="min-h-[60vh] flex items-center justify-center">Not found</div></Layout>;

  // Minimal display: render the SocialShareCard using payload fields
  const { payload } = record;
  const headline = payload?.headline || payload?.comprehensivePowerMoves?.personality?.archetype || 'Your Climate Self';
  // Clean hookline: remove markdown formatting and extra text
  const rawHookline = payload?.comprehensivePowerMoves?.personality?.hookLine || 'Your unique climate hook—shine with your strengths.';
  const subheadline = rawHookline.trim().replace(/\*\*.*?\*\*/g, '').replace(/\n/g, ' ').trim();
  const illustrationSrc = payload?.profileImage || '/images/profile.jpg';
  const userName = payload?.userName || undefined;

  return (
    <Layout>
      <div className="py-8">
        <SocialShareCard
          headline={headline}
          subheadline={subheadline}
          illustrationSrc={illustrationSrc}
          mascotSrc={'/images/panda.svg'}
          logoSrc={'/images/new_logo.png'}
          backgroundColors={['#F75B5B', '#F79292']}
          onClose={() => navigate('/')}
          userName={userName}
        />
      </div>
    </Layout>
  );
}


