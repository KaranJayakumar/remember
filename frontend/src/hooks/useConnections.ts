import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { createConnectionApi, getConnectionsApi, getPresignedUploadUrlApi, uploadToPresignedUrl } from "~/api/api";
import { useWorkspace } from "./useWorkspaces";

export const useConnections = () => {
  const { getToken } = useAuth();
  const { workspace } = useWorkspace();

  const getConnections = async () => {
    const token = await getToken();
    if (!token) throw new Error("No session token available");
    return getConnectionsApi({ token, workspaceId: workspace?.id || "" });
  };

  const {
    data: connections,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["connections"],
    initialData : [],
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

      return createConnectionApi({ token, name, tags, imageUrl, workspaceId : workspace?.id || ''});
    },
  });

  const createConnection = async (name: string, tags?: Record<string, string>, imageUrl?: string) => {
    return createConnectionMutation.mutateAsync({ name, tags, imageUrl });
  };

  const uploadImage = async (fileUri: string, contentType: string) => {
    const token = await getToken();
    if (!token) throw new Error("Missing token");

    const { uploadURL, publicURL } = await getPresignedUploadUrlApi({
      token,
      contentType,
    });

    await uploadToPresignedUrl({
      uploadUrl: uploadURL,
      fileUri,
      contentType,
    });

    return publicURL;
  };

  return {
    refetch,
    connections,
    isLoading,
    createConnection,
    uploadImage,
    error,
  };
};
