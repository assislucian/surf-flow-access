import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface Reservation {
  id: string;
  duration: string;
  pin_code: string | null;
  payment_status: string;
  created_at: string;
  spaces: {
    name: string;
  } | null;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchReservations();
    }
  }, [user, authLoading, navigate]);

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          id,
          duration,
          pin_code,
          payment_status,
          created_at,
          spaces (
            name
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('dashboard.error'),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const parseDuration = (duration: string) => {
    // Parse PostgreSQL tstzrange format "[2024-01-01 10:00:00+00,2024-01-01 11:00:00+00)"
    const match = duration.match(/\[([^,]+),([^)]+)\)/);
    if (match) {
      return {
        start: new Date(match[1]),
        end: new Date(match[2])
      };
    }
    return null;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <div className="flex gap-4">
            <LanguageSwitcher />
            <Button onClick={() => navigate('/book')} variant="default">
              {t('dashboard.newBooking')}
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              {t('auth.logout')}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.welcome', { email: user?.email })}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.myReservations')}</CardTitle>
            </CardHeader>
            <CardContent>
              {reservations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">{t('dashboard.noReservations')}</p>
                  <Button onClick={() => navigate('/book')}>
                    {t('dashboard.bookNow')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((reservation) => {
                    const duration = parseDuration(reservation.duration);
                    return (
                      <div key={reservation.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{reservation.spaces?.name}</h3>
                            {duration && (
                              <p className="text-sm text-muted-foreground">
                                {format(duration.start, 'PPp')} - {format(duration.end, 'p')}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={
                              reservation.payment_status === 'paid' ? 'default' :
                              reservation.payment_status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {t(`dashboard.status.${reservation.payment_status}`)}
                          </Badge>
                        </div>
                        
                        {reservation.pin_code && (
                          <div className="mt-2">
                            <Separator className="my-2" />
                            <p className="text-sm">
                              <strong>{t('dashboard.pinCode')}:</strong> {reservation.pin_code}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;