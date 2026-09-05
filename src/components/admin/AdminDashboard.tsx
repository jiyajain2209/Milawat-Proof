import React, { useState, useEffect, useMemo } from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Order, OrderStatus } from '../../types';
import { subscribeToOrders } from '../../services/adminOrderService';
import { OrderDetailModal } from './OrderDetailModal';
import {
  Package,
  Clock,
  CheckCircle2,
  IndianRupee,
  Search,
  Filter,
  LogOut,
  ExternalLink,
  RefreshCw,
  Eye,
  AlertCircle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardProps {
  user: {
    email: string | null;
    displayName?: string | null;
    uid?: string;
  };
  onNavigateToStore: () => void;
  onSignOut?: () => void;
}

type FilterStatus = 'All' | OrderStatus;

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  onNavigateToStore,
  onSignOut,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Subscribe to real-time orders from Firestore
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToOrders(
      (updatedOrders) => {
        setOrders(updatedOrders);
        setIsLoading(false);

        // Keep selected order modal in sync if open
        setSelectedOrder((curr) => {
          if (!curr) return null;
          return updatedOrders.find((o) => o.id === curr.id) || curr;
        });
      },
      (err) => {
        console.error('Admin order subscription error:', err);
        setError(err.message || 'Failed to stream orders from Firestore.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut();
      return;
    }
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
  };

  // Summary Metrics calculations
  const summaryMetrics = useMemo(() => {
    const totalPending = orders.filter((o) => o.orderStatus === 'Pending').length;
    const totalConfirmed = orders.filter((o) => o.orderStatus === 'Confirmed').length;
    const totalFulfilled = orders.filter((o) => o.orderStatus === 'Fulfilled').length;
    const totalCancelled = orders.filter((o) => o.orderStatus === 'Cancelled').length;

    const confirmedRevenue = orders
      .filter((o) => o.orderStatus === 'Confirmed')
      .reduce((sum, o) => sum + (o.orderTotal || 0), 0);

    const totalPotentialRevenue = orders.reduce(
      (sum, o) => sum + (o.orderTotal || 0),
      0
    );

    return {
      totalPending,
      totalConfirmed,
      totalFulfilled,
      totalCancelled,
      confirmedRevenue,
      totalPotentialRevenue,
      totalOrders: orders.length,
    };
  }, [orders]);

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status Filter
      if (statusFilter !== 'All' && order.orderStatus !== statusFilter) {
        return false;
      }

      // Search Query (Customer name, phone, order ID)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = order.customerName?.toLowerCase().includes(query);
        const matchesPhone = order.phone?.toLowerCase().includes(query);
        const matchesId = order.orderId?.toLowerCase().includes(query);
        const matchesEmail = order.email?.toLowerCase().includes(query);
        return matchesName || matchesPhone || matchesId || matchesEmail;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  return (
    <div id="admin-dashboard-root" className="min-h-screen bg-[#F5F4F0] text-[#141414]">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#E5E4DE] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1C9A6C] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              MP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base text-[#141414] leading-tight">
                  MilawatProof Admin
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1C9A6C]/15 text-[#1C9A6C]">
                  Live Pre-Orders
                </span>
              </div>
              <p className="text-[11px] text-[#717171] hidden sm:block">
                Firestore Database: <code className="font-mono text-[#525252]">orders</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-[#141414] block">
                {user.email || 'Admin'}
              </span>
              <span className="text-[10px] text-[#717171]">Authenticated Admin</span>
            </div>

            <button
              id="admin-view-store-btn"
              type="button"
              onClick={onNavigateToStore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D5D4CE] bg-white hover:bg-[#F5F4F0] text-xs font-semibold text-[#525252] hover:text-[#141414] transition-colors cursor-pointer"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              id="admin-signout-btn"
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-semibold text-red-700 transition-colors cursor-pointer"
              title="Sign out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="font-bold">Firestore Access Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* 3 Main Summary Cards Requested by User */}
        <section id="admin-summary-cards" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Total Pending Pre-Orders */}
          <div className="p-5 rounded-xl bg-white border border-[#E5E4DE] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#717171] uppercase tracking-wider block">
                Total Pending Pre-Orders
              </span>
              <p className="text-3xl font-black text-[#141414] mt-1">
                {isLoading ? '-' : summaryMetrics.totalPending}
              </p>
              <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-amber-600" /> Awaiting lab verification
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Confirmed Orders */}
          <div className="p-5 rounded-xl bg-white border border-[#E5E4DE] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#717171] uppercase tracking-wider block">
                Total Confirmed
              </span>
              <p className="text-3xl font-black text-[#1C9A6C] mt-1">
                {isLoading ? '-' : summaryMetrics.totalConfirmed}
              </p>
              <span className="text-[11px] text-[#1C9A6C] font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3 text-[#1C9A6C]" /> Ready for dispatch
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#1C9A6C] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Total Revenue from Confirmed Orders */}
          <div className="p-5 rounded-xl bg-white border border-[#E5E4DE] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#717171] uppercase tracking-wider block">
                Confirmed Revenue
              </span>
              <p className="text-3xl font-black text-[#141414] mt-1">
                {isLoading ? '-' : `₹${summaryMetrics.confirmedRevenue.toLocaleString('en-IN')}`}
              </p>
              <span className="text-[11px] text-[#717171] font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-[#1C9A6C]" /> From {summaryMetrics.totalConfirmed} confirmed orders
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#F5F4F0] border border-[#E5E4DE] text-[#141414] flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Filters & Search Control Toolbar */}
        <section className="bg-white p-4 rounded-xl border border-[#E5E4DE] shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search input: customer name or phone */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#A3A3A3] absolute left-3 top-3" />
              <input
                id="admin-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, phone, or Order ID..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-[#D5D4CE] focus:border-[#1C9A6C] focus:ring-1 focus:ring-[#1C9A6C] outline-hidden placeholder:text-[#A3A3A3] bg-[#FAFAF8]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#717171] hover:text-[#141414]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-[#717171] font-medium mr-1 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              {(['All', 'Pending', 'Confirmed', 'Fulfilled', 'Cancelled'] as FilterStatus[]).map(
                (status) => {
                  const isActive = statusFilter === status;
                  const count =
                    status === 'All'
                      ? orders.length
                      : orders.filter((o) => o.orderStatus === status).length;

                  return (
                    <button
                      key={status}
                      id={`filter-tab-${status.toLowerCase()}`}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#141414] text-white shadow-xs'
                          : 'bg-[#FAFAF8] text-[#525252] hover:bg-[#EAE8E3] border border-[#E5E4DE]'
                      }`}
                    >
                      <span>{status}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#E5E4DE] text-[#717171]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* Orders Table */}
        <section className="bg-white rounded-xl border border-[#E5E4DE] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E5E4DE] flex items-center justify-between bg-[#FAFAF8]">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-[#141414]">Pre-Orders Roster</h2>
              <span className="text-xs text-[#717171]">
                ({filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} shown)
              </span>
            </div>

            <span className="text-[11px] text-[#717171] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Real-time Firestore sync
            </span>
          </div>

          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#1C9A6C]/30 border-t-[#1C9A6C] rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#717171]">Loading pre-orders from Firestore...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Package className="w-10 h-10 text-[#A3A3A3] mx-auto stroke-1" />
              <p className="text-sm font-bold text-[#141414]">No matching pre-orders found</p>
              <p className="text-xs text-[#717171]">
                {searchQuery || statusFilter !== 'All'
                  ? 'Try adjusting your search query or status filter.'
                  : 'Orders placed on the storefront will appear here instantly.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAFAF8] border-b border-[#E5E4DE] text-[#717171] font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EFEB]">
                  {filteredOrders.map((order) => {
                    const totalQty = (order.items || []).reduce(
                      (sum, item) => sum + (item.quantity || 1),
                      0
                    );
                    const itemsSummary = (order.items || [])
                      .map((i) => `${i.productName} (${i.tier === 'multi-use' ? 'Multi' : 'Single'}) × ${i.quantity}`)
                      .join(', ');

                    const formattedDate = order.createdAt
                      ? new Date(order.createdAt).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-';

                    return (
                      <tr
                        key={order.id || order.orderId}
                        id={`order-row-${order.orderId}`}
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-[#F9F8F5] transition-colors cursor-pointer group"
                      >
                        {/* Order ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#141414]">
                          {order.orderId}
                        </td>

                        {/* Customer Name */}
                        <td className="py-3.5 px-4 font-semibold text-[#141414]">
                          {order.customerName}
                        </td>

                        {/* Phone */}
                        <td className="py-3.5 px-4 font-mono text-[#525252]">
                          {order.phone}
                        </td>

                        {/* Items */}
                        <td className="py-3.5 px-4 text-[#525252] max-w-xs truncate" title={itemsSummary}>
                          <span className="font-semibold text-[#141414] mr-1">
                            {totalQty} {totalQty === 1 ? 'kit' : 'kits'}:
                          </span>
                          <span className="text-[11px] text-[#717171]">{itemsSummary}</span>
                        </td>

                        {/* Total */}
                        <td className="py-3.5 px-4 text-right font-black text-sm text-[#141414]">
                          ₹{order.orderTotal}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              order.orderStatus === 'Pending'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : order.orderStatus === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : order.orderStatus === 'Fulfilled'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-[#717171] whitespace-nowrap">
                          {formattedDate}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#1C9A6C] hover:underline"
                          >
                            <span>Manage</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Full Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={(orderId, newStatus, newNotes) => {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === orderId
                  ? { ...o, orderStatus: newStatus, notes: newNotes }
                  : o
              )
            );
          }}
        />
      )}
    </div>
  );
};
