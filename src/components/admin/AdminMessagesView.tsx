import React, { useState, useEffect, useMemo } from 'react';
import { ContactMessage } from '../../types';
import { subscribeToMessages } from '../../services/adminMessageService';
import { MessageDetailModal } from './MessageDetailModal';
import {
  MessageSquare,
  Search,
  Filter,
  Image as ImageIcon,
  Clock,
  Mail,
  Phone,
  Eye,
  AlertCircle,
  Inbox,
  CheckCircle2,
} from 'lucide-react';

export const AdminMessagesView: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Read' | 'Replied'>('All');
  const [hasPhotoOnly, setHasPhotoOnly] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Subscribe to real-time messages from Firestore
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToMessages(
      (updatedMessages) => {
        setMessages(updatedMessages);
        setIsLoading(false);

        // Keep selected message in sync if modal is open
        setSelectedMessage((curr) => {
          if (!curr) return null;
          return updatedMessages.find((m) => m.id === curr.id) || curr;
        });
      },
      (err) => {
        console.error('Messages subscription error:', err);
        setError(err.message || 'Failed to stream messages from Firestore.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalNew = messages.filter((m) => m.status === 'New').length;
    const totalReplied = messages.filter((m) => m.status === 'Replied').length;
    const withPhotos = messages.filter((m) => Boolean(m.imageUrl)).length;

    return {
      total: messages.length,
      totalNew,
      totalReplied,
      withPhotos,
    };
  }, [messages]);

  // Filter and search
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      // Status filter
      if (statusFilter !== 'All' && (msg.status || 'New') !== statusFilter) {
        return false;
      }

      // Photo filter
      if (hasPhotoOnly && !msg.imageUrl) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = msg.name?.toLowerCase().includes(query);
        const matchesEmail = msg.email?.toLowerCase().includes(query);
        const matchesPhone = msg.phone?.toLowerCase().includes(query);
        const matchesText = msg.message?.toLowerCase().includes(query);
        return matchesName || matchesEmail || matchesPhone || matchesText;
      }

      return true;
    });
  }, [messages, statusFilter, hasPhotoOnly, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <p className="font-bold">Firestore Messages Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: New Inquiries */}
        <div className="p-5 rounded-xl bg-white border border-[#E5E4DE] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#717171] uppercase tracking-wider block">
              New Inquiries
            </span>
            <p className="text-3xl font-black text-[#1C9A6C] mt-1">
              {isLoading ? '-' : metrics.totalNew}
            </p>
            <span className="text-[11px] text-[#1C9A6C] font-medium flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-[#1C9A6C]" /> Target response: 2-4 hours
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-[#1C9A6C] flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Received */}
        <div className="p-5 rounded-xl bg-white border border-[#E5E4DE] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#717171] uppercase tracking-wider block">
              Total Inquiries
            </span>
            <p className="text-3xl font-black text-[#141414] mt-1">
              {isLoading ? '-' : metrics.total}
            </p>
            <span className="text-[11px] text-[#717171] font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-[#1C9A6C]" /> {metrics.totalReplied} resolved / replied
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#F5F4F0] border border-[#E5E4DE] text-[#141414] flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Photos Attached */}
        <div className="p-5 rounded-xl bg-white border border-[#E5E4DE] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#717171] uppercase tracking-wider block">
              Sample Photos Attached
            </span>
            <p className="text-3xl font-black text-amber-600 mt-1">
              {isLoading ? '-' : metrics.withPhotos}
            </p>
            <span className="text-[11px] text-[#717171] font-medium flex items-center gap-1 mt-1">
              <ImageIcon className="w-3 h-3 text-amber-600" /> Strip &amp; milk sample images
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <section className="bg-white p-4 rounded-xl border border-[#E5E4DE] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#A3A3A3] absolute left-3 top-3" />
            <input
              id="admin-messages-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, email, phone, or message text..."
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

          {/* Status & Photo Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-[#717171] font-medium mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            {(['All', 'New', 'Read', 'Replied'] as const).map((status) => {
              const isActive = statusFilter === status;
              const count =
                status === 'All'
                  ? messages.length
                  : messages.filter((m) => (m.status || 'New') === status).length;

              return (
                <button
                  key={status}
                  id={`message-filter-${status.toLowerCase()}`}
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
            })}

            {/* Photo Toggle */}
            <button
              id="message-filter-photo-toggle"
              type="button"
              onClick={() => setHasPhotoOnly(!hasPhotoOnly)}
              className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 border ${
                hasPhotoOnly
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-[#FAFAF8] border-[#E5E4DE] text-[#525252] hover:bg-[#EAE8E3]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>With Photo Only</span>
            </button>
          </div>
        </div>
      </section>

      {/* Messages Table */}
      <section className="bg-white rounded-xl border border-[#E5E4DE] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E5E4DE] flex items-center justify-between bg-[#FAFAF8]">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-[#141414]">Customer Messages</h2>
            <span className="text-xs text-[#717171]">
              ({filteredMessages.length} {filteredMessages.length === 1 ? 'inquiry' : 'inquiries'} shown)
            </span>
          </div>

          <span className="text-[11px] text-[#717171] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Firestore sync (<code className="font-mono text-[10px]">messages</code>)
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#1C9A6C]/30 border-t-[#1C9A6C] rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#717171]">Loading inquiries from Firestore...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <MessageSquare className="w-10 h-10 text-[#A3A3A3] mx-auto stroke-1" />
            <p className="text-sm font-bold text-[#141414]">No matching messages found</p>
            <p className="text-xs text-[#717171]">
              {searchQuery || statusFilter !== 'All' || hasPhotoOnly
                ? 'Try adjusting your search query or filters.'
                : 'Customer inquiries submitted via the Contact Form will appear here instantly.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-[#E5E4DE] text-[#717171] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date &amp; Time</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Message Snippet</th>
                  <th className="py-3 px-4 text-center">Attachment</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EFEB]">
                {filteredMessages.map((msg) => {
                  const dateStr = msg.createdAt
                    ? new Date(msg.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recent';

                  return (
                    <tr
                      key={msg.id}
                      id={`message-row-${msg.id}`}
                      onClick={() => setSelectedMessage(msg)}
                      className="hover:bg-[#F9F8F5] transition-colors cursor-pointer group"
                    >
                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            msg.status === 'New'
                              ? 'bg-emerald-100 text-emerald-800'
                              : msg.status === 'Replied'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {msg.status || 'New'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-[#717171] whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#A3A3A3]" />
                          <span>{dateStr}</span>
                        </span>
                      </td>

                      {/* Customer Name */}
                      <td className="py-3.5 px-4 font-bold text-[#141414] whitespace-nowrap">
                        {msg.name}
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4 text-[#525252] space-y-0.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-[#717171]" />
                          <span>{msg.email}</span>
                        </div>
                        {msg.phone && (
                          <div className="flex items-center gap-1.5 text-[11px] text-[#717171]">
                            <Phone className="w-3 h-3 text-[#717171]" />
                            <span>{msg.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Message Preview */}
                      <td className="py-3.5 px-4 text-[#525252] max-w-xs">
                        <p className="line-clamp-2 text-xs leading-relaxed font-normal">
                          {msg.message}
                        </p>
                      </td>

                      {/* Attachment Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {msg.imageUrl ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold">
                            <ImageIcon className="w-3 h-3 text-amber-600" />
                            <span>Photo</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#A3A3A3]">-</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMessage(msg);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-white hover:bg-[#F5F4F0] border border-[#D5D4CE] text-xs font-semibold text-[#141414] transition-colors cursor-pointer group-hover:border-[#1C9A6C]"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#1C9A6C]" />
                          <span>View</span>
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

      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      )}
    </div>
  );
};
