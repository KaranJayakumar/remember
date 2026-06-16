import { Workspace } from "~/types/connections";

export async function listWorkspacesApi({
  token,
}: {
  token: string;
}): Promise<Workspace[]> {
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
    throw new Error(`Failed to list workspaces: ${res.status} ${errorText}`);
  }

  return res.json();
}
