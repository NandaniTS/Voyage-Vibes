'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardBody, Spinner } from '@heroui/react';
import { HiTrendingUp } from 'react-icons/hi';
import { FaUsers, FaMapMarkerAlt, FaDollarSign, FaStar } from 'react-icons/fa';
import { analyticsApiWithSession } from '../../../../services/analytics';
import type { TAnalyticsResponse } from '@repo/frontend-sdk';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TAnalyticsResponse | null>(null);

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
      const res = await analyticsApiWithSession.getAnalytics(agentId);
      if (res.success && res.data) setData(res.data);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  const kpis = data?.kpis ?? { totalRevenue: 0, totalBookings: 0, activePackages: 0, avgRating: 0, totalReviews: 0 };

  return (
    <div className="space-y-6 p-4 overflow-y-scroll h-full">
      <p className="text-(--muted-foreground)">Track your business performance and insights</p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-(--muted-foreground) mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-(--foreground)">${kpis.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-(--primary)/20 flex items-center justify-center">
                <FaDollarSign className="w-6 h-6 text-(--primary)" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-(--muted-foreground) mb-2">Total Bookings</p>
                <p className="text-3xl font-bold text-(--foreground)">{kpis.totalBookings}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-(--primary)/20 flex items-center justify-center">
                <FaUsers className="w-6 h-6 text-(--primary)" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-(--muted-foreground) mb-2">Active Packages</p>
                <p className="text-3xl font-bold text-(--foreground)">{kpis.activePackages}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-(--primary)/20 flex items-center justify-center">
                <FaMapMarkerAlt className="w-6 h-6 text-(--primary)" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-(--muted-foreground) mb-2">Avg Rating</p>
                <p className="text-3xl font-bold text-(--foreground)">{kpis.avgRating > 0 ? kpis.avgRating : '—'}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-(--accent)/20 flex items-center justify-center">
                <HiTrendingUp className="w-6 h-6 text-(--accent)" />
              </div>
            </div>
            {kpis.totalReviews > 0 && (
              <p className="text-xs text-(--muted-foreground) mt-3">Based on {kpis.totalReviews} reviews</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Monthly Revenue */}
      {data?.monthlyRevenue && data.monthlyRevenue.length > 0 && (
        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <h3 className="font-serif font-bold text-lg text-(--foreground) mb-4">Monthly Revenue</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-(--border)">
                    <th className="text-left py-3 px-4 font-semibold text-(--foreground)">Month</th>
                    <th className="text-left py-3 px-4 font-semibold text-(--foreground)">Revenue</th>
                    <th className="text-left py-3 px-4 font-semibold text-(--foreground)">Bookings</th>
                  </tr>
                </thead>
                <tbody>
                  {data.monthlyRevenue.map((m) => (
                    <tr key={m.month} className="border-b border-(--border) hover:bg-(--muted)">
                      <td className="py-3 px-4 text-(--foreground)">{m.month}</td>
                      <td className="py-3 px-4 font-bold text-(--foreground)">${m.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-(--muted-foreground)">{m.bookings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Recent Bookings + Top Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <h3 className="font-serif font-bold text-lg text-(--foreground) mb-4">Recent Bookings</h3>
            {!data?.recentBookings?.length ? (
              <p className="text-sm text-(--muted-foreground)">No bookings yet.</p>
            ) : (
              <div className="space-y-1">
                {data.recentBookings.map((b) => (
                  <div key={b._id} className="flex items-center justify-between py-3 border-b border-(--border) last:border-0">
                    <div>
                      <p className="font-medium text-(--foreground)">{b.packageTitle}</p>
                      <p className="text-xs text-(--muted-foreground) capitalize">{b.status} · {new Date(b.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">+${b.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <h3 className="font-serif font-bold text-lg text-(--foreground) mb-4">Top Performing Packages</h3>
            {!data?.topPackages?.length ? (
              <p className="text-sm text-(--muted-foreground)">No data yet.</p>
            ) : (
              <div className="space-y-1">
                {data.topPackages.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-(--border) last:border-0">
                    <div>
                      <p className="font-medium text-(--foreground)">{p.title}</p>
                      <p className="text-xs text-(--muted-foreground)">{p.bookings} booking{p.bookings !== 1 ? 's' : ''}</p>
                    </div>
                    <span className="text-sm font-bold text-(--primary)">${p.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Recent Reviews */}
      {data?.recentReviews && data.recentReviews.length > 0 && (
        <Card className="border border-(--border) rounded-lg">
          <CardBody className="p-6">
            <h3 className="font-serif font-bold text-lg text-(--foreground) mb-4">Recent Reviews</h3>
            <div className="space-y-4">
              {data.recentReviews.map((r) => (
                <div key={r._id} className="p-4 border border-(--border) rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-(--foreground)">{r.packageTitle}</p>
                      <p className="text-xs text-(--muted-foreground)">{r.reviewerName} · {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FaStar className="w-4 h-4" />
                      <span className="text-sm font-bold text-(--foreground)">{r.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-(--muted-foreground) line-clamp-2">{r.comment}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
