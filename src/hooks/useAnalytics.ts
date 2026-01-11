import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TablesInsert } from "@/integrations/supabase/types";

// Session storage for anonymous session ID
const SESSION_KEY = "hf_session_id";

export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

type EventInsert = TablesInsert<"events">;

export const useTrackEvent = () => {
  return useMutation({
    mutationFn: async (event: Omit<EventInsert, "session_id">) => {
      const { error } = await supabase.from("events").insert({
        ...event,
        session_id: getSessionId(),
      });

      if (error) {
        console.error("Error tracking event:", error);
      }
    },
  });
};

export const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: async () => {
      const { count: pageViews, error: pvError } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("type", "page_view");

      const { count: clicks, error: clickError } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("type", "property_click");

      if (pvError || clickError) {
        console.error("Error fetching analytics:", pvError || clickError);
      }

      return {
        pageViews: pageViews ?? 0,
        propertyClicks: clicks ?? 0,
      };
    },
  });
};

// Helper functions for tracking events
export const trackPageView = async (page: string) => {
  const { error } = await supabase.from("events").insert({
    type: "page_view",
    session_id: getSessionId(),
    metadata: { page },
  });

  if (error) {
    console.error("Error tracking page view:", error);
  }
};

export const trackPropertyClick = async (
  propertyId: string,
  metadata?: Record<string, unknown>
) => {
  const { error } = await supabase.from("events").insert({
    type: "property_click",
    property_id: propertyId,
    session_id: getSessionId(),
    metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
  });

  if (error) {
    console.error("Error tracking property click:", error);
  }
};

// Detailed analytics for property clicks (sorted by most clicked)
export const usePropertyClicksAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "property-clicks"],
    queryFn: async () => {
      // Get all click events with property details
      const { data: events, error } = await supabase
        .from("events")
        .select("property_id")
        .eq("type", "property_click")
        .not("property_id", "is", null);

      if (error) throw error;

      // Count clicks per property
      const clickCounts: Record<string, number> = {};
      events?.forEach((event) => {
        if (event.property_id) {
          clickCounts[event.property_id] = (clickCounts[event.property_id] || 0) + 1;
        }
      });

      // Get unique property IDs
      const propertyIds = Object.keys(clickCounts);
      
      if (propertyIds.length === 0) {
        return [];
      }

      // Fetch property details
      const { data: properties, error: propError } = await supabase
        .from("properties")
        .select("*")
        .in("id", propertyIds);

      if (propError) throw propError;

      // Combine and sort by click count
      const result = propertyIds.map((propertyId) => ({
        property_id: propertyId,
        click_count: clickCounts[propertyId],
        property: properties?.find((p) => p.id === propertyId) || null,
      }));

      // Sort by click count descending
      result.sort((a, b) => b.click_count - a.click_count);

      return result;
    },
  });
};

// Detailed analytics for page views (sorted by most viewed)
export const usePageViewsAnalytics = () => {
  return useQuery({
    queryKey: ["analytics", "page-views"],
    queryFn: async () => {
      const { data: events, error } = await supabase
        .from("events")
        .select("metadata")
        .eq("type", "page_view");

      if (error) throw error;

      // Count views per page
      const viewCounts: Record<string, number> = {};
      events?.forEach((event) => {
        const page = (event.metadata as { page?: string })?.page || "unknown";
        viewCounts[page] = (viewCounts[page] || 0) + 1;
      });

      // Convert to array and sort
      const result = Object.entries(viewCounts).map(([page, view_count]) => ({
        page,
        view_count,
      }));

      result.sort((a, b) => b.view_count - a.view_count);

      return result;
    },
  });
};
