import { Connection } from "~/types/connections";

export async function getConnectionsApi({
  token,
  workspaceId,
}: {
  token: string;
  workspaceId: string;
}): Promise<Connection[]> {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/workspaces/${workspaceId}/connections`,
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
    throw new Error(`Failed to get connections: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function createConnectionApi({
  token,
  name,
  tags,
  imageUrl,
  workspaceId,
}: {
  token: string;
  name: string;
  tags?: Record<string, string>;
  imageUrl?: string;
  workspaceId: string;
}) {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/workspaces/${workspaceId}/connections`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        tags,
        imageUrl,
      }),
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create connection: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function deleteConnectionApi({
  token,
  connectionId,
}: {
  token: string;
  connectionId: string;
}) {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/connections/${connectionId}`,
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
    throw new Error(`Failed to delete connection: ${res.status} ${errorText}`);
  }

  return res.json();
}
