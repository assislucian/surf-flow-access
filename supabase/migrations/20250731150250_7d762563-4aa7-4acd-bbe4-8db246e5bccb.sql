-- Fix security definer functions by setting search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_ref_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  code TEXT;
BEGIN
  code := upper(substring(encode(gen_random_bytes(3), 'hex') from 1 for 6));
  RETURN code;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_reservation_ref_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NEW.ref_code IS NULL THEN
    NEW.ref_code := public.generate_ref_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_reservation(reservation_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Check if user owns the reservation or is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.reservations r
    LEFT JOIN public.users u ON u.id = auth.uid()
    WHERE r.id = reservation_id 
    AND (r.user_id = auth.uid() OR u.role = 'admin')
  ) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  -- Update reservation status
  UPDATE public.reservations 
  SET status = 'cancelled', updated_at = now()
  WHERE id = reservation_id;

  -- Insert cancelled payment record if doesn't exist
  INSERT INTO public.payments (reservation_id, amount, status)
  SELECT reservation_id, 0, 'cancelled'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.payments 
    WHERE payments.reservation_id = cancel_reservation.reservation_id
  );
END;
$$;