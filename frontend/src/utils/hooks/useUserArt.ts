import { useQuery } from '@tanstack/react-query';

export const useUserArt = (userId: number) => {
  return useQuery({
    queryKey: ['user-art', userId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/profile/get-user-art/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user art');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
};
