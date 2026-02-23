import { Book } from '../types';

const BASE = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_BOOKS_API_KEY;

function toBook(item: any): Book {
  const v = item.volumeInfo || {};
  const year = (v.publishedDate || '').slice(0, 4);
  const isbn = v.industryIdentifiers?.find(
    (i: any) => i.type === 'ISBN_13' || i.type === 'ISBN_10'
  )?.identifier;
  return {
    id: item.id,
    title: v.title || 'Unknown Title',
    authors: v.authors || ['Unknown Author'],
    publishedYear: year,
    thumbnail: v.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
    averageRating: v.averageRating ?? null,
    ratingsCount: v.ratingsCount,
    description: v.description,
    isbn,
  };
}

export async function getBookById(id: string): Promise<Book | null> {
  try {
    const link = `${BASE}/${id}${API_KEY ? '?key=' + API_KEY : ''}`;
    const res = await fetch(link);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.volumeInfo) return null;
    return toBook(data);
  } catch {
    return null;
  }
}

export async function searchBooks(query: string): Promise<Book[]> {
  if (!query.trim()) return [];
  try {
    const link = `${BASE}?q=${encodeURIComponent(query)}&maxResults=20${API_KEY ? '&key=' + API_KEY : ''}`;
    const res = await fetch(link);
    if (!res.ok) throw new Error('Could not load books. Try again.');
    const data = await res.json();
    if (!data.items?.length) return [];
    return data.items.map(toBook);
  } catch (e) {
    throw e instanceof Error ? e : new Error('Something went wrong.');
  }
}
