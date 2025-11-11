/**
 * Event type definitions and utilities for user action events
 */

export type ActionEventType = 'SHOWN' | 'DONE' | 'DISMISS' | 'SNOOZE';

export type ActionOutcome = 'done' | 'snooze' | 'dismiss';

/**
 * Map outcome to event type
 */
export function outcomeToEventType(outcome: ActionOutcome): ActionEventType {
  const mapping: Record<ActionOutcome, ActionEventType> = {
    done: 'DONE',
    snooze: 'SNOOZE',
    dismiss: 'DISMISS',
  };
  return mapping[outcome];
}

/**
 * Get all event types
 */
export function getAllEventTypes(): ActionEventType[] {
  return ['SHOWN', 'DONE', 'DISMISS', 'SNOOZE'];
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




