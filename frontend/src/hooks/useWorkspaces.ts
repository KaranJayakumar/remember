import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { createConnectionApi, listWorkspacesApi } from "~/api/api";
import { useMemo } from "react";
import { Workspace } from "~/types/connections";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

const WORKSPACE_KEY = 'workspace'
export const useWorkspace = () => {
  const { getToken } = useAuth();
  const { getItem, setItem } = useAsyncStorage(WORKSPACE_KEY)


  const getCurrentWorkspace = async () => {
    const storedWorkspace = await getItem()
    let workspace : Workspace; 
    if(storedWorkspace){
       workspace = JSON.parse(storedWorkspace);
    }else{
      const workspaces = await getWorkspaces()
      workspace = workspaces[0]
      await setItem(JSON.stringify(workspace))
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

