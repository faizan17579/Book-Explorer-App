import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { getBookById } from '../services/bookService';
import { getBookBestsellerStatus } from '../services/nytService';
import { Book, BestsellerInfo } from '../types';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function renderStars(rating: number) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<Text key={i} style={styles.star}>★</Text>);
    } else if (i === fullStars && hasHalf) {
      stars.push(<Text key={i} style={styles.starHalf}>★</Text>);
    } else {
      stars.push(<Text key={i} style={styles.starEmpty}>☆</Text>);
    }
  }
  return stars;
}

export function BookDetailScreen({
  route,
  navigation,
}: {
  route: { params: { book: Book } };
  navigation: { goBack: () => void };
}) {
  const initialBook = route.params.book;
  const [book, setBook] = useState<Book>(initialBook);
  const [bestseller, setBestseller] = useState<BestsellerInfo | null>(null);

  useEffect(() => {
    getBookById(initialBook.id).then((data) => {
      if (data) setBook(data);
    });
  }, [initialBook.id]);

  useEffect(() => {
    getBookBestsellerStatus(initialBook).then(setBestseller);
  }, [initialBook.id]);

  const authorName = book.authors.join(', ');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.coverWrap}>
        {book.thumbnail ? (
          <Image
            source={{ uri: book.thumbnail.replace('zoom=1', 'zoom=2') }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cover, styles.placeholderCover]}>
            <Text style={styles.placeholderText}>No cover</Text>
          </View>
        )}
      </View>

      <Text
        style={[
          styles.title,
          book.title.length <= 25 && styles.titleCenter,
        ]}
      >
        {book.title}
      </Text>
      <Text
        style={[
          styles.author,
          book.title.length <= 25 && styles.authorCenter,
        ]}
      >
        {authorName}
      </Text>
      {book.publishedYear ? (
        <Text
          style={[
            styles.meta,
            book.title.length <= 25 && styles.metaCenter,
          ]}
        >
          Published in {book.publishedYear}
        </Text>
      ) : null}
      <View style={styles.ratingSection}>
        <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
        {book.averageRating != null && (book.ratingsCount ?? 0) > 0 ? (
          <View style={styles.ratingRow}>
            <View style={styles.stars}>{renderStars(book.averageRating)}</View>
            <Text style={styles.reviewCount}>
              {book.averageRating.toFixed(1)} ({book.ratingsCount} {book.ratingsCount === 1 ? 'review' : 'reviews'})
            </Text>
          </View>
        ) : (
          <Text style={styles.noRatings}>No ratings yet</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>About the author</Text>
      <Text style={styles.sectionText}>
        {authorName} is the author of {book.title}.
      </Text>

      <Text style={styles.sectionTitle}>Overview</Text>
      <Text style={styles.sectionText}>
        {book.description ? stripHtml(book.description) : 'No description available.'}
      </Text>

      {bestseller && (
        <View style={styles.bestsellerBadge}>
          <Text style={styles.bestsellerTitle}>NYTimes Bestseller</Text>
          <Text style={styles.bestsellerDetail}>
            #{bestseller.rank} on {bestseller.listName}
          </Text>
          {bestseller.weeksOnList > 0 ? (
            <Text style={styles.bestsellerWeeks}>
              {bestseller.weeksOnList} weeks on list
            </Text>
          ) : null}
        </View>
      )}

      <TouchableOpacity style={styles.bookReadBtn} activeOpacity={0.8}>
        <Text style={styles.bookReadIcon}>✓</Text>
        <Text style={styles.bookReadText}>Book Read</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  coverWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cover: {
    width: 180,
    height: 270,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  placeholderCover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#888',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  titleCenter: {
    textAlign: 'center',
  },
  author: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  authorCenter: {
    textAlign: 'center',
  },
  meta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  metaCenter: {
    textAlign: 'center',
  },
  ratingSection: {
    marginBottom: 24,
  },
  noRatings: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 18,
    color: '#f59e0b',
  },
  starHalf: {
    fontSize: 18,
    color: '#f59e0b',
    opacity: 0.7,
  },
  starEmpty: {
    fontSize: 18,
    color: '#d1d5db',
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  bestsellerBadge: {
    backgroundColor: '#e8f5e9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  bestsellerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 4,
  },
  bestsellerDetail: {
    fontSize: 13,
    color: '#2e7d32',
    marginBottom: 2,
  },
  bestsellerWeeks: {
    fontSize: 12,
    color: '#558b2f',
  },
  bookReadBtn: {
    flexDirection: 'row',
    backgroundColor: '#2dd4bf',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  bookReadIcon: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  bookReadText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
