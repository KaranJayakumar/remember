import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { createConnectionApi, listWorkspacesApi } from "~/api/api";
import { appStorage } from "~/lib/storage";
import { useMemo } from "react";
import { Workspace } from "~/types/connections";

const WORKSPACE_KEY = 'workspace'
export const useWorkspace = () => {
  const { getToken } = useAuth();


  const getCurrentWorkspace = async () => {
    const storedWorkspace = await appStorage.getItem(WORKSPACE_KEY)
    let workspace : Workspace; 
    if(storedWorkspace){
       workspace = JSON.parse(storedWorkspace);
    }else{
      const workspaces = await getWorkspaces()
      workspace = workspaces[0]
      await appStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace))
    }
    return workspace
  }
  const { data: workspace } = useQuery({
    queryKey: ["currentWorkspace"],
    queryFn: getCurrentWorkspace,
  });

  const getWorkspaces = async () => {
    const token = await getToken();
    if (!token) throw new Error("No session token available");
    const data = listWorkspacesApi({token})
    return data
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

