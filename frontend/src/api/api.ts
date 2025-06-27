export async function createConnectionApi(token: string, name: string) {

  const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/connections`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create connection: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  return data
}
