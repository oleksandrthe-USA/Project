import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useToast } from '../ui/use-toast';

interface AuthModalProps {
  mode?: 'login' | 'register';
}

export function AuthModal({ mode = 'login' }: AuthModalProps) {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState(mode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    name: '',
  });

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      name: '',
    };
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = t('invalid_email', 'Please enter a valid email address');
      isValid = false;
    }

    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = t('password_too_short', 'Password must be at least 6 characters long');
      isValid = false;
    }

    // Name validation (only for registration)
    if (authMode === 'register' && formData.name.length < 2) {
      newErrors.name = t('name_too_short', 'Name must be at least 2 characters long');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      name: '',
    });
    setErrors({
      email: '',
      password: '',
      name: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === 'login') {
        await login(formData.email, formData.password);
        toast({
          title: t('login_success', 'Login successful'),
          description: t('welcome_back', 'Welcome back!'),
        });
      } else {
        await register(formData.email, formData.password, formData.name);
        toast({
          title: t('register_success', 'Registration successful'),
          description: t('account_created', 'Your account has been created'),
        });
      }
      resetForm();
      setIsOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('auth_error', 'Authentication Error'),
        description: error.message || t('auth_error_desc', 'Please check your credentials and try again'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {authMode === 'login' ? t('login', 'Login') : t('register', 'Register')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {authMode === 'login' ? t('login', 'Login') : t('register', 'Register')}
          </DialogTitle>
          <DialogDescription>
            {authMode === 'login' 
              ? t('login_desc', 'Enter your credentials to access your account')
              : t('register_desc', 'Create a new account to start booking tickets')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">{t('name', 'Name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                required
                error={errors.name}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t('email', 'Email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              required
              error={errors.email}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password', 'Password')}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, password: e.target.value }));
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              }}
              required
              error={errors.password}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>
          <div className="flex justify-between items-center pt-4">
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                resetForm();
              }}
              disabled={isLoading}
            >
              {authMode === 'login' 
                ? t('need_account', 'Need an account?')
                : t('have_account', 'Already have an account?')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('processing', 'Processing...')}
                </div>
              ) : (
                authMode === 'login' ? t('login', 'Login') : t('register', 'Register')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
