import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';

interface AuthModalProps {
  mode?: 'login' | 'register';
}

export function AuthModal({ mode = 'login' }: AuthModalProps) {
  const { t } = useTranslation();
  const { login, register } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [authMode, setAuthMode] = useState(mode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('auth_error', 'Authentication Error'),
        description: t('auth_error_desc', 'Please check your credentials and try again'),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t('email', 'Email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('password', 'Password')}</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          <div className="flex justify-between items-center pt-4">
            <Button
              type="button"
              variant="link"
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            >
              {authMode === 'login' 
                ? t('need_account', 'Need an account?')
                : t('have_account', 'Already have an account?')}
            </Button>
            <Button type="submit">
              {authMode === 'login' ? t('login', 'Login') : t('register', 'Register')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
