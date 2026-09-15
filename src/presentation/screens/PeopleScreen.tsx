import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Person } from '../../domain/entities/Person';
import { GetPeople } from '../../domain/usecases/GetPeople';

interface PeopleScreenProps {
  getPeople: GetPeople;
}

export function PeopleScreen({ getPeople }: PeopleScreenProps) {
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestId = useRef(0);

  const loadPeople = useCallback(async () => {
    const currentRequestId = requestId.current + 1;
    requestId.current = currentRequestId;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getPeople.execute();

      if (requestId.current === currentRequestId) {
        setPeople(result);
      }
    } catch {
      if (requestId.current === currentRequestId) {
        setPeople([]);
        setError('Unable to load people. Please try again.');
      }
    } finally {
      if (requestId.current === currentRequestId) {
        setIsLoading(false);
      }
    }
  }, [getPeople]);

  useEffect(() => {
    loadPeople();

    return () => {
      requestId.current += 1;
    };
  }, [loadPeople]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator accessibilityLabel="Loading people" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
        <Button title="Retry" onPress={loadPeople} />
      </View>
    );
  }

  if (people.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No people found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={people}
      keyExtractor={(person) => person.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.person}>
          <Text style={styles.name}>{item.name}</Text>
          <Text>{item.email}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    padding: 16,
  },
  person: {
    marginBottom: 16,
  },
  name: {
    fontWeight: '600',
  },
});
