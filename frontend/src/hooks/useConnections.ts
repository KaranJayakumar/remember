import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { createConnectionApi, getConnectionsApi } from "~/api/api";
import { useWorkspace } from "./useWorkspaces";

export const useConnections = () => {
  const { getToken } = useAuth();

  const getConnections = async () => {
    const token = await getToken();
    if (!token) throw new Error("No session token available");
    const {workspace} = useWorkspace()
    return getConnectionsApi({token, workspaceId : workspace?.id || ''})
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
