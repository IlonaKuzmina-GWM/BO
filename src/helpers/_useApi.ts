// import { useAuthStore } from "@/stores/auth"
// interface ApiOptions {
//   method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
//   headers?: Record<string, string>;
//   body?: Record<string, any>; 
// }

// export async function api<T>(url: string, options: ApiOptions): Promise<T> {
//   const authCookie = useCookie('authToken');
//   const messagesWhiteList = ['Wrong authentication code'];
  
//   const authStore = useAuthStore();
//   while (authStore.$state === undefined) {
//     await new Promise(resolve => setTimeout(resolve, 100));
//   }

//   const defaultHeaders = {
//     Authorization: authCookie.value ? `Bearer ${authCookie.value}` : ''
//   };
  
//   const response = await $fetch<T>(useUrl(url), {
//     method: options.method,
//     headers: {
//       ...defaultHeaders,
//       ...options.headers,
//     },
//     body: options.body ? JSON.stringify(options.body) : undefined,
//   })
//   .catch((error) => {
//     if (error.statusCode === 401) {
//       if (messagesWhiteList.includes(error.response._data.message)) return;
//       authStore.setLogout()
// 	    window.location.href = process.env.NODE_ENV === "development" ? "/login" : "/portal/login" + window.location.search
//     }
//   })

//   return response as any;
// }