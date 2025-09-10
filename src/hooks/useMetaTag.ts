import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface MetaTag {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

interface ApiErrorResponse {
  error: string;
}

export function useMetaTag(url: string) {
  return useQuery<MetaTag, Error>({
    queryKey: ["metaTag", url],
    queryFn: async () => {
      try {
        const response = await axios.get<MetaTag>("/api/meta-scrape", {
          params: { url },
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          const apiError = error.response.data as ApiErrorResponse;
          throw new Error(apiError.error || "Failed to fetch meta tags");
        }
        throw error;
      }
    },
    enabled: !!url,
    retry: 1,
  });
}
