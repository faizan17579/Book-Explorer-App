import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import { Book } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface BookCardProps {
  book: Book;
  onPress?: () => void;
}

export function BookCard({ book, onPress }: BookCardProps) {
  const content = (
    <>
      {book.thumbnail ? (
        <Image
          source={{ uri: book.thumbnail }}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.cover, styles.placeholderCover]}>
          <Text style={styles.placeholderText}>No cover</Text>
        </View>
      )}
      <Text style={styles.title} numberOfLines={2}>
        {book.title}
      </Text>
      <Text style={styles.author} numberOfLines={1}>
        {book.authors.join(', ')}
      </Text>
      <View style={styles.meta}>
        {book.publishedYear ? (
          <Text style={styles.year}>{book.publishedYear}</Text>
        ) : null}
        {book.averageRating !== null ? (
          <Text style={styles.rating}>★ {book.averageRating}</Text>
        ) : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
        testID="book-card-pressable"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card} testID="book-card">
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 20,
  },
  cover: {
    width: '100%',
    height: CARD_WIDTH * 1.4,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  placeholderCover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#888',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    color: '#333',
  },
  author: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  year: {
    fontSize: 11,
    color: '#888',
  },
  rating: {
    fontSize: 11,
    color: '#f59e0b',
  },
});
