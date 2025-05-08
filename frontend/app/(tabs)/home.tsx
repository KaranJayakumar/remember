import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

type Connection = {
  id: string;
  name: string;
  parentUserId: string;
};

export default function Home() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/connections`);
        const data = await response.json();
        setConnections(data);
      } catch (error) {
        console.error('Error fetching connections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Connections</Text>
      <FlatList
        data={connections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.subtext}>Parent User ID: {item.parentUserId}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { marginBottom: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 6 },
  name: { fontSize: 16, fontWeight: '600' },
  subtext: { fontSize: 14, color: '#666' },
});

