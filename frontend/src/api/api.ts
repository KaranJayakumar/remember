import { Connection, Note, Workspace } from "~/types/connections";

export async function getPresignedUploadUrlApi({
  token,
  contentType,
}: {
  token: string;
  contentType: string;
}) {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_BASE_API_URL}/upload/url`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contentType,
      }),
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to get presigned URL: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  return data as { uploadURL: string; key: string; publicURL: string };
}

export async function uploadToPresignedUrl({
  uploadUrl,
  fileUri,
  contentType,
}: {
  uploadUrl: string;
  fileUri: string;
  contentType: string;
}) {
  const FileSystem = await import("expo-file-system");

  const uploadResult = await FileSystem.uploadAsync(uploadUrl, fileUri, {
    httpMethod: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
  });

  if (uploadResult.status < 200 || uploadResult.status >= 300) {
    throw new Error(
      `Failed to upload image: ${uploadResult.status} ${uploadResult.body}`,
    );
  }

  return true;
}

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

  const data = await res.json();
  return data as Note;
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
  workspaceId : string,
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

export async function getConnectionsApi({
  token,
  workspaceId
}: {
  token: string;
  workspaceId : string,
}) : Promise<Connection[]>{
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
    throw new Error(`Failed to create connection: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  return data;
}
