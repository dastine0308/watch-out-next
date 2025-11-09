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
    const endpoint = userId ? `/user/${userId}` : "/user/";
    const response = await fetchWithAuth(endpoint);

    if (response.status !== 200) {
      let errorMessage = "Failed to get user info";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          endpoint,
        });
      } catch {
        // If response is not JSON, use status text
        const text = await response.text();
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

export async function getDevicesList(userId?: string) {
  try {
    const endpoint = userId ? `/device/list?user_id=${userId}` : "/device/list";
    const response = await fetchWithAuth(endpoint);

    if (response.status !== 200) {
      let errorMessage = "Failed to get devices list";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          endpoint,
        });
      } catch {
        // If response is not JSON, use status text
        const text = await response.text();
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

    const data = await response.json();

    // Transform API response to match expected format
    if (Array.isArray(data)) {
      return data;
    } else if (data?.devices && Array.isArray(data.devices)) {
      return data.devices;
    } else {
      // Return empty array if structure is unexpected
      console.warn("Unexpected devices data structure:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching devices list:", error);
    throw error;
  }
}
