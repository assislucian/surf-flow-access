import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { toast } from '@/hooks/use-toast';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: t('auth.error'),
        description: t('auth.passwordMismatch'),
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: t('auth.error'),
        description: error.message,
      });
    } else {
      toast({
        title: t('auth.registerSuccess'),
        description: t('auth.checkEmail'),
      });
      navigate('/login');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t('auth.register')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('auth.registering') : t('auth.register')}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t('auth.hasAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline">
                {t('auth.login')}
              </Link>
            </p>
            <Link to="/" className="text-sm text-primary hover:underline">
              {t('auth.backToHome')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;