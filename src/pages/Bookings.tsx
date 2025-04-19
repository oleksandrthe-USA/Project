import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/use-toast';
import { PaymentForm } from '../components/payment/PaymentForm';

interface Booking {
  id: string;
  filmTitle: string;
  date: string;
  time: string;
  seats: number[];
  totalPrice: number;
  paid: boolean;
}

export default function BookingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      filmTitle: 'Inception',
      date: '2025-04-20',
      time: '18:00',
      seats: [5, 6],
      totalPrice: 300,
      paid: false,
    },
    {
      id: '2',
      filmTitle: 'The Matrix',
      date: '2025-04-21',
      time: '20:00',
      seats: [12, 13, 14],
      totalPrice: 450,
      paid: true,
    },
  ]);

  const handlePaymentSuccess = (bookingId: string) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId
          ? { ...booking, paid: true }
          : booking
      )
    );
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">{t('login_required', 'Login Required')}</h1>
        <p>{t('login_to_view_bookings', 'Please login to view your bookings')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">{t('my_bookings', 'My Bookings')}</h1>
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="border rounded-lg p-6 bg-card shadow-sm animate-in slide-in-from-bottom duration-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{booking.filmTitle}</h2>
                <p className="text-muted-foreground">
                  {t('date_time', 'Date & Time')}: {booking.date} {booking.time}
                </p>
                <p className="text-muted-foreground">
                  {t('seats', 'Seats')}: {booking.seats.join(', ')}
                </p>
                <p className="mt-2 font-medium">
                  {t('total_price', 'Total Price')}: {booking.totalPrice} {t('currency')}
                </p>
              </div>
              <div>
                {booking.paid ? (
                  <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    {t('paid', 'Paid')}
                  </span>
                ) : (
                  <PaymentForm
                    amount={booking.totalPrice}
                    onSuccess={() => handlePaymentSuccess(booking.id)}
                    onCancel={() => {}}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {t('no_bookings', 'You have no bookings yet')}
          </div>
        )}
      </div>
    </div>
  );
}
