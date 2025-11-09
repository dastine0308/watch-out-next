import { cookies } from "next/headers";

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

async function fetchWithAuth(
  endpoint: string,
  options: FetchOptions = {},
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const apiBaseUrl =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured");
  }

  const url = `${apiBaseUrl.replace(/\/$/, "")}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Connection timeout");
    }
    throw error;
  }
}

export async function getUserInfo(userId?: string) {
  try {
    const endpoint = `/user/${userId}`;
    const response = await fetchWithAuth(endpoint);

    if (response.status !== 200) {
      let errorMessage = "Failed to get user info";
      const text = await response.text();
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          endpoint,
        });
      } catch {
        // If response is not JSON, use status text
        console.error("API Error (non-JSON):", {
          status: response.status,
          statusText: response.statusText,
          body: text,
          endpoint,
        });
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
}

export async function getDevicesList() {
  try {
    const endpoint = "/device/list";
    const response = await fetchWithAuth(endpoint, {
      method: "GET",
    });

    if (response.status !== 200) {
      let errorMessage = "Failed to get devices list";
      const text = await response.text();
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    try {
      const data = await response.json();
      return data?.devices;
    } catch (error) {
      console.error("Error parsing devices list:", error);
      throw new Error("Failed to parse devices list");
    }
  } catch (error) {
    console.error("Error fetching devices list:", error);
    throw error;
  }
}

export async function getAlertsList() {
  try {
    const endpoint = "/alert/list";
    const response = await fetchWithAuth(endpoint, {
      method: "GET",
    });
    if (response.status !== 200) {
      let errorMessage = "Failed to get alerts list";
      const text = await response.text();
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage || "Failed to get alerts list");
    }
    try {
      const data = await response.json();
      console.log("alerts list response", response);
      console.log("alerts list data", data);
      console.log("alerts list data", data?.alerts);
      // 確保返回的是數組
      const alerts = data?.alerts;
      return Array.isArray(alerts) ? alerts : [];
    } catch (error) {
      console.error("Error parsing alerts list:", error);
      throw new Error("Failed to parse alerts list");
    }
  } catch (error) {
    console.error("Error fetching alerts list:", error);
    throw error;
  }
}

export async function getAlertDetail(alertId: string) {
  try {
    const endpoint = `/alert/${alertId}`;
    const response = await fetchWithAuth(endpoint, {
      method: "GET",
    });

    if (response.status !== 200) {
      let errorMessage = "Failed to get alert detail";
      const text = await response.text();
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          endpoint,
        });
      } catch {
        console.error("API Error (non-JSON):", {
          status: response.status,
          statusText: response.statusText,
          body: text,
          endpoint,
        });
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching alert detail:", error);
    throw error;
  }
}
