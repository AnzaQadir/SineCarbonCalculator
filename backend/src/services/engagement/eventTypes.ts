/**
 * Event type definitions and utilities for user action events
 */

export type ActionEventType = 'SHOWN' | 'DONE' | 'DISMISS' | 'SNOOZE' | 'INTENDED';

export type ActionOutcome = 'done' | 'snooze' | 'dismiss' | 'intended';

export type NotUsefulReason = 'not_relevant' | 'too_hard' | 'already_doing';

export type SnoozeTime = 'evening' | 'weekend' | 'no_reminders';

/**
 * Map outcome to event type
 */
export function outcomeToEventType(outcome: ActionOutcome): ActionEventType {
  const mapping: Record<ActionOutcome, ActionEventType> = {
    done: 'DONE',
    snooze: 'SNOOZE',
    dismiss: 'DISMISS',
    intended: 'INTENDED',
  };
  return mapping[outcome];
}

/**
 * Get all event types
 */
export function getAllEventTypes(): ActionEventType[] {
  return ['SHOWN', 'DONE', 'DISMISS', 'SNOOZE', 'INTENDED'];
}

/**
 * Check if event type is a completion type (DONE)
 */
export function isCompletionEvent(eventType: ActionEventType): boolean {
  return eventType === 'DONE';
}

/**
 * Check if event type is a negative feedback (DISMISS)
 */
export function isNegativeFeedback(eventType: ActionEventType): boolean {
  return eventType === 'DISMISS';
}

/**
 * Check if event type is a deferral (SNOOZE)
 */
export function isDeferralEvent(eventType: ActionEventType): boolean {
  return eventType === 'SNOOZE';
}




