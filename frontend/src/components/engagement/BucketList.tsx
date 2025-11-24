import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { BucketIcon } from './icons/BucketIcon';
import { getBucketList, markActionDone, recordIntendedAction, type BucketListResponse, type BucketListItem } from '@/services/engagementService';
import { DetailsPanel } from './DetailsPanel';
import { DoItNowFlow } from './DoItNowFlow';
import { SnoozeToast } from './SnoozeToast';
import { NotUsefulSheet } from './NotUsefulSheet';

interface BucketListProps {
  onClose: () => void;
}

export const BucketList: React.FC<BucketListProps> = ({ onClose }) => {
  const [data, setData] = useState<BucketListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'done' | 'snoozed'>('all');
  const [selectedItem, setSelectedItem] = useState<BucketListItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDoItNowFlow, setShowDoItNowFlow] = useState(false);
  const [showSnoozeToast, setShowSnoozeToast] = useState(false);
  const [showNotUsefulSheet, setShowNotUsefulSheet] = useState(false);

  const loadBucketList = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const result = await getBucketList();
      setData(result);
    } catch (err) {
      console.error('Error loading bucket list:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bucket list');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadBucketList();
  }, []);

  // Record "intended" event when DoItNowFlow opens
  useEffect(() => {
    if (showDoItNowFlow && selectedItem) {
      recordIntendedAction(selectedItem.id, {
        device: 'web',
        time_of_day: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
      });
    }
  }, [showDoItNowFlow, selectedItem]);

  const handleAction = async (recommendationId: string, outcome: 'done' | 'snooze' | 'dismiss', reason?: string) => {
    try {
      setActionLoading(recommendationId);
      console.log('[BucketList] Processing action:', { recommendationId, outcome });
      
      const result = await markActionDone(recommendationId, outcome, reason, { surface: 'web' });
      console.log('[BucketList] Action processed, result:', result);

      // Refresh bucket list after action (without showing loading spinner)
      await loadBucketList(false);

      // Close modal if action was done or dismissed (item will be removed or status changed)
      if (outcome === 'done' || outcome === 'dismiss') {
        setShowDetailModal(false);
        setSelectedItem(null);
        setShowDetailsPanel(false);
      } else if (outcome === 'snooze') {
        // For snooze, just update the selected item status
        if (selectedItem) {
          setSelectedItem({ ...selectedItem, status: 'snoozed' });
        }
      }
    } catch (error) {
      console.error('[BucketList] Error processing action:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process action. Please try again.';
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

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
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDetailModal(true);
                      setShowDetailsPanel(false);
                    }}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
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

      {/* Detail Modal - Same design as BestNextActionCard */}
      <AnimatePresence>
        {showDetailModal && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => {
              setShowDetailModal(false);
              setSelectedItem(null);
              setShowDetailsPanel(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl border border-slate-200/40 p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedItem(null);
                  setShowDetailsPanel(false);
                }}
                className="absolute top-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                  {selectedItem.title}
                </h3>
                {selectedItem.subtitle && (
                  <p className="text-sm md:text-base text-slate-600">{selectedItem.subtitle}</p>
                )}
              </div>

              {/* Soft Segmented Control - Premium Action Zone - Only show for "Saved for Later" items */}
              {selectedItem.status === 'snoozed' && (
                <div className="mb-6 rounded-3xl p-1.5 shadow-sm bg-cream-50 border border-slate-200">
                  <div className="flex gap-1.5">
                    {/* Do it now - Primary */}
                    <motion.button
                      onClick={() => {
                        if (!actionLoading) {
                          setShowDoItNowFlow(true);
                        }
                      }}
                      disabled={actionLoading === selectedItem.id}
                      className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-teal to-brand-emerald py-3.5 px-4 text-sm font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 shadow-md hover:shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {actionLoading === selectedItem.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Do it now
                        </span>
                      )}
                    </motion.button>

                    {/* Will do it later - Secondary */}
                    <button
                      onClick={() => {
                        if (!actionLoading) {
                          setShowSnoozeToast(true);
                        }
                      }}
                      disabled={actionLoading === selectedItem.id}
                      className="flex-1 rounded-2xl border border-sky-300 bg-transparent py-3 px-4 text-sm font-medium text-sky-600 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-sky-50 hover:border-sky-400"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        Will do it later
                      </span>
                    </button>

                    {/* Not useful - Muted */}
                    <button
                      onClick={() => {
                        if (!actionLoading) {
                          setShowNotUsefulSheet(true);
                        }
                      }}
                      disabled={actionLoading === selectedItem.id}
                      className="flex-1 rounded-2xl border border-pink-300 bg-transparent py-3 px-4 text-sm font-medium text-pink-400 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-pink-50 hover:border-pink-400"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <X className="h-4 w-4" />
                        Not useful
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Learn More Toggle */}
              <div className="mb-2">
                <button
                  onClick={() => setShowDetailsPanel((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-semibold text-brand-teal transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                >
                  <span>{showDetailsPanel ? 'Hide details' : 'Curious? Open details'}</span>
                  {showDetailsPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {showDetailsPanel && selectedItem.recommendation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pt-4"
                  >
                    <DetailsPanel
                      item={{
                        id: selectedItem.id,
                        category: selectedItem.category,
                        title: selectedItem.title,
                        subtitle: selectedItem.subtitle,
                        previewImpact: selectedItem.previewImpact,
                        recommendation: selectedItem.recommendation,
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Do It Now Flow */}
              <AnimatePresence>
                {showDoItNowFlow && selectedItem.recommendation && (
                  <DoItNowFlow
                    recommendation={selectedItem.recommendation}
                    onDone={() => {
                      setShowDoItNowFlow(false);
                      setTimeout(() => {
                        handleAction(selectedItem.id, 'done');
                      }, 200);
                    }}
                    onExit={() => setShowDoItNowFlow(false)}
                    tone="friendly"
                  />
                )}
              </AnimatePresence>

              {/* Snooze Toast */}
              <AnimatePresence>
                {showSnoozeToast && (
                  <SnoozeToast
                    onDismiss={() => {
                      setShowSnoozeToast(false);
                      setTimeout(() => {
                        handleAction(selectedItem.id, 'snooze');
                      }, 200);
                    }}
                    onSelectTime={(time) => {
                      setShowSnoozeToast(false);
                      setTimeout(() => {
                        handleAction(selectedItem.id, 'snooze', time);
                      }, 200);
                    }}
                    tone="friendly"
                  />
                )}
              </AnimatePresence>

              {/* Not Useful Sheet */}
              <AnimatePresence>
                {showNotUsefulSheet && (
                  <NotUsefulSheet
                    onSelectReason={(reason) => {
                      setShowNotUsefulSheet(false);
                      setTimeout(() => {
                        handleAction(selectedItem.id, 'dismiss', reason);
                      }, 200);
                    }}
                    onDismiss={() => setShowNotUsefulSheet(false)}
                    tone="friendly"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};




