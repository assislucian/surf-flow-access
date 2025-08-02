import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PremiumCard, PremiumCardHeader, PremiumCardTitle, PremiumCardContent } from '@/components/ui/premium-card';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface Reservation {
  id: string;
  duration: string;
  ref_code: string | null;
  status: string;
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
      const { data, error } = await (supabase as any)
        .from('reservations')
        .select(`
          id,
          duration,
          ref_code,
          status,
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-primary/15 to-transparent rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
              {t('dashboard.title')}
            </h1>
            <p className="text-muted-foreground text-lg">{t('dashboard.subtitle', 'Gerencie suas sessões de surf skate')}</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <LanguageSwitcher />
            <Button 
              onClick={() => navigate('/book')} 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {t('dashboard.newBooking')}
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="border-border/50 hover:bg-muted/50">
              {t('auth.logout')}
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <PremiumCard className="border-primary/20 bg-gradient-to-r from-card/80 to-card/60">
            <PremiumCardHeader>
              <PremiumCardTitle className="text-2xl">{t('dashboard.welcome', { email: user?.email })}</PremiumCardTitle>
            </PremiumCardHeader>
          </PremiumCard>

          <PremiumCard className="border-primary/20">
            <PremiumCardHeader>
              <PremiumCardTitle>{t('dashboard.myReservations')}</PremiumCardTitle>
            </PremiumCardHeader>
            <PremiumCardContent>
              {reservations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">{t('dashboard.noReservations')}</p>
                  <Button onClick={() => navigate('/book')}>
                    {t('dashboard.bookNow')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {reservations.map((reservation) => {
                    const duration = parseDuration(reservation.duration);
                    return (
                      <div key={reservation.id} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative border border-border/30 rounded-xl p-6 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                          <div className="flex justify-between items-start mb-4">
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold text-foreground">{reservation.spaces?.name || 'Surfskatehalle'}</h3>
                              {duration && (
                                <p className="text-muted-foreground">
                                  {format(duration.start, 'PPp')} - {format(duration.end, 'p')}
                                </p>
                              )}
                            </div>
                            <Badge
                              className={`px-3 py-1 ${
                                reservation.status === 'paid' 
                                  ? 'bg-gradient-to-r from-green-500 to-green-400 text-white' :
                                reservation.status === 'pending' 
                                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white' : 
                                  'bg-gradient-to-r from-red-500 to-red-400 text-white'
                              }`}
                            >
                              {t(`dashboard.status.${reservation.status}`)}
                            </Badge>
                          </div>
                          
                          {reservation.ref_code && (
                            <div className="mt-4 pt-4 border-t border-border/20">
                              <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                                <span className="text-sm font-medium text-muted-foreground">
                                  {t('dashboard.referenceCode')}:
                                </span>
                                <span className="font-mono text-sm bg-primary/10 px-2 py-1 rounded border">
                                  {reservation.ref_code}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </PremiumCardContent>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;