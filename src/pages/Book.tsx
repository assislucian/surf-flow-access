import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
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
        .eq('payment_status', 'paid');

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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{t('booking.title')}</h1>
          <div className="flex gap-4">
            <LanguageSwitcher />
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              {t('booking.backToDashboard')}
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('booking.selectDateTime')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">{t('booking.selectDate')}</label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => isBefore(date, startOfDay(new Date()))}
                  className="rounded-md border"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{t('booking.duration')}</label>
                <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                  <SelectTrigger>
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
                <label className="text-sm font-medium mb-2 block">{t('booking.selectTime')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map(time => {
                    const available = isSlotAvailable(time);
                    return (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className="w-full"
                        disabled={!available}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('booking.summary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDate && selectedTime ? (
                <>
                  <div>
                    <strong>{t('booking.space')}:</strong> Surfskatehalle
                  </div>
                  <div>
                    <strong>{t('booking.date')}:</strong> {format(selectedDate, 'PPP')}
                  </div>
                  <div>
                    <strong>{t('booking.time')}:</strong> {selectedTime}
                  </div>
                  <div>
                    <strong>{t('booking.duration')}:</strong> {duration} {duration === 1 ? t('booking.hour') : t('booking.hours')}
                  </div>
                  <div className="text-lg font-semibold">
                    <strong>{t('booking.total')}:</strong> {price}€
                  </div>
                  
                  <Button 
                    onClick={handleBooking} 
                    className="w-full" 
                    disabled={!selectedTime || loading}
                  >
                    {loading ? t('booking.processing') : t('booking.proceedToPayment')}
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground">{t('booking.selectDateTimeFirst')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Book;