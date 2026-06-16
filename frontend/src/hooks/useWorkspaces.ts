import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { listWorkspacesApi } from "~/api/workspaces";

export const useWorkspace = () => {
  const { getToken } = useAuth();

  const getWorkspaces = async () => {
    const token = await getToken();
    if (!token) throw new Error("No session token available");
    return listWorkspacesApi({ token });
  };

  const {
    data: workspaces,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  const workspace = workspaces && workspaces.length > 0 ? workspaces[0] : undefined;

  return {
    workspace,
    refetch,
    workspaces,
    isLoading,
    error,
  };
};
