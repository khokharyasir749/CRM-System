"use client";

import React, { useState } from 'react';
import {
  MessageSquareQuote,
  MessageCircle,
  Sparkles,
  Send,
  Plus,
  Check,
  Copy,
  Clock,
  ShieldAlert,
  Edit3,
  Sliders,
  CheckCheck,
} from 'lucide-react';
import { MessageTemplate, OmnichannelConversation } from '@/types/crm';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'h-3 w-3' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


interface MessagesViewProps {
  templates: MessageTemplate[];
  conversations: OmnichannelConversation[];
  onUpdateTemplate: (template: MessageTemplate) => void;
  onAddTemplate: (template: MessageTemplate) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  templates,
  conversations,
  onUpdateTemplate,
  onAddTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'inbox'>('templates');

  // Templates state
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate>(templates[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Template editor form
  const [editTitle, setEditTitle] = useState(templates[0]?.title || '');
  const [editCategory, setEditCategory] = useState(templates[0]?.category || 'Confirmation');
  const [editContent, setEditContent] = useState(templates[0]?.content || '');

  // Shared Inbox state
  const [selectedChat, setSelectedChat] = useState<OmnichannelConversation>(conversations[0]);
  const [replyText, setReplyText] = useState('');

  const handleSelectTemplate = (tpl: MessageTemplate) => {
    setSelectedTemplate(tpl);
    setEditTitle(tpl.title);
    setEditCategory(tpl.category);
    setEditContent(tpl.content);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: MessageTemplate = {
      ...selectedTemplate,
      title: editTitle,
      category: editCategory as any,
      content: editContent,
    };
    onUpdateTemplate(updated);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const insertVariable = (varName: string) => {
    setEditContent((prev) => `${prev} ${varName}`);
  };

  // Sample preview rendering
  const renderPreview = (content: string) => {
    return content
      .replace(/{{customer_name}}/g, 'Mahnoor Farooq')
      .replace(/{{service_name}}/g, 'Bridal Hair & Deluxe Makeup')
      .replace(/{{staff_name}}/g, 'Ayesha Khan')
      .replace(/{{appointment_date}}/g, 'Wednesday, Oct 14')
      .replace(/{{appointment_time}}/g, '11:00 AM')
      .replace(/{{amount_due}}/g, '35,000')
      .replace(/{{invoice_code}}/g, '#INV-8821');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation Tabs for Scope Split */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Messages & Communication Suite
          </h2>
          <p className="text-xs text-slate-600">
            Pre-approved WhatsApp notifications & omnichannel client concierge
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center rounded-full bg-slate-100 p-1 border border-slate-200/60 text-xs">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-semibold transition-all ${
              activeTab === 'templates'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquareQuote className="h-3.5 w-3.5" />
            <span>Message Templates (In-Scope)</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-semibold transition-all ${
              activeTab === 'inbox'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
            <span>Shared Inbox</span>
            <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 border border-amber-300">
              Pending Scope
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: MESSAGE TEMPLATES (IN-SCOPE) */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Templates Directory (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-slate-900">Active Templates</span>
              <span className="text-[11px] text-slate-600">{templates.length} Ready</span>
            </div>

            <div className="space-y-2.5">
              {templates.map((tpl) => {
                const isSelected = selectedTemplate.id === tpl.id;

                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{tpl.title}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          isSelected
                            ? 'bg-slate-800 text-amber-300'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tpl.category}
                      </span>
                    </div>
                    <p
                      className={`mt-2 text-xs line-clamp-2 leading-relaxed ${
                        isSelected ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {tpl.content}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Template Editor & Real-time Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Editor Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900">Template Editor</h3>
                </div>
                <button
                  onClick={() => handleCopy(editContent, 'editor')}
                  className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  {copiedId === 'editor' ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>Copy Text</span>
                </button>
              </div>

              <form onSubmit={handleSaveTemplate} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Template Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900"
                    >
                      <option value="Confirmation">Confirmation</option>
                      <option value="Reminder">Reminder</option>
                      <option value="Payment">Payment</option>
                      <option value="Review">Review</option>
                      <option value="Promo">Promo</option>
                    </select>
                  </div>
                </div>

                {/* Variable Pills */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                    Click variable tag to insert into template:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '{{customer_name}}',
                      '{{service_name}}',
                      '{{staff_name}}',
                      '{{appointment_time}}',
                      '{{appointment_date}}',
                      '{{amount_due}}',
                      '{{invoice_code}}',
                    ].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => insertVariable(v)}
                        className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-mono text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Message Text
                  </label>
                  <textarea
                    rows={4}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 font-normal focus:bg-white leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Real-time WhatsApp Device Preview Card */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-900 p-5 text-white shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold">WhatsApp Client Live Preview</span>
                </div>
                <span className="text-[10px] text-slate-400">Regular Luxury Salon DHA</span>
              </div>

              {/* Chat Bubble Simulation */}
              <div className="mt-4 rounded-2xl bg-emerald-950/70 border border-emerald-800/60 p-4 text-xs leading-relaxed text-emerald-100 max-w-lg shadow-inner">
                <p>{renderPreview(editContent)}</p>
                <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-emerald-400">
                  <span>10:30 AM</span>
                  <CheckCheck className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OMNICHANNEL SHARED INBOX (PENDING SCOPE APPROVAL) */}
      {activeTab === 'inbox' && (
        <div className="space-y-4">
          {/* MANDATORY NOTICE BANNER */}
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/95 p-4 text-amber-950 shadow-sm flex items-start gap-3.5">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
                ⚠️ Pending Scope Approval
              </p>
              <p className="mt-0.5 text-xs text-amber-800 leading-relaxed">
                Full Two-Way WhatsApp & Instagram Shared Inbox is an add-on item requiring separate commercial approval under the Professional Package (PKR 140,000). The interface below is an interactive functional demonstration.
              </p>
            </div>
          </div>

          {/* Omnichannel Inbox Mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden h-[540px]">
            {/* Left Thread List (4 cols) */}
            <div className="lg:col-span-4 border-r border-slate-200 flex flex-col h-full bg-slate-50/50">
              <div className="p-4 border-b border-slate-200 bg-white">
                <span className="text-xs font-bold text-slate-900">Shared Conversations</span>
                <p className="text-[10px] text-slate-600">WhatsApp & Instagram Direct</p>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {conversations.map((chat) => {
                  const isSelected = selectedChat.id === chat.id;

                  return (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-3.5 cursor-pointer transition-colors ${
                        isSelected ? 'bg-white shadow-2xs border-l-4 border-slate-900' : 'hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={chat.avatar}
                            alt={chat.customerName}
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-white text-[9px] ${
                              chat.channel === 'WhatsApp' ? 'bg-emerald-500' : 'bg-pink-600'
                            }`}
                          >
                            {chat.channel === 'WhatsApp' ? (
                              <MessageCircle className="h-2.5 w-2.5" />
                            ) : (
                              <InstagramIcon className="h-2.5 w-2.5" />
                            )}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {chat.customerName}
                            </span>
                            <span className="text-[10px] text-slate-600">{chat.lastMessageTime}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 truncate mt-0.5">
                            {chat.lastMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Chat Thread (8 cols) */}
            <div className="lg:col-span-8 flex flex-col h-full bg-white">
              {/* Chat Thread Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedChat.avatar}
                    alt={selectedChat.customerName}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {selectedChat.customerName}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.2 text-[9px] font-bold text-white ${
                          selectedChat.channel === 'WhatsApp' ? 'bg-emerald-600' : 'bg-pink-600'
                        }`}
                      >
                        {selectedChat.channel}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-600">{selectedChat.customerPhone}</span>
                  </div>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                  Assigned: {selectedChat.assignedStaff}
                </span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
                {selectedChat.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === 'salon' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl p-3 text-xs shadow-2xs ${
                        m.sender === 'salon'
                          ? 'bg-slate-900 text-white rounded-br-xs'
                          : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span
                        className={`block text-[9px] mt-1 text-right ${
                          m.sender === 'salon' ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {m.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Composer */}
              <div className="p-3 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official reply as Regular CRM Concierge..."
                    className="flex-1 rounded-full border border-slate-200 bg-slate-50 py-2 px-4 text-xs text-slate-900 focus:bg-white focus:outline-hidden"
                  />
                  <button
                    onClick={() => {
                      if (!replyText.trim()) return;
                      selectedChat.messages.push({
                        id: `m-${Date.now()}`,
                        sender: 'salon',
                        text: replyText.trim(),
                        time: 'Just Now',
                      });
                      setReplyText('');
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
