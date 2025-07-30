import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            {t('payment.success.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {t('payment.success.message')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('payment.success.emailInfo')}
          </p>
          
          <div className="space-y-2 pt-4">
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              {t('payment.success.viewReservations')}
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              {t('payment.success.backToHome')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;