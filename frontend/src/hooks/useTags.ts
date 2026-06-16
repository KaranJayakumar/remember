import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { createTagApi, deleteTagApi, getTagsApi } from "~/api/tags";

export const useTags = () => {
  const { getToken } = useAuth();

  const getTags = async (connectionId: string) => {
    const token = await getToken();
    if (!token) throw new Error("Missing token");
    return getTagsApi({ token, connectionId });
  };

  const createTagMutation = useMutation({
    mutationFn: async ({
      connectionId,
      name,
      value,
    }: {
      connectionId: string;
      name: string;
      value: string;
    }) => {
      const token = await getToken();
      if (!token) throw new Error("Missing token");
      return createTagApi({ token, connectionId, name, value });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: async ({ tagId }: { tagId: string }) => {
      const token = await getToken();
      if (!token) throw new Error("Missing token");
      return deleteTagApi({ token, tagId });
    },
  });

  const createTag = async (connectionId: string, name: string, value: string) => {
    return createTagMutation.mutateAsync({ connectionId, name, value });
  };

  const deleteTag = async (tagId: string) => {
    return deleteTagMutation.mutateAsync({ tagId });
  };

  return {
    getTags,
    createTag,
    deleteTag,
    isPending: createTagMutation.isPending || deleteTagMutation.isPending,
  };
};
