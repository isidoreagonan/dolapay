-- Script de génération automatique des frais opérateurs
-- Marge PawaPay = 1% (0.01)
-- Marge DolaPay = 1% (0.01)

-- Nettoyage optionnel avant insertion (à décommenter si vous voulez réinitialiser)
-- DELETE FROM fee_structures;

INSERT INTO fee_structures (provider, gateway, transaction_type, operator_fee_percentage, gateway_fee_percentage, dola_margin_percentage, fixed_fee, created_at, updated_at)
VALUES
('mtn', 'pawapay', 'pay-in', 0.0120, 0.01, 0.01, 0, NOW(), NOW()), -- Benin / mtn
('mtn', 'pawapay', 'pay-out', 0.0050, 0.01, 0.01, 0, NOW(), NOW()), -- Benin / mtn
('moov', 'pawapay', 'pay-in', 0.0120, 0.01, 0.01, 0, NOW(), NOW()), -- Benin / moov
('moov', 'pawapay', 'pay-out', 0.0000, 0.01, 0.01, 0, NOW(), NOW()), -- Benin / moov
('orange', 'pawapay', 'pay-in', 0.0230, 0.01, 0.01, 0, NOW(), NOW()), -- Burkina Faso / orange
('orange', 'pawapay', 'pay-out', 0.0000, 0.01, 0.01, 0, NOW(), NOW()), -- Burkina Faso / orange
('airtel', 'pawapay', 'pay-in', 0.0300, 0.01, 0.01, 0, NOW(), NOW()), -- Congo-Brazzaville / airtel
('airtel', 'pawapay', 'pay-out', 0.0000, 0.01, 0.01, 0, NOW(), NOW()), -- Congo-Brazzaville / airtel
('vodacom', 'pawapay', 'pay-in', 0.0150, 0.01, 0.01, 0, NOW(), NOW()), -- DRC / vodacom
('vodacom', 'pawapay', 'pay-out', 0.0100, 0.01, 0.01, 0, NOW(), NOW()), -- DRC / vodacom
('mpesa', 'pawapay', 'pay-in', 0.0050, 0.01, 0.01, 0, NOW(), NOW()), -- Ethiopia / safaricom mpesa
('mpesa', 'pawapay', 'pay-out', 0.0050, 0.01, 0.01, 0, NOW(), NOW()), -- Ethiopia / safaricom mpesa
('ethio', 'pawapay', 'pay-in', 0.0150, 0.01, 0.01, 0, NOW(), NOW()), -- Ethiopia / ethio telecom
('ethio', 'pawapay', 'pay-out', 0.0150, 0.01, 0.01, 0, NOW(), NOW()), -- Ethiopia / ethio telecom
('at', 'pawapay', 'pay-in', 0.0100, 0.01, 0.01, 0, NOW(), NOW()), -- Ghana / at
('at', 'pawapay', 'pay-out', 0.0000, 0.01, 0.01, 0, NOW(), NOW()), -- Ghana / at
('telecel', 'pawapay', 'pay-in', 0.0100, 0.01, 0.01, 0, NOW(), NOW()), -- Ghana / telecel
('telecel', 'pawapay', 'pay-out', 0.0000, 0.01, 0.01, 0, NOW(), NOW()), -- Ghana / telecel
('wave', 'pawapay', 'pay-in', 0.0100, 0.01, 0.01, 0, NOW(), NOW()), -- Ivory Coast / wave
('wave', 'pawapay', 'pay-out', 0.0100, 0.01, 0.01, 0, NOW(), NOW()), -- Ivory Coast / wave
('tnm', 'pawapay', 'pay-in', 0.0233, 0.01, 0.01, 0, NOW(), NOW()), -- Malawi / tnm
('tnm', 'pawapay', 'pay-out', 0.0175, 0.01, 0.01, 0, NOW(), NOW()), -- Malawi / tnm
('yas', 'pawapay', 'pay-in', 0.0100, 0.01, 0.01, 0, NOW(), NOW()), -- Senegal / yas
('yas', 'pawapay', 'pay-out', 0.0050, 0.01, 0.01, 0, NOW(), NOW()), -- Senegal / yas
('halopesa', 'pawapay', 'pay-in', 0.0100, 0.01, 0.01, 0, NOW(), NOW()), -- Tanzania / halotel
('halopesa', 'pawapay', 'pay-out', 0.0000, 0.01, 0.01, 0, NOW(), NOW()), -- Tanzania / halotel
('zamtel', 'pawapay', 'pay-in', 0.0000, 0.01, 0.01, 0, NOW(), NOW()), -- Zambia / zamtel
('zamtel', 'pawapay', 'pay-out', 0.0100, 0.01, 0.01, 0, NOW(), NOW()) -- Zambia / zamtel
ON CONFLICT (provider, gateway, transaction_type)
DO UPDATE SET operator_fee_percentage = EXCLUDED.operator_fee_percentage, updated_at = NOW();
