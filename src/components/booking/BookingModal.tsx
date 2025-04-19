import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { RequireAuth } from '../auth/RequireAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useToast } from '../ui/use-toast';
import { Session } from '../../types';

interface BookingModalProps {
  session: Session;
  filmTitle: string;
}

export function BookingModal({ session, filmTitle }: BookingModalProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const handleSeatClick = (seatNumber: number) => {
    setSelectedSeats(prev => 
      prev.includes(seatNumber)
        ? prev.filter(seat => seat !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleBooking = async () => {
    if (!selectedSeats.length) {
      toast({
        variant: "destructive",
        title: t('booking_error', 'Booking Error'),
        description: t('select_seats', 'Please select at least one seat'),
      });
      return;
    }

    try {
      // В реальному проекті тут був би запит до API
      toast({
        title: t('booking_success', 'Booking Successful'),
        description: t('booking_confirmed', 'Your booking has been confirmed'),
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('booking_error', 'Booking Error'),
        description: t('booking_failed', 'Failed to book tickets. Please try again.'),
      });
    }
  };

  return (
    <RequireAuth>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>{t('book_tickets', 'Book Tickets')}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('book_tickets_for', 'Book Tickets for')} {filmTitle}</DialogTitle>
            <DialogDescription>
              {t('session_info', 'Session')}: {session.date} {session.time}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-center mb-4">
              <div className="w-1/2 h-2 bg-gray-300 mx-auto mb-4" />
              <p className="text-sm text-gray-500">{t('screen', 'Screen')}</p>
            </div>
            <div className="grid grid-cols-8 gap-2 max-w-[400px] mx-auto">
              {Array.from({ length: session.totalSeats }, (_, i) => i + 1).map((seat) => (
                <Button
                  key={seat}
                  variant={selectedSeats.includes(seat) ? "default" : "outline"}
                  className={`w-8 h-8 p-0 ${!session.availableSeats.includes(seat) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => session.availableSeats.includes(seat) && handleSeatClick(seat)}
                  disabled={!session.availableSeats.includes(seat)}
                >
                  {seat}
                </Button>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span>{t('selected_seats', 'Selected Seats')}:</span>
                <span>{selectedSeats.join(', ') || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t('total_price', 'Total Price')}:</span>
                <span>{(selectedSeats.length * session.price).toFixed(2)} {t('currency')}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleBooking}
              disabled={!selectedSeats.length}
            >
              {t('confirm_booking', 'Confirm Booking')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </RequireAuth>
  );
}
