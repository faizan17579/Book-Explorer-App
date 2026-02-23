import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { BookCard } from '../BookCard';
import { Book } from '../../types';

const mockBook: Book = {
  id: '1',
  title: 'Test Book',
  authors: ['Author One', 'Author Two'],
  publishedYear: '2020',
  thumbnail: 'https://example.com/cover.jpg',
  averageRating: 4.5,
  ratingsCount: 50,
};

describe('BookCard', () => {
  it('renders book title', () => {
    const { getByText } = render(<BookCard book={mockBook} />);
    expect(getByText('Test Book')).toBeTruthy();
  });

  it('renders author names', () => {
    const { getByText } = render(<BookCard book={mockBook} />);
    expect(getByText('Author One, Author Two')).toBeTruthy();
  });

  it('renders published year', () => {
    const { getByText } = render(<BookCard book={mockBook} />);
    expect(getByText('2020')).toBeTruthy();
  });

  it('renders rating when present', () => {
    const { getByText } = render(<BookCard book={mockBook} />);
    expect(getByText(/4.5/)).toBeTruthy();
  });

  it('renders placeholder when no thumbnail', () => {
    const bookNoCover = { ...mockBook, thumbnail: null };
    const { getByText } = render(<BookCard book={bookNoCover} />);
    expect(getByText('No cover')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <BookCard book={mockBook} onPress={onPress} />
    );
    fireEvent.press(getByTestId('book-card-pressable'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('handles single author', () => {
    const singleAuthor = { ...mockBook, authors: ['Solo Author'] };
    const { getByText } = render(<BookCard book={singleAuthor} />);
    expect(getByText('Solo Author')).toBeTruthy();
  });

  it('handles missing rating', () => {
    const noRating = { ...mockBook, averageRating: null, ratingsCount: undefined };
    const { queryByText } = render(<BookCard book={noRating} />);
    expect(queryByText(/★/)).toBeNull();
  });
});
