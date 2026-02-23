import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { BookCard } from '../components/BookCard';
import { searchBooks } from '../services/bookService';
import { Book } from '../types';

export type RootStackParamList = {
  Home: undefined;
  BookDetail: { book: Book };
};

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setBooks([]);
      setError(null);
      setSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchBooks();
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  async function fetchBooks() {
    setLoading(true);
    setError(null);
    try {
      const results = await searchBooks(query);
      setBooks(results);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }

  function renderBook({ item }: { item: Book }) {
    return (
      <BookCard
        book={item}
        onPress={() => navigation.navigate('BookDetail', { book: item })}
      />
    );
  }

  function renderContent() {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Searching books...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (searched && books.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No books found. Try a different search.</Text>
        </View>
      );
    }

    if (books.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={styles.hintText}>Search for books above</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.searchTitle}>Search Book</Text>
      <TextInput
        style={styles.input}
        placeholder="Book title or author"
        placeholderTextColor="#999"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 25,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  input: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 15,
    color: '#dc2626',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
  hintText: {
    fontSize: 15,
    color: '#999',
  },
});
