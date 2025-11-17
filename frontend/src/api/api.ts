import { Workspace } from "~/types/connections";

export async function createConnectionApi({
  token,
  name,
  tags,
  imageUrl,
}: {
  token: string;
  name: string;
  tags?: Record<string, string>;
  imageUrl?: string;
}) {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/connections`,
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

  const data = await res.json();
  return data;
}

export async function listWorkspacesApi({
  token,
}: {
  token: string;
}) : Promise<Workspace[]>{
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/workspaces`,
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
    throw new Error(`Failed to create connection: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  return data;
}
