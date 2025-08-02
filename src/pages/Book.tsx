import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PremiumCard, PremiumCardHeader, PremiumCardTitle, PremiumCardContent } from '@/components/ui/premium-card';
import { PremiumCalendar } from '@/components/ui/premium-calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { toast } from '@/hooks/use-toast';
import { format, addHours, setHours, setMinutes, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

const Book = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots();
      generateAvailableSlots();
    }
  }, [selectedDate]);

  const fetchBookedSlots = async () => {
    if (!selectedDate) return;

    try {
      const dayStart = startOfDay(selectedDate).toISOString();
      const dayEnd = endOfDay(selectedDate).toISOString();

      const { data, error } = await (supabase as any)
        .from('reservations')
        .select('duration')
        .gte('duration', `[${dayStart},`)
        .lt('duration', `[${dayEnd},`)
        .eq('status', 'paid');

      if (error) throw error;

      const booked = data?.map((reservation: any) => {
        // Parse duration range
        const match = reservation.duration.match(/\[([^,]+),([^)]+)\)/);
        if (match) {
          const start = new Date(match[1]);
          const end = new Date(match[2]);
          return format(start, 'HH:mm');
        }
        return null;
      }).filter(Boolean) || [];

      setBookedSlots(booked);
    } catch (error: any) {
      console.error('Error fetching booked slots:', error);
    }
  };

  const generateAvailableSlots = () => {
    const slots: string[] = [];
    const startHour = 9; // 9 AM
    const endHour = 21; // 9 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(format(setMinutes(setHours(new Date(), hour), 0), 'HH:mm'));
    }
    
    setAvailableSlots(slots);
  };

  const isSlotAvailable = (time: string) => {
    if (!selectedDate) return false;
    
    const slotStart = new Date(selectedDate);
    const [hours, minutes] = time.split(':').map(Number);
    slotStart.setHours(hours, minutes, 0, 0);
    
    const slotEnd = addHours(slotStart, duration);
    
    // Check if any part of this duration conflicts with booked slots
    for (let i = 0; i < duration; i++) {
      const checkTime = format(addHours(slotStart, i), 'HH:mm');
      if (bookedSlots.includes(checkTime)) {
        return false;
      }
    }
    
    // Don't allow booking in the past
    if (isBefore(slotStart, new Date())) {
      return false;
    }
    
    return true;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !user) return;

    setLoading(true);

    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const startTime = new Date(selectedDate);
      startTime.setHours(hours, minutes, 0, 0);
      const endTime = addHours(startTime, duration);

      // Create payment session
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-payment', {
        body: {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration,
          amount: duration * 25 * 100, // 25€ per hour in cents
        }
      });

      if (paymentError) throw paymentError;

      if (paymentData?.url) {
        // Open Stripe checkout in a new tab
        window.open(paymentData.url, '_blank');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('booking.error'),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t('common.loading')}</div>
      </div>
    );
  }

  const price = duration * 25; // 25€ per hour

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-primary/15 to-transparent rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-2">
              {t('booking.title')}
            </h1>
            <p className="text-muted-foreground text-lg">{t('booking.subtitle', 'Reserve sua sessão de surf skate')}</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <LanguageSwitcher />
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="outline" 
              className="border-border/50 hover:bg-muted/50"
            >
              {t('booking.backToDashboard')}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <PremiumCard className="border-primary/20">
            <PremiumCardHeader>
              <PremiumCardTitle>{t('booking.selectDateTime')}</PremiumCardTitle>
            </PremiumCardHeader>
            <PremiumCardContent className="space-y-8">
              <div>
                <label className="text-lg font-semibold mb-4 block">{t('booking.selectDate')}</label>
                <PremiumCalendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => isBefore(date, startOfDay(new Date()))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-lg font-semibold mb-4 block">{t('booking.duration')}</label>
                <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                  <SelectTrigger className="h-12 bg-background/50 border-border/30 hover:border-primary/50 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t('booking.duration1h')}</SelectItem>
                    <SelectItem value="2">{t('booking.duration2h')}</SelectItem>
                    <SelectItem value="3">{t('booking.duration3h')}</SelectItem>
                    <SelectItem value="4">{t('booking.duration4h')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-lg font-semibold mb-4 block">{t('booking.selectTime')}</label>
                <div className="grid grid-cols-3 gap-3">
                  {availableSlots.map(time => {
                    const available = isSlotAvailable(time);
                    return (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className={`h-12 transition-all duration-200 ${
                          selectedTime === time 
                            ? 'bg-gradient-to-r from-primary to-primary/80 shadow-lg' 
                            : available 
                              ? 'hover:bg-primary/10 hover:border-primary/50' 
                              : 'opacity-50'
                        }`}
                        disabled={!available}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </PremiumCardContent>
          </PremiumCard>

          <PremiumCard className="border-primary/20 bg-gradient-to-br from-card/80 to-card/60">
            <PremiumCardHeader>
              <PremiumCardTitle>{t('booking.summary')}</PremiumCardTitle>
            </PremiumCardHeader>
            <PremiumCardContent className="space-y-6">
              {selectedDate && selectedTime ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <span className="font-medium text-muted-foreground">{t('booking.space')}:</span>
                      <span className="font-semibold">Surfskatehalle</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <span className="font-medium text-muted-foreground">{t('booking.date')}:</span>
                      <span className="font-semibold">{format(selectedDate, 'PPP')}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <span className="font-medium text-muted-foreground">{t('booking.time')}:</span>
                      <span className="font-semibold">{selectedTime}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <span className="font-medium text-muted-foreground">{t('booking.duration')}:</span>
                      <span className="font-semibold">{duration} {duration === 1 ? t('booking.hour') : t('booking.hours')}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-border/20 pt-6">
                    <div className="flex items-center justify-between text-xl font-bold bg-gradient-to-r from-primary/20 to-primary/10 p-4 rounded-xl">
                      <span>{t('booking.total')}:</span>
                      <span className="text-primary">{price}€</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleBooking} 
                    className="w-full h-14 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300" 
                    disabled={!selectedTime || loading}
                  >
                    {loading ? t('booking.processing') : t('booking.proceedToPayment')}
                  </Button>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">{t('booking.selectDateTimeFirst')}</p>
                </div>
              )}
            </PremiumCardContent>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
};

export default Book;