import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { createInteractionApi, deleteInteractionApi, getInteractionsApi } from "~/api/interactions";

export const useInteractions = () => {
  const { getToken } = useAuth();

  const getInteractions = async (connectionId: string) => {
    const token = await getToken();
    if (!token) throw new Error("Missing token");
    return getInteractionsApi({ token, connectionId });
  };

  const createInteractionMutation = useMutation({
    mutationFn: async ({
      connectionId,
      type,
      content,
      photoUrl,
    }: {
      connectionId: string;
      type: string;
      content: string;
      photoUrl?: string;
    }) => {
      const token = await getToken();
      if (!token) throw new Error("Missing token");
      return createInteractionApi({ token, connectionId, type, content, photoUrl });
    },
  });

  const deleteInteractionMutation = useMutation({
    mutationFn: async ({ interactionId }: { interactionId: number }) => {
      const token = await getToken();
      if (!token) throw new Error("Missing token");
      return deleteInteractionApi({ token, interactionId });
    },
  });

  const createInteraction = async (connectionId: string, type: string, content: string, photoUrl?: string) => {
    return createInteractionMutation.mutateAsync({ connectionId, type, content, photoUrl });
  };

  const deleteInteraction = async (interactionId: number) => {
    return deleteInteractionMutation.mutateAsync({ interactionId });
  };

  return {
    getInteractions,
    createInteraction,
    deleteInteraction,
    isPending: createInteractionMutation.isPending || deleteInteractionMutation.isPending,
  };
};
