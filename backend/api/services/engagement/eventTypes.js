"use strict";
/**
 * Event type definitions and utilities for user action events
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.outcomeToEventType = outcomeToEventType;
exports.getAllEventTypes = getAllEventTypes;
exports.isCompletionEvent = isCompletionEvent;
exports.isNegativeFeedback = isNegativeFeedback;
exports.isDeferralEvent = isDeferralEvent;
/**
 * Map outcome to event type
 */
function outcomeToEventType(outcome) {
    const mapping = {
        done: 'DONE',
        snooze: 'SNOOZE',
        dismiss: 'DISMISS',
    };
    return mapping[outcome];
}
/**
 * Get all event types
 */
function getAllEventTypes() {
    return ['SHOWN', 'DONE', 'DISMISS', 'SNOOZE'];
}
/**
 * Check if event type is a completion type (DONE)
 */
function isCompletionEvent(eventType) {
    return eventType === 'DONE';
}
/**
 * Check if event type is a negative feedback (DISMISS)
 */
function isNegativeFeedback(eventType) {
    return eventType === 'DISMISS';
}
/**
 * Check if event type is a deferral (SNOOZE)
 */
function isDeferralEvent(eventType) {
    return eventType === 'SNOOZE';
}
