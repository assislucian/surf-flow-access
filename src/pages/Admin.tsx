import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AdminReservation {
  id: string;
  duration: string;
  pin_code: string | null;
  payment_status: string;
  created_at: string;
  profiles: {
    id: string;
    email: string;
  } | null;
  spaces: {
    name: string;
  } | null;
}

const Admin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      checkAdminStatus();
    }
  }, [user, authLoading, navigate]);

  const checkAdminStatus = async () => {
    try {
      // Check if user has admin role
      const { data: userRoles, error } = await (supabase as any)
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (userRoles) {
        setIsAdmin(true);
        fetchAllReservations();
      } else {
        toast({
          variant: "destructive",
          title: t('admin.accessDenied'),
          description: t('admin.adminOnly'),
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('admin.error'),
        description: error.message,
      });
      navigate('/dashboard');
    }
  };

  const fetchAllReservations = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('reservations')
        .select(`
          id,
          duration,
          pin_code,
          payment_status,
          created_at,
          profiles!inner (
            id,
            email
          ),
          spaces (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('admin.error'),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelReservation = async (reservationId: string) => {
    try {
      const { error } = await supabase.functions.invoke('cancel-reservation', {
        body: { reservationId }
      });

      if (error) throw error;

      toast({
        title: t('admin.reservationCancelled'),
        description: t('admin.reservationCancelledDesc'),
      });

      fetchAllReservations();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('admin.error'),
        description: error.message,
      });
    }
  };

  const parseDuration = (duration: string) => {
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

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
          <div className="flex gap-4">
            <LanguageSwitcher />
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              {t('admin.backToDashboard')}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.allReservations')}</CardTitle>
          </CardHeader>
          <CardContent>
            {reservations.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                {t('admin.noReservations')}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.table.user')}</TableHead>
                    <TableHead>{t('admin.table.space')}</TableHead>
                    <TableHead>{t('admin.table.datetime')}</TableHead>
                    <TableHead>{t('admin.table.pin')}</TableHead>
                    <TableHead>{t('admin.table.status')}</TableHead>
                    <TableHead>{t('admin.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => {
                    const duration = parseDuration(reservation.duration);
                    return (
                      <TableRow key={reservation.id}>
                        <TableCell>{reservation.profiles?.email}</TableCell>
                        <TableCell>{reservation.spaces?.name}</TableCell>
                        <TableCell>
                          {duration && (
                            <div>
                              <div>{format(duration.start, 'PPP')}</div>
                              <div className="text-sm text-muted-foreground">
                                {format(duration.start, 'HH:mm')} - {format(duration.end, 'HH:mm')}
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {reservation.pin_code ? (
                            <code className="bg-muted px-2 py-1 rounded">
                              {reservation.pin_code}
                            </code>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              reservation.payment_status === 'paid' ? 'default' :
                              reservation.payment_status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {t(`dashboard.status.${reservation.payment_status}`)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {reservation.payment_status === 'paid' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => cancelReservation(reservation.id)}
                            >
                              {t('admin.cancel')}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;