'use client';

import React from 'react';
import { PaymentMethod } from '@/types/booking';
import { Building2, Wallet, CreditCard, CheckCircle2 } from 'lucide-react';

interface PaymentMethodListProps {
  selectedMethod: string;
  onSelectMethod: (method: PaymentMethod) => void;
}

export const PAYMENT_OPTIONS: PaymentMethod[] = [
  {
    id: 'bca',
    name: 'BCA Virtual Account / Transfer',
    category: 'bank_transfer',
    icon: 'Building2',
    accountNumber: '8830192831',
    accountName: 'PT BALIVIO INDONESIA SEJAHTERA',
  },
  {
    id: 'mandiri',
    name: 'Mandiri Virtual Account',
    category: 'bank_transfer',
    icon: 'Building2',
    accountNumber: '137001928310',
    accountName: 'PT BALIVIO INDONESIA SEJAHTERA',
  },
  {
    id: 'gopay',
    name: 'GoPay / QRIS Instant Pay',
    category: 'e_wallet',
    icon: 'Wallet',
  },
  {
    id: 'ovo',
    name: 'OVO / ShopeePay',
    category: 'e_wallet',
    icon: 'Wallet',
  },
  {
    id: 'credit_card',
    name: 'Kartu Kredit / Debit (Visa/Mastercard)',
    category: 'credit_card',
    icon: 'CreditCard',
  },
];

export function PaymentMethodList({ selectedMethod, onSelectMethod }: PaymentMethodListProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case 'bank_transfer':
        return <Building2 className="w-5 h-5 text-[#0D5C54]" />;
      case 'e_wallet':
        return <Wallet className="w-5 h-5 text-emerald-600" />;
      default:
        return <CreditCard className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-900 text-lg">Pilih Metode Pembayaran</h3>
      <div className="space-y-3">
        {PAYMENT_OPTIONS.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <div
              key={method.id}
              onClick={() => onSelectMethod(method)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                isSelected
                  ? 'border-[#0D5C54] bg-emerald-50/60 shadow-sm ring-2 ring-[#0D5C54]/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
                  {getIcon(method.category)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{method.name}</h4>
                  <span className="text-xs text-slate-500 capitalize">
                    {method.category.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {isSelected && <CheckCircle2 className="w-5 h-5 text-[#0D5C54]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
