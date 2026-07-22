-- Seed real fee structures for DolaPay

-- PAWAPAY PAY-IN
INSERT INTO public.fee_structures (provider, gateway, transaction_type, operator_fee_percentage, gateway_fee_percentage, dola_margin_percentage, fixed_fee) VALUES
('orange', 'pawapay', 'pay-in', 0.0150, 0.0050, 0.0100, 0),
('mtn', 'pawapay', 'pay-in', 0.0150, 0.0050, 0.0100, 0),
('moov', 'pawapay', 'pay-in', 0.0120, 0.0050, 0.0100, 0),
('airtel', 'pawapay', 'pay-in', 0.0150, 0.0050, 0.0100, 0),
('vodacom', 'pawapay', 'pay-in', 0.0150, 0.0050, 0.0100, 0),
('safaricom', 'pawapay', 'pay-in', 0.0100, 0.0050, 0.0100, 0),
('free', 'pawapay', 'pay-in', 0.0100, 0.0050, 0.0100, 0),
('zamtel', 'pawapay', 'pay-in', 0.0120, 0.0050, 0.0100, 0)
ON CONFLICT (provider, gateway, transaction_type) DO UPDATE SET 
  operator_fee_percentage = EXCLUDED.operator_fee_percentage,
  gateway_fee_percentage = EXCLUDED.gateway_fee_percentage,
  dola_margin_percentage = EXCLUDED.dola_margin_percentage;

-- LIGDICASH PAY-IN
INSERT INTO public.fee_structures (provider, gateway, transaction_type, operator_fee_percentage, gateway_fee_percentage, dola_margin_percentage, fixed_fee) VALUES
('orange', 'ligdicash', 'pay-in', 0.0150, 0.0050, 0.0100, 0),
('moov', 'ligdicash', 'pay-in', 0.0150, 0.0050, 0.0100, 0),
('card', 'ligdicash', 'pay-in', 0.0200, 0.0050, 0.0150, 0)
ON CONFLICT (provider, gateway, transaction_type) DO UPDATE SET 
  operator_fee_percentage = EXCLUDED.operator_fee_percentage,
  gateway_fee_percentage = EXCLUDED.gateway_fee_percentage,
  dola_margin_percentage = EXCLUDED.dola_margin_percentage;

-- PAWAPAY PAY-OUT
INSERT INTO public.fee_structures (provider, gateway, transaction_type, operator_fee_percentage, gateway_fee_percentage, dola_margin_percentage, fixed_fee) VALUES
('orange', 'pawapay', 'pay-out', 0.0000, 0.0000, 0.0000, 500),
('mtn', 'pawapay', 'pay-out', 0.0000, 0.0000, 0.0000, 500),
('moov', 'pawapay', 'pay-out', 0.0000, 0.0000, 0.0000, 500),
('airtel', 'pawapay', 'pay-out', 0.0000, 0.0000, 0.0000, 500)
ON CONFLICT (provider, gateway, transaction_type) DO UPDATE SET 
  operator_fee_percentage = EXCLUDED.operator_fee_percentage,
  gateway_fee_percentage = EXCLUDED.gateway_fee_percentage,
  dola_margin_percentage = EXCLUDED.dola_margin_percentage,
  fixed_fee = EXCLUDED.fixed_fee;
