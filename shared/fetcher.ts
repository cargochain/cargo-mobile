import { apiRequest } from "@/services/apiClient";

/**
 * SWR-compatible fetcher that includes automatic token refresh
 * Uses the existing apiClient which handles:
 * - Automatic token refresh on 401 responses
 * - Queue management for concurrent requests during refresh
 * - Fallback to login screen if refresh fails
 */
export const fetcher = async (url: string): Promise<any> => {
  const response = await apiRequest(url, {
    method: "GET",
  });

  if (!response.ok) {
    // Create an error object that SWR can handle
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    (error as any).status = response.status;
    (error as any).response = response;
    throw error;
  }

  return response.json();
};

/**
 * Fetcher for POST requests with data
 */
export const postFetcher = async (url: string, data?: any): Promise<any> => {
  const response = await apiRequest(url, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    (error as any).status = response.status;
    (error as any).response = response;
    throw error;
  }

  return response.json();
};

/**
 * Fetcher for PUT requests with data
 */
export const putFetcher = async (url: string, data?: any): Promise<any> => {
  const response = await apiRequest(url, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    (error as any).status = response.status;
    (error as any).response = response;
    throw error;
  }

  return response.json();
};

/**
 * Fetcher for DELETE requests
 */
export const deleteFetcher = async (url: string): Promise<any> => {
  const response = await apiRequest(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    (error as any).status = response.status;
    (error as any).response = response;
    throw error;
  }

  // For DELETE requests, check if there's content to parse
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return null;
};

/**
 * Generic fetcher that can handle different HTTP methods
 */
export const genericFetcher = async (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any
): Promise<any> => {
  const response = await apiRequest(url, {
    method,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
    (error as any).status = response.status;
    (error as any).response = response;
    throw error;
  }

  // Check if there's content to parse
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return null;
};
