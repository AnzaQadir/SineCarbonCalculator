import { v4 as uuidv4 } from 'uuid';

export interface SessionData {
  sessionId: string;
  userId?: string;
  userData?: {
    email?: string;
    firstName?: string;
    age?: string;
    gender?: string;
    profession?: string;
    country?: string;
    city?: string;
    household?: string;
  };
  lastSeen: Date;
}

export interface EventData {
  eventType: string;
  payload?: Record<string, any>;
  timestamp?: Date;
}

class SessionManager {
  private sessionId: string | null = null;
  private userData: SessionData['userData'] | null = null;

  constructor() {
    this.initializeSession();
  }

  private initializeSession(): void {
    // Check if session exists in localStorage
    const existingSessionId = localStorage.getItem('zerrah_session_id');
    
    if (existingSessionId) {
      this.sessionId = existingSessionId;
      // Try to load cached user data
      const cachedUserData = localStorage.getItem('zerrah_user_data');
      if (cachedUserData) {
        try {
          this.userData = JSON.parse(cachedUserData);
        } catch (error) {
          console.warn('Failed to parse cached user data:', error);
        }
      }
    } else {
      // Generate new session ID
      this.sessionId = uuidv4();
      localStorage.setItem('zerrah_session_id', this.sessionId);
    }
  }

  getSessionId(): string {
    if (!this.sessionId) {
      this.initializeSession();
    }
    return this.sessionId!;
  }

  getUserData(): SessionData['userData'] | null {
    return this.userData;
  }

  setUserData(userData: SessionData['userData']): void {
    this.userData = userData;
    if (userData) {
      localStorage.setItem('zerrah_user_data', JSON.stringify(userData));
    } else {
      localStorage.removeItem('zerrah_user_data');
    }
  }

  clearSession(): void {
    this.sessionId = null;
    this.userData = null;
    localStorage.removeItem('zerrah_session_id');
    localStorage.removeItem('zerrah_user_data');
  }

  // Get session headers for API requests
  getSessionHeaders(): Record<string, string> {
    return {
      'X-Session-ID': this.getSessionId(),
    };
  }
}

// Create singleton instance
export const sessionManager = new SessionManager();

// Export convenience functions
export const getSessionId = () => sessionManager.getSessionId();
export const getUserData = () => sessionManager.getUserData();
export const setUserData = (userData: SessionData['userData']) => sessionManager.setUserData(userData);
export const getSessionHeaders = () => sessionManager.getSessionHeaders();
export const clearSession = () => sessionManager.clearSession(); 