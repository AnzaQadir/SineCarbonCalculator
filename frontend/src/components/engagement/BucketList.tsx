import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Clock } from 'lucide-react';
import { BucketIcon } from './icons/BucketIcon';
import { getBucketList, type BucketListResponse } from '@/services/engagementService';

interface BucketListProps {
  onClose: () => void;
}

export const BucketList: React.FC<BucketListProps> = ({ onClose }) => {
  const [data, setData] = useState<BucketListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'done' | 'snoozed'>('all');

  useEffect(() => {
    const loadBucketList = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getBucketList();
        setData(result);
      } catch (err) {
        console.error('Error loading bucket list:', err);
        setError(err instanceof Error ? err.message : 'Failed to load bucket list');
      } finally {
        setLoading(false);
      }
    };

    loadBucketList();
  }, []);

  const filteredItems = data?.items.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  }) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden mt-12 md:mt-16"
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-teal via-brand-emerald to-brand-teal text-white px-8 py-8 md:py-10 flex items-start justify-between">
          <div className="absolute inset-0">
            <span className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
            <span className="absolute top-1/2 -translate-y-1/2 -right-16 h-44 w-44 rounded-full bg-brand-emerald/40 blur-3xl" />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 w-[90%] rounded-t-full bg-white/10 blur-2xl opacity-70" />
          </div>

          <div className="relative flex items-center gap-4 md:gap-6">
            <div className="flex md:hidden items-center justify-center w-14 h-14 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md shadow-lg shadow-emerald-900/15">
              <BucketIcon className="w-7 h-7 text-white" strokeWidth={1.7} />
            </div>
            <div className="hidden md:flex items-center justify-center w-20 h-20 rounded-[30px] bg-white/12 border border-white/20 backdrop-blur-lg shadow-xl shadow-emerald-900/20">
              <BucketIcon className="w-10 h-10 text-white" strokeWidth={1.6} />
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-semibold tracking-tight drop-shadow-sm">My Bucket List</h2>
              <p className="text-white/85 text-sm font-medium">
                {data ? `${data.total} ${data.total === 1 ? 'action' : 'actions'} saved` : 'Loading your saved wins...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 transition-all flex items-center justify-center shadow-lg shadow-emerald-900/30 backdrop-blur-sm"
            aria-label="Close bucket list"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        {data && data.total > 0 && (
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                filter === 'all'
                  ? 'bg-brand-teal text-white shadow-emerald-500/40 shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({data.total})
            </button>
            <button
              onClick={() => setFilter('done')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 shadow-sm ${
                filter === 'done'
                  ? 'bg-brand-teal text-white shadow-emerald-500/40 shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Done ({data.doneCount})
            </button>
            <button
              onClick={() => setFilter('snoozed')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 shadow-sm ${
                filter === 'snoozed'
                  ? 'bg-brand-teal text-white shadow-emerald-500/40 shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              Saved for Later ({data.snoozedCount})
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="relative w-24 h-24 mx-auto mb-5">
                <div className="absolute inset-0 rounded-full bg-brand-teal/10 blur-lg" />
                <div className="absolute inset-2 rounded-full bg-brand-emerald/15" />
                <div className="absolute inset-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                  <BucketIcon className="w-10 h-10 text-brand-teal" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Your bucket is empty</h3>
              <p className="text-slate-600">
                {filter === 'all'
                  ? "Mark actions as 'Do it now' or 'Save for later' to add them here"
                  : filter === 'done'
                  ? "You haven't completed any actions yet"
                  : "You haven't saved any actions for later"}
              </p>
            </div>
          )}

          {!loading && !error && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-shadow"
                  >
                    {/* Status Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'done'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.status === 'done' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Done
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Saved for Later
                          </>
                        )}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDate(item.lastUpdatedAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.subtitle}</p>
                    )}

                    {/* Category */}
                    <div className="text-xs text-slate-500 uppercase tracking-wide">
                      {item.category}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50 text-center">
          <p className="text-sm text-slate-600">
            Keep adding actions to build your personalized bucket list
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};




