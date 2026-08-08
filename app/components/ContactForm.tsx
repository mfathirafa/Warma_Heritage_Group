'use client';

  import { useState } from 'react';
  import { useScrollReveal } from '../hooks/useScrollReveal';

  type Lang = 'id' | 'en';

  interface ContactFormProps {
    lang: Lang;
  }

  const content = {
    id: {
      name: 'Nama Lengkap',
      namePlaceholder: 'Masukkan nama Anda',
      email: 'Email',
      emailPlaceholder: 'email@contoh.com',
      company: 'Perusahaan (Opsional)',
      companyPlaceholder: 'Nama perusahaan Anda',
      subject: 'Subjek',
      subjectPlaceholder: 'Apa yang ingin Anda diskusikan?',
      message: 'Pesan',
      messagePlaceholder: 'Ceritakan lebih detail tentang kebutuhan Anda...',
      submit: 'Kirim Pesan',
      sending: 'Mengirim...',
      required: '*',
    },
    en: {
      name: 'Full Name',
      namePlaceholder: 'Enter your name',
      email: 'Email',
      emailPlaceholder: 'email@example.com',
      company: 'Company (Optional)',
      companyPlaceholder: 'Your company name',
      subject: 'Subject',
      subjectPlaceholder: 'What would you like to discuss?',
      message: 'Message',
      messagePlaceholder: 'Tell us more about your needs...',
      submit: 'Send Message',
      sending: 'Sending...',
      required: '*',
    },
  };

  interface FormData {
    name: string;
    email: string;
    company: string;
    subject: string;
    message: string;
  }

  const initialData: FormData = {
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  };

  export default function ContactForm({ lang }: ContactFormProps) {
    const t = content[lang];
    const [formData, setFormData] = useState<FormData>(initialData);
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const { ref, isVisible } = useScrollReveal();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setStatus('sending');
      setErrorMsg('');

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Gagal mengirim pesan');
        }

        setStatus('success');
        setFormData(initialData);
        setTimeout(() => setStatus('idle'), 5000);
      } catch (err: any) {
        setStatus('error');
        setErrorMsg(err.message || 'Terjadi kesalahan');
      }
    };

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`w-full reveal ${isVisible ? 'visible' : ''}`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-[0.12em] uppercase text-gray-500">
                {t.name} <span className="text-red-400">{t.required}</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.namePlaceholder}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm text-gray-900
  placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-300"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-[0.12em] uppercase text-gray-500">
                {t.email} <span className="text-red-400">{t.required}</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.emailPlaceholder}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm text-gray-900
  placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-[0.12em] uppercase text-gray-500">
                {t.company}
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder={t.companyPlaceholder}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm text-gray-900
  placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-300"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-[0.12em] uppercase text-gray-500">
                {t.subject} <span className="text-red-400">{t.required}</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={t.subjectPlaceholder}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm text-gray-900
  placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-300"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-[0.12em] uppercase text-gray-500">
              {t.message} <span className="text-red-400">{t.required}</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t.messagePlaceholder}
              required
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-sm text-gray-900
  placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors duration-300 resize-none"
            />
          </div>

          {status === 'success' && (
            <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm">
              {lang === 'id'
                ? '✓ Pesan berhasil dikirim! Kami akan segera merespon.'
                : '✓ Message sent successfully! We will respond soon.'}
            </div>
          )}

          {status === 'error' && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
              ✗ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-fit px-10 py-4 bg-gray-900 text-white text-sm tracking-widest uppercase hover:bg-gray-700
  transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? t.sending : t.submit}
          </button>
        </form>
      </div>
    );
  }