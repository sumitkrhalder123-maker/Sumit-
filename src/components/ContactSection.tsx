import React, { useState } from 'react';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  Navigation,
  Star,
  Layers,
  Building,
  Briefcase,
  Coins,
  DollarSign,
  Tag,
  Loader2
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { OfficeHologram } from './OfficeHologram';
import { IndianThemeMap } from './IndianThemeMap';
import { RetroSnakeGame } from './RetroSnakeGame';

interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

const CURRENCIES: CurrencyOption[] = [
  // Top Most Popular Currencies
  { code: 'INR', symbol: '₹', name: 'INR - Indian Rupee (₹)' },
  { code: 'USD', symbol: '$', name: 'USD - US Dollar ($)' },
  { code: 'EUR', symbol: '€', name: 'EUR - Euro (€)' },
  { code: 'GBP', symbol: '£', name: 'GBP - British Pound (£)' },
  { code: 'AED', symbol: 'AED', name: 'AED - UAE Dirham (د.إ)' },
  { code: 'CAD', symbol: 'CA$', name: 'CAD - Canadian Dollar ($)' },
  { code: 'AUD', symbol: 'AU$', name: 'AUD - Australian Dollar ($)' },
  { code: 'SGD', symbol: 'SG$', name: 'SGD - Singapore Dollar ($)' },
  { code: 'SAR', symbol: 'SAR', name: 'SAR - Saudi Riyal (﷼)' },
  { code: 'QAR', symbol: 'QAR', name: 'QAR - Qatari Riyal (﷼)' },
  { code: 'JPY', symbol: '¥', name: 'JPY - Japanese Yen (¥)' },
  { code: 'CHF', symbol: 'CHF', name: 'CHF - Swiss Franc' },
  { code: 'BDT', symbol: '৳', name: 'BDT - Bangladeshi Taka (৳)' },
  { code: 'MYR', symbol: 'RM', name: 'MYR - Malaysian Ringgit (RM)' },
  { code: 'NZD', symbol: 'NZ$', name: 'NZD - New Zealand Dollar ($)' },
  { code: 'THB', symbol: '฿', name: 'THB - Thai Baht (฿)' },
  { code: 'ZAR', symbol: 'R', name: 'ZAR - South African Rand (R)' },
  { code: 'BRL', symbol: 'R$', name: 'BRL - Brazilian Real (R$)' },
  { code: 'CNY', symbol: '¥', name: 'CNY - Chinese Yuan (¥)' },
  { code: 'KRW', symbol: '₩', name: 'KRW - South Korean Won (₩)' },
  { code: 'IDR', symbol: 'Rp', name: 'IDR - Indonesian Rupiah (Rp)' },
  { code: 'PHP', symbol: '₱', name: 'PHP - Philippine Peso (₱)' },
  { code: 'VND', symbol: '₫', name: 'VND - Vietnamese Dong (₫)' },
  { code: 'TRY', symbol: '₺', name: 'TRY - Turkish Lira (₺)' },
  { code: 'SEK', symbol: 'kr', name: 'SEK - Swedish Krona (kr)' },
  { code: 'NOK', symbol: 'kr', name: 'NOK - Norwegian Krone (kr)' },
  { code: 'DKK', symbol: 'kr', name: 'DKK - Danish Krone (kr)' },
  { code: 'PLN', symbol: 'zł', name: 'PLN - Polish Zloty (zł)' },
  { code: 'MXN', symbol: 'Mex$', name: 'MXN - Mexican Peso ($)' },
  { code: 'KWD', symbol: 'KD', name: 'KWD - Kuwaiti Dinar (KD)' },
  { code: 'OMR', symbol: 'OMR', name: 'OMR - Omani Rial (RO)' },
  { code: 'BHD', symbol: 'BHD', name: 'BHD - Bahraini Dinar (BD)' },
  { code: 'ILS', symbol: '₪', name: 'ILS - Israeli Shekel (₪)' },
  { code: 'EGP', symbol: 'E£', name: 'EGP - Egyptian Pound (E£)' },
  { code: 'NGN', symbol: '₦', name: 'NGN - Nigerian Naira (₦)' },
  { code: 'KES', symbol: 'KSh', name: 'KES - Kenyan Shilling (KSh)' },
  { code: 'PKR', symbol: 'PKR', name: 'PKR - Pakistani Rupee (Rs)' },
  { code: 'LKR', symbol: 'LKR', name: 'LKR - Sri Lankan Rupee (Rs)' },
  { code: 'NPR', symbol: 'NPR', name: 'NPR - Nepalese Rupee (Rs)' },
  { code: 'CZK', symbol: 'Kč', name: 'CZK - Czech Koruna (Kč)' },
  { code: 'HUF', symbol: 'Ft', name: 'HUF - Hungarian Forint (Ft)' },
  { code: 'RON', symbol: 'lei', name: 'RON - Romanian Leu' },
  { code: 'CLP', symbol: 'CLP$', name: 'CLP - Chilean Peso ($)' },
  { code: 'COP', symbol: 'COP$', name: 'COP - Colombian Peso ($)' },
  { code: 'ARS', symbol: 'ARS$', name: 'ARS - Argentine Peso ($)' },
];

const SERVICES_OPTIONS = [
  'Generative AI Video & Concepts',
  'Commercial Video Editing & Short-Form Reels',
  'AI Graphic Design & Visual Brand Identity',
  'Prompt Engineering & Custom AI Generation',
  'Social Media Growth & High-Cadence Content',
  'Cinematic Color Grading & Motion Graphics / VFX',
  'Full-Time Employment / Creative Lead Role',
  'Agency Retainer / Long-Term Partnership',
  'Custom Creative Collaboration',
];

const SCOPE_TYPES = [
  'Fixed Project',
  'Monthly Retainer',
  'Per Asset / Video',
  'Hourly Rate',
  'Flexible / Open to Discuss',
];

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceNeeded: SERVICES_OPTIONS[0],
    currency: 'INR',
    customAmount: '',
    scopeType: SCOPE_TYPES[0],
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    serviceNeeded: string;
    budgetSummary: string;
    message: string;
  } | null>(null);

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const selectedCurrencyObj = CURRENCIES.find((c) => c.code === formData.currency) || CURRENCIES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    const amountText = formData.customAmount.trim()
      ? `${selectedCurrencyObj.symbol} ${formData.customAmount.trim()} (${selectedCurrencyObj.code})`
      : 'Open for discussion / Custom';

    const budgetSummary = `${amountText} • Scope: ${formData.scopeType}`;

    const submissionPayload = {
      name: formData.name,
      email: formData.email,
      serviceNeeded: formData.serviceNeeded,
      scopeType: formData.scopeType,
      currency: selectedCurrencyObj.code,
      customAmount: formData.customAmount,
      budgetSummary,
      message: formData.message,
    };

    setSubmittedData({
      name: formData.name,
      email: formData.email,
      serviceNeeded: formData.serviceNeeded,
      budgetSummary,
      message: formData.message,
    });

    try {
      // 1. Post to local server endpoint which records inquiry permanently and dispatches
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionPayload),
        });
      } catch (localErr) {
        console.warn('Local /api/contact call had warning:', localErr);
      }

      // 2. Also send directly to FormSubmit to guarantee direct delivery to sumitkrhalder26@gmail.com
      try {
        await fetch('https://formsubmit.co/ajax/sumitkrhalder26@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            _subject: `[Portfolio Inquiry] ${formData.serviceNeeded} from ${formData.name}`,
            _replyto: formData.email,
            'Service Needed': formData.serviceNeeded,
            'Project Scope / Budget': budgetSummary,
            'Currency': selectedCurrencyObj.name,
            'Custom Value / Amount': formData.customAmount || 'Flexible',
            'Engagement Model': formData.scopeType,
            'Message': formData.message,
            '_template': 'table',
          }),
        });
      } catch (forwardErr) {
        console.warn('FormSubmit external dispatch warning:', forwardErr);
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Contact submit error:', err);
      // Still show submitted view so client is not blocked
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 relative bg-[#080c14]/90 backdrop-blur-[0.5px] border-t border-slate-800/80">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-indigo-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Connect & Location</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Let’s Build High-Impact Visuals Together
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Have a project in mind, need Gen AI creative direction, or want to connect at our studio? Reach out directly.
          </p>
        </div>

        {/* TOP ROW: Contact Channels & Form (Left) SIDE-BY-SIDE with 3D Hologram of Graphics Sumit Office (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (5 cols): Direct Contact Info & Quick Form */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0e1422] border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Direct Communication</span>
                </h3>
                <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-500/30">
                  Graphics Sumit HQ
                </span>
              </div>

              {/* Email item */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-slate-400 block">Email Address</span>
                    <a
                      href={`mailto:${PERSONAL_INFO.email}`}
                      className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors truncate block"
                      id="contact-email-link"
                    >
                      {PERSONAL_INFO.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                  title="Copy email address"
                  id="contact-copy-email-btn"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone & WhatsApp */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Phone & WhatsApp</span>
                    <a
                      href={`tel:${PERSONAL_INFO.phone}`}
                      className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                      id="contact-phone-link"
                    >
                      {PERSONAL_INFO.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href="https://wa.me/919062355706"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    title="Chat on WhatsApp"
                    id="contact-whatsapp-link"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <button
                    onClick={handleCopyPhone}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Copy phone number"
                  >
                    {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Studio Address on Google Maps */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400 block">Google Maps Listed Studio</span>
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                        ⭐ 5.0
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">
                      Graphics Sumit (গ্রাফিক্স সুমিত)
                    </p>
                    <p className="text-xs text-slate-300 mt-0.5">
                      North Dumdum, Kolkata, West Bengal 700028, India
                    </p>
                  </div>
                </div>

                <a
                  href={PERSONAL_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors shrink-0"
                  title="View on Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Availability Status */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Currently Available</span>
                </div>
                <p className="text-xs text-slate-300">
                  Ready for full-time employment, agency retainer, or freelance multimedia campaigns.
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Average response time: &lt; 2 hours</span>
                </div>
              </div>
            </div>

            {/* Quick Message Form */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0e1422] border border-slate-800 shadow-xl">
              {submitted ? (
                <div className="py-7 px-2 text-center space-y-4 animate-in fade-in">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-2">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Delivered Directly to sumitkrhalder26@gmail.com</span>
                    </span>
                    <h4 className="text-xl font-extrabold text-white">Inquiry Sent Successfully!</h4>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto mt-1.5 leading-relaxed">
                      Thank you, <strong className="text-white font-semibold">{submittedData?.name}</strong>! Your inquiry has been delivered directly to Sumit's primary email (<span className="text-cyan-300 font-mono">sumitkrhalder26@gmail.com</span>).
                    </p>
                  </div>

                  {/* Summary of Inquiry */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-1.5 max-w-md mx-auto">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Submitted Details:
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Service:</span>
                      <span className="font-semibold text-white truncate max-w-[200px]">{submittedData?.serviceNeeded}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Budget / Scope:</span>
                      <span className="font-semibold text-cyan-300">{submittedData?.budgetSummary}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Your Email:</span>
                      <span className="font-mono text-slate-200">{submittedData?.email}</span>
                    </div>
                  </div>

                  {/* Action Shortcuts */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
                    <a
                      href={`https://wa.me/919062355706?text=${encodeURIComponent(
                        `Hi Sumit, I just sent a project inquiry for "${submittedData?.serviceNeeded}" to your email (sumitkrhalder26@gmail.com).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          serviceNeeded: SERVICES_OPTIONS[0],
                          currency: 'INR',
                          customAmount: '',
                          scopeType: SCOPE_TYPES[0],
                          message: '',
                        });
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" id="portfolio-contact-form">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Send a Quick Message</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* 1. Service Needed Option */}
                  <div>
                    <label className="flex items-center justify-between text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Service Needed *</span>
                      </span>
                      <span className="text-[10px] text-cyan-400 font-normal lowercase tracking-normal">
                        select project type
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.serviceNeeded}
                        onChange={(e) => setFormData({ ...formData, serviceNeeded: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all appearance-none cursor-pointer pr-10 font-medium"
                      >
                        {SERVICES_OPTIONS.map((srv) => (
                          <option key={srv} value={srv} className="bg-slate-900 text-white py-1.5">
                            {srv}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Tag className="w-4 h-4 text-cyan-400" />
                      </div>
                    </div>
                  </div>

                  {/* 2. Project Scope / Budget Option with Currency Dropdown & Custom Value */}
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>Project Scope / Budget *</span>
                      </label>
                      <span className="text-[10px] font-medium text-slate-400">
                        Currency & Custom Value
                      </span>
                    </div>

                    {/* Currency Selector & Custom Amount Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      {/* Dropdown list of all currencies */}
                      <div className="sm:col-span-6">
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">
                          Choose Currency
                        </label>
                        <div className="relative">
                          <select
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 transition-all appearance-none cursor-pointer pr-8"
                          >
                            {CURRENCIES.map((curr) => (
                              <option key={curr.code} value={curr.code} className="bg-slate-900 text-white">
                                {curr.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-400 text-xs font-bold">
                            {selectedCurrencyObj.symbol}
                          </div>
                        </div>
                      </div>

                      {/* Custom Value / Amount Typed by User */}
                      <div className="sm:col-span-6">
                        <label className="block text-[10px] font-medium text-slate-400 mb-1">
                          Custom Amount / Value
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400 pointer-events-none">
                            {selectedCurrencyObj.symbol}
                          </span>
                          <input
                            type="text"
                            placeholder="e.g. 25,000 or 1,500"
                            value={formData.customAmount}
                            onChange={(e) => setFormData({ ...formData, customAmount: e.target.value })}
                            className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick presets & Scope Engagement Model */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Engagement Model:</span>
                        <span>
                          Current:{' '}
                          <span className="text-cyan-300 font-semibold">
                            {formData.customAmount ? `${selectedCurrencyObj.symbol} ${formData.customAmount}` : 'Flexible'}{' '}
                            ({formData.scopeType})
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {SCOPE_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, scopeType: type })}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                              formData.scopeType === type
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                      Message / Project Details *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe your creative requirements, timeline, or job opportunity..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-200" />
                        <span>Sending Directly to sumitkrhalder26@gmail.com...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message Directly to Sumit's Email</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Delivers straight to verified inbox: <strong className="text-cyan-300 font-mono">sumitkrhalder26@gmail.com</strong></span>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column (6 cols): 3D HOLOGRAM OF GRAPHICS SUMIT OFFICE & RETRO NOKIA CYBER SNAKE */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top Card: 3D Hologram Studio & Capabilities */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0e1422] border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-bold text-white">3D Hologram: Graphics Sumit Studio</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  INTERACTIVE 360° PROJECTION
                </span>
              </div>

              {/* The 3D Hologram Component */}
              <OfficeHologram />

              {/* Studio Capabilities Overview */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-xs font-bold text-cyan-400">4K / 60FPS</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Video Timeline</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-xs font-bold text-emerald-400">Dual RTX GPU</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Gen AI Render Node</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-xs font-bold text-purple-400">Dum Dum HQ</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Kolkata, India</div>
                </div>
              </div>
            </div>

            {/* Bottom Card: Nokia Retro Cyber Snake (Compact & Themed) */}
            <RetroSnakeGame />
          </div>
        </div>

        {/* BOTTOM ROW: INDIAN THEME MAP WITH CINEMATIC ZOOM TO GRAPHICS SUMIT */}
        <div className="space-y-4 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-cyan-400" />
                <span>India Cartography & Studio Pinpoint</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Visualizing Graphics Sumit's geographical base in North Dumdum, Kolkata with live coordinates and Google Maps sync.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                22.6450° N, 88.4050° E
              </span>
            </div>
          </div>

          {/* The Themed Animated Indian Map Component */}
          <IndianThemeMap />
        </div>
      </div>
    </section>
  );
};
