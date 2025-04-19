import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { cn } from '../../lib/utils';

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ amount, onSuccess, onCancel }: PaymentFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substr(0, 2) + '/' + numbers.substr(2, 2);
    }
    return numbers;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substr(0, 3);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      errors.push(t('invalid_card_number', 'Invalid card number'));
    }
    
    if (formData.expiryDate.length !== 5) {
      errors.push(t('invalid_expiry_date', 'Invalid expiry date'));
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      
      if (Number(month) > 12 || Number(month) < 1) {
        errors.push(t('invalid_month', 'Invalid month'));
      }
      if (Number(year) < currentYear || 
         (Number(year) === currentYear && Number(month) < currentMonth)) {
        errors.push(t('card_expired', 'Card has expired'));
      }
    }
    
    if (formData.cvv.length !== 3) {
      errors.push(t('invalid_cvv', 'Invalid CVV'));
    }
    
    if (formData.cardholderName.trim().length < 3) {
      errors.push(t('invalid_name', 'Invalid cardholder name'));
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        variant: "destructive",
        title: t('validation_error', 'Validation Error'),
        description: errors.join('. '),
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Імітуємо запит до платіжного API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: t('payment_success', 'Payment Successful'),
        description: t('payment_processed', 'Your payment has been processed successfully'),
      });
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('payment_error', 'Payment Error'),
        description: t('payment_failed', 'Payment failed. Please try again.'),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{t('pay_now', 'Pay Now')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('payment_details', 'Payment Details')}</DialogTitle>
          <DialogDescription>
            {t('amount_to_pay', 'Amount to pay')}: {amount} {t('currency')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">{t('card_number', 'Card Number')}</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              className="font-mono"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">{t('expiry_date', 'Expiry Date')}</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className="font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">{t('cvv', 'CVV')}</Label>
              <Input
                id="cvv"
                name="cvv"
                type="password"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className="font-mono"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardholderName">{t('cardholder_name', 'Cardholder Name')}</Label>
            <Input
              id="cardholderName"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleInputChange}
              placeholder="JOHN DOE"
              className="uppercase"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                onCancel();
              }}
            >
              {t('cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className={cn(
                'min-w-[120px]',
                isProcessing && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('processing', 'Processing')}
                </div>
              ) : (
                t('pay', 'Pay')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
