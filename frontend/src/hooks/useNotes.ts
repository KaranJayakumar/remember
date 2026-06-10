import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { createNoteApi } from "~/api/api";

export const useNotes = () => {
  const { getToken } = useAuth();

  const createNoteMutation = useMutation({
    mutationFn: async ({
      connectionId,
      content,
    }: {
      connectionId: string;
      content: string;
    }) => {
      const token = await getToken();
      if (!token) throw new Error("Missing token");
      return createNoteApi({ token, connectionId, content });
    },
  });

  const createNote = async (connectionId: string, content: string) => {
    return createNoteMutation.mutateAsync({ connectionId, content });
  };

  return {
    createNote,
    isPending: createNoteMutation.isPending,
  };
};
