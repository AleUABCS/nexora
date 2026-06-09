import { create } from 'zustand';

// 1. Actualizamos la interfaz con los campos que tu UI realmente necesita
interface Review {
  id: string;          // ID único de esta reseña específica (ej. 'rev-123')
  businessId: string;  // ID del negocio al que le hicieron la reseña (ej. 'biz-456')
  username: string;    // Nombre del usuario que comenta
  description: string; // El texto de la reseña
  stars: number;       // Calificación de 1 a 5
}

interface ReviewsStore {
  reviews: Review[];
  addReview: (review: Review) => void; // Cambié 'reviews' a 'review' (singular) por claridad
  removeReview: (id: string) => void;
  clearReviews: () => void;
}

export const useReviewsStore = create<ReviewsStore>((set, get) => ({
  // 2. Estado inicial con datos de prueba estructurados correctamente
  reviews: [
    {
      id: '1',
      businessId: 'negocio-123', // Este es el que usarás para filtrar en la FlatList
      username: 'Juan Pérez',
      description: '¡Excelente servicio, me ayudó mucho!',
      stars: 5
    }
  ],

  // 3. Agregar reseña verificando el ID de la reseña, no del negocio
  addReview: (newReview) =>
    set((state) => ({
      reviews: state.reviews.some((r) => r.id === newReview.id)
        ? state.reviews // Si la reseña ya existe (por error de red, etc.), no hace nada
        : [...state.reviews, newReview], // Si no existe, la agrega a la lista
    })),

  // 4. Eliminar reseña por el ID de la reseña
  removeReview: (id) =>
    set((state) => ({
      reviews: state.reviews.filter((r) => r.id !== id),
    })),

  clearReviews: () => set({ reviews: [] }),
}));