import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { createConnectionApi, listWorkspacesApi } from "~/api/api";
import { appStorage } from "~/lib/storage";
import { useMemo } from "react";

const WORKSPACE_KEY = 'workspace'
export const useWorkspace = () => {
  const { getToken } = useAuth();

  const workspace = useMemo(() => {
    return getCurrentWorkspace()
  }, [])

  const getCurrentWorkspace = async () => {
    let workspace = await appStorage.getItem(WORKSPACE_KEY);
    if(!workspace){
      const workspaces = getWorkspaces()
      workspace = workspaces[0]
      await appStorage.setItem(WORKSPACE_KEY, workspace)
    }
    return workspace
  }

  const getWorkspaces = async () => {
    const token = await getToken();
    if (!token) throw new Error("No session token available");
    const data = listWorkspacesApi({token})
  };

  const {
    data: connections,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  return {
    workspace, 
    refetch,
    connections,
    isLoading,
    error,
  };
};

