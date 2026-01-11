// Analytics module with session tracking and event logging

export interface AnalyticsEvent {
  event_type: "page_view" | "property_click" | "filter_change" | "form_submit" | "dwell_time";
  property_id?: string;
  timestamp: string;
  session_id: string;
  metadata?: Record<string, unknown>;
}

// Session storage
const SESSION_KEY = "hf_session_id";

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// Event storage
const events: AnalyticsEvent[] = [];

// Page view timing for dwell time
const pageViewTimes: Record<string, number> = {};

export const trackEvent = (
  event_type: AnalyticsEvent["event_type"],
  property_id?: string,
  metadata?: Record<string, unknown>
) => {
  const event: AnalyticsEvent = {
    event_type,
    property_id,
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    metadata,
  };
  
  events.push(event);
  console.log("[Analytics]", event);
  
  // In production, this would send to a backend
  // sendToBackend(event);
};

export const getEvents = () => [...events];

export const getSessionEvents = () => {
  const sessionId = getSessionId();
  return events.filter(e => e.session_id === sessionId);
};

export const trackPageView = (page: string) => {
  // Track previous page dwell time
  const prevPage = Object.keys(pageViewTimes).pop();
  if (prevPage && pageViewTimes[prevPage]) {
    const dwellTime = Date.now() - pageViewTimes[prevPage];
    trackEvent("dwell_time", undefined, { 
      page: prevPage, 
      duration_ms: dwellTime,
      duration_sec: Math.round(dwellTime / 1000)
    });
  }
  
  // Record new page view time
  pageViewTimes[page] = Date.now();
  
  trackEvent("page_view", undefined, { page });
};

export const trackPropertyClick = (propertyId: string, metadata?: Record<string, unknown>) => {
  trackEvent("property_click", propertyId, metadata);
};

export const trackFilterChange = (filters: Record<string, unknown>) => {
  trackEvent("filter_change", undefined, filters);
};

export const trackFormSubmit = (formType: string, success: boolean = true) => {
  trackEvent("form_submit", undefined, { formType, success });
};

// Analytics summary
export const getAnalyticsSummary = () => {
  const sessionId = getSessionId();
  const sessionEvents = events.filter(e => e.session_id === sessionId);
  
  return {
    totalEvents: events.length,
    sessionEvents: sessionEvents.length,
    pageViews: events.filter(e => e.event_type === "page_view").length,
    propertyClicks: events.filter(e => e.event_type === "property_click").length,
    uniquePropertiesClicked: [...new Set(events
      .filter(e => e.event_type === "property_click" && e.property_id)
      .map(e => e.property_id)
    )].length,
    formSubmissions: events.filter(e => e.event_type === "form_submit").length,
  };
};
