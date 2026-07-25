import { Villa } from './villa';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface PaymentMethod {
  id: string;
  name: string;
  category: 'bank_transfer' | 'e_wallet' | 'credit_card';
  icon: string;
  accountNumber?: string;
  accountName?: string;
  fee?: number;
}

export interface BookingCustomer {
  fullName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  villaId: string;
  villa: Villa;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  subtotal: number;
  serviceFee: number;
  discount: number;
  totalPrice: number;
  status: BookingStatus;
  paymentMethod?: PaymentMethod;
  customer: BookingCustomer;
  createdAt: string;
}

export type BookingStep = 1 | 2 | 3;
