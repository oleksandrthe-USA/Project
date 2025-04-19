export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  sessionId: string;
  seats: number[];
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Session {
  id: string;
  filmId: string;
  date: string;
  time: string;
  price: number;
  availableSeats: number[];
  totalSeats: number;
}
