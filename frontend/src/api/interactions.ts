import { Interaction } from "~/types/connections";

export async function getInteractionsApi({
  token,
  connectionId,
}: {
  token: string;
  connectionId: string;
}): Promise<Interaction[]> {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/connections/${connectionId}/interactions`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to get interactions: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function createInteractionApi({
  token,
  connectionId,
  type,
  content,
  photoUrl,
}: {
  token: string;
  connectionId: string;
  type: string;
  content: string;
  photoUrl?: string;
}) {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/connections/${connectionId}/interactions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection_id: connectionId,
        type,
        content,
        photo_url: photoUrl,
      }),
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create interaction: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function deleteInteractionApi({
  token,
  interactionId,
}: {
  token: string;
  interactionId: number;
}) {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/interactions/${interactionId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to delete interaction: ${res.status} ${errorText}`);
  }

  return res.json();
}
