import Logout from "@/helpers/logout";

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
    try {
      const response = await fetch(input, init);

      
      if (response.status === 401) {
        await Logout();
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
}
  