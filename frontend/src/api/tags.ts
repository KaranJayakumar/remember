import { Tag } from "~/types/connections";

export async function getTagsApi({
  token,
  connectionId,
}: {
  token: string;
  connectionId: string;
}): Promise<Tag[]> {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/connections/${connectionId}/tags`,
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
    throw new Error(`Failed to get tags: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function createTagApi({
  token,
  connectionId,
  name,
  value,
}: {
  token: string;
  connectionId: string;
  name: string;
  value: string;
}) {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/connections/${connectionId}/tags`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        value,
        connection_id: connectionId,
      }),
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create tag: ${res.status} ${errorText}`);
  }

  return res.json() as Promise<Tag>;
}

export async function deleteTagApi({
  token,
  tagId,
}: {
  token: string;
  tagId: string;
}) {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/tags/${tagId}`,
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
    throw new Error(`Failed to delete tag: ${res.status} ${errorText}`);
  }

  return res.json();
}
