import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FamilyMember, type Message } from "../backend";
import { useActor } from "./useActor";

export function useGetAllMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMessages();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      content,
      sender,
    }: { content: string; sender: FamilyMember }) => {
      if (!actor) throw new Error("No actor");
      await actor.sendMessage({ content, sender });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export { FamilyMember };
