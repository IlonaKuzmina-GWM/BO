export function setupFetchInterceptor(authStore: any, router: any) {
    const originalFetch = window.fetch;
  
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const response = await originalFetch(input, init);
  
        if (response.status === 401) {
          await fetch("/api/post-logout", { method: "POST" });
          authStore.setLogOut();
          router.push("/");
        }
  
        return response;
      } catch (error) {
        console.error("Ошибка в fetch:", error);
        throw error;
      }
    };
}
  