/**
 * Extracts data from NestJS ResponseInterceptor format
 * @param response The Axios response object
 * @returns The data portion from the response
 */
export const extractApiData = <T>(response: any): T => {
  // Check if the response follows the NestJS ResponseInterceptor format
  if (response?.data?.status === "success") {
    return response.data as T;
  }

  // Fallback to direct data access
  return response?.data as T;
};
