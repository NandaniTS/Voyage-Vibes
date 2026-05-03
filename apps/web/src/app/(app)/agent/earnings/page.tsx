'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Card, CardBody, Input, Spinner } from '@heroui/react';
import { FaDollarSign, FaCreditCard, FaCalendar, FaUniversity, FaEdit } from 'react-icons/fa';
import { HiTrendingUp } from 'react-icons/hi';
import { earningsApiWithSession } from '../../../../services/earnings';
import type { TEarningsSummary, TEarningItem, TMonthlyPayout, TBankDetail } from '@repo/frontend-sdk';
import toast from 'react-hot-toast';

const EMPTY_BANK: Omit<TBankDetail, 'agentId' | '_id'> = {
  accountHolderName: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  branchName: '',
};

export default function EarningsPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<TEarningsSummary | null>(null);
  const [earnings, setEarnings] = useState<TEarningItem[]>([]);
  const [monthlyPayouts, setMonthlyPayouts] = useState<TMonthlyPayout[]>([]);

  const [bankDetail, setBankDetail] = useState<TBankDetail | null>(null);
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankForm, setBankForm] = useState(EMPTY_BANK);
  const [bankLoading, setBankLoading] = useState(false);

  const getAgentId = () => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u)._id : null;
    } catch { return null; }
  };

  const fetchData = useCallback(async () => {
    const agentId = getAgentId();
    if (!agentId) return;
    setLoading(true);
    try {
      const [earningsRes, bankRes] = await Promise.all([
        earningsApiWithSession.getEarnings(agentId),
        earningsApiWithSession.getBankDetails(agentId),
      ]);
      if (earningsRes.success && earningsRes.data) {
        setSummary(earningsRes.data.summary);
        setEarnings(earningsRes.data.earnings);
        setMonthlyPayouts(earningsRes.data.monthlyPayouts);
      }
      if (bankRes.success) {
        setBankDetail(bankRes.data ?? null);
        if (bankRes.data) {
          const { accountHolderName, bankName, accountNumber, ifscCode, branchName } = bankRes.data;
          setBankForm({ accountHolderName, bankName, accountNumber, ifscCode, branchName: branchName ?? '' });
        }
      }
    } catch {
      toast.error('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveBank = async () => {
    const agentId = getAgentId();
    if (!agentId) return;
    if (!bankForm.accountHolderName || !bankForm.bankName || !bankForm.accountNumber || !bankForm.ifscCode) {
      toast.error('Please fill all required fields');
      return;
    }
    setBankLoading(true);
    try {
      if (bankDetail) {
        await earningsApiWithSession.updateBankDetails(agentId, bankForm);
        toast.success('Bank details updated');
      } else {
        await earningsApiWithSession.saveBankDetails({ ...bankForm, agentId });
        toast.success('Bank details saved');
      }
      setShowBankForm(false);
      fetchData();
    } catch {
      toast.error('Failed to save bank details');
    } finally {
      setBankLoading(false);
    }
  };

  const inputClass = {
    base: 'flex-1',
    inputWrapper: 'h-9 bg-transparent shadow-none border-none focus-within:ring-0',
    input: 'h-9 text-sm',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  const s = summary ?? { totalEarnings: 0, totalPaid: 0, totalPending: 0, platformFee: 0, netEarnings: 0, commissionRate: 15 };

  return (
    <div className="space-y-6 p-4 h-full overflow-y-scroll display-scrollbar">
      <p className="text-muted-foreground">Track your earnings and manage payouts</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
                <p className="text-3xl font-bold text-foreground">${s.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <FaDollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Paid to Account</p>
                <p className="text-3xl font-bold text-green-600">${s.totalPaid.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <FaCreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Pending Balance</p>
                <p className="text-3xl font-bold text-yellow-600">${s.totalPending.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <FaCalendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Net After Commission</p>
                <p className="text-3xl font-bold text-foreground">${s.netEarnings.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <HiTrendingUp className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Commission Breakdown */}
      <Card className="border border-(--border) rounded-lg">
        <CardBody className="p-6">
          <h3 className="font-serif font-bold text-lg text-foreground mb-4">Commission Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-(--muted) rounded-lg">
              <span className="text-(--foreground) font-medium">Gross Earnings</span>
              <span className="text-lg font-bold text-(--foreground)">${s.totalEarnings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-(--muted) rounded-lg">
              <span className="text-(--foreground) font-medium">Platform Commission ({s.commissionRate}%)</span>
              <span className="text-lg font-bold text-(--destructive)">-${s.platformFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-(--primary)/10 border-2 border-(--primary) rounded-lg">
              <span className="text-(--foreground) font-bold">Your Net Earnings</span>
              <span className="text-lg font-bold text-(--primary)">${s.netEarnings.toLocaleString()}</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Monthly Payouts */}
      <Card className="border border-(--border) rounded-lg">
        <CardBody className="p-6">
          <h3 className="font-serif font-bold text-lg text-(--foreground) mb-4">Monthly Payouts</h3>
          {monthlyPayouts.length === 0 ? (
            <p className="text-(--muted-foreground) text-sm">No payout data yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-(--foreground)">Month</th>
                    <th className="text-left py-3 px-4 font-semibold text-(--foreground)">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-(--foreground)">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-(--foreground)">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyPayouts.map((p) => (
                    <tr key={p.month} className="border-b border-(--border) hover:bg-(--muted)">
                      <td className="py-4 px-4 text-(--foreground) font-medium">{p.month}</td>
                      <td className="py-4 px-4 text-(--foreground) font-bold">${p.amount.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {p.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-(--muted-foreground)">
                        {p.date ? new Date(p.date).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Bank Account Section */}
      <Card className="border border-(--border) rounded-lg">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaUniversity className="w-5 h-5 text-(--primary)" />
              <h3 className="font-serif font-bold text-lg text-(--foreground)">Bank Account</h3>
            </div>
            {bankDetail && !showBankForm && (
              <Button size="sm" variant="bordered" className="border border-(--border) rounded-lg gap-1"
                onPress={() => setShowBankForm(true)}>
                <FaEdit className="w-3 h-3" /> Edit
              </Button>
            )}
          </div>

          {!showBankForm ? (
            bankDetail ? (
              <div className="p-4 border border-(--border) rounded-lg bg-(--muted) space-y-2">
                <p className="text-sm text-(--muted-foreground)">Connected Account</p>
                <p className="font-semibold text-(--foreground)">{bankDetail.bankName}</p>
                <p className="text-sm text-(--foreground)">{bankDetail.accountHolderName}</p>
                <p className="text-sm text-(--muted-foreground)">
                  A/C: ••••{bankDetail.accountNumber.slice(-4)} &nbsp;|&nbsp; IFSC: {bankDetail.ifscCode}
                </p>
                {bankDetail.branchName && (
                  <p className="text-sm text-(--muted-foreground)">Branch: {bankDetail.branchName}</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-(--muted-foreground)">No bank account linked yet.</p>
                <Button className="bg-(--primary) text-(--primary-foreground) rounded-lg"
                  onPress={() => setShowBankForm(true)}>
                  Add Bank Account
                </Button>
              </div>
            )
          ) : (
            <div className="space-y-4 max-w-md">
              {[
                { label: 'Account Holder Name *', key: 'accountHolderName', placeholder: 'Full name as per bank' },
                { label: 'Bank Name *', key: 'bankName', placeholder: 'e.g. HDFC Bank' },
                { label: 'Account Number *', key: 'accountNumber', placeholder: 'Enter account number' },
                { label: 'IFSC Code *', key: 'ifscCode', placeholder: 'e.g. HDFC0001234' },
                { label: 'Branch Name', key: 'branchName', placeholder: 'Optional' },
              ].map(({ label, key, placeholder }) => (
                <div key={key} className="space-y-1">
                  <label className="text-sm">{label}</label>
                  <div className="border border-(--border) rounded-lg flex items-center h-10">
                    <Input
                      placeholder={placeholder}
                      value={(bankForm as any)[key]}
                      onValueChange={(v) => setBankForm(f => ({ ...f, [key]: v }))}
                      classNames={inputClass}
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <Button className="bg-(--primary) text-(--primary-foreground) rounded-lg"
                  onPress={handleSaveBank} isLoading={bankLoading}>
                  {bankDetail ? 'Update' : 'Save'} Bank Details
                </Button>
                <Button variant="bordered" className="rounded-lg border border-(--border)"
                  onPress={() => { setShowBankForm(false); }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
