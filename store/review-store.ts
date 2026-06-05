import { create } from 'zustand';

interface Review {
  id: string; // tiene que ser la id real del negocio
  name: string;
  stars: number;
}

interface ReviewsStore {
  reviews: Review[];
  addReview: (reviews: Review) => void;
  removeReview: (id: string) => void;
  clearReviews: () => void;
}

export const useReviewsStore = create<ReviewsStore>((set, get) => ({
  reviews: [
    {
      id : '1',
      name: 'ayuda',
      stars: 5
    }
  ],

  addReview: (reviews) =>
    set((state) => ({
      reviews: state.reviews.some((b) => b.id === reviews.id)
        ? state.reviews
        : [...state.reviews, reviews],
    })),

  removeReview: (id) =>
    set((state) => ({
      reviews: state.reviews.filter((b) => b.id !== id),
    })),

  clearReviews: () => set({ reviews: [] }),

  isFavorite: (id: string) => get().reviews.some((b) => b.id === id),
}));