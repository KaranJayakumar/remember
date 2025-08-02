import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { createConnectionApi } from "~/api/api";

export const useConnections = () => {
  const { getToken } = useAuth();

  const getConnections = async () => {
    const token = await getToken();
    if (!token) throw new Error("No session token available");

    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BASE_API_URL}/connections`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch connections: ${res.status} ${errorText}`,
      );
    }

    const data = await res.json();
    return data.connections;
  };

  const {
    data: connections,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["connections"],
    queryFn: getConnections,
  });

  const createConnectionMutation = useMutation({
    mutationFn: async ({
      name,
      tags,
      imageUrl,
    }: {
      name: string;
      tags?: Record<string, string>;
      imageUrl?: string;
    }) => {
      const token = await getToken();
      if (!token) throw new Error("Missing token");

      return createConnectionApi({ token, name, tags, imageUrl });
    },
  });

  const createConnection = async (name: string, tags?: Record<string, string>, imageUrl?: string) => {
    return createConnectionMutation.mutateAsync({ name, tags, imageUrl });
  };

  return {
    refetch,
    connections,
    isLoading,
    createConnection,
    error,
  };
};
