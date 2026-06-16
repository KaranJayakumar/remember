import { Note } from "~/types/connections";

export async function createNoteApi({
  token,
  connectionId,
  content,
}: {
  token: string;
  connectionId: string;
  content: string;
}) {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/connections/${connectionId}/notes`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        connection_id: connectionId,
      }),
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create note: ${res.status} ${errorText}`);
  }

  return res.json() as Promise<Note>;
}

export async function getNotesApi({
  token,
  connectionId,
}: {
  token: string;
  connectionId: string;
}): Promise<Note[]> {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/connections/${connectionId}/notes`,
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
    throw new Error(`Failed to get notes: ${res.status} ${errorText}`);
  }

  return res.json();
}
