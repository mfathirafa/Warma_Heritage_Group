import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactPayload {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 254, company: 100, subject: 200, message: 5000 } as const;

function validate(body: unknown): { data: ContactPayload | null; errors: string[] } {
  const errors: string[] = [];
  if (typeof body !== 'object' || body === null) {
    return { data: null, errors: ['Invalid request body.'] };
  }

  const b = body as Record<string, unknown>;
  const data: ContactPayload = {
    name: typeof b.name === 'string' ? b.name.trim() : '',
    email: typeof b.email === 'string' ? b.email.trim() : '',
    company: typeof b.company === 'string' ? b.company.trim() : '',
    subject: typeof b.subject === 'string' ? b.subject.trim() : '',
    message: typeof b.message === 'string' ? b.message.trim() : '',
  };

  if (!data.name) errors.push('Nama wajib diisi.');
  else if (data.name.length > LIMITS.name) errors.push(`Nama maksimal ${LIMITS.name} karakter.`);
  if (!EMAIL_RE.test(data.email)) errors.push('Email tidak valid.');
  else if (data.email.length > LIMITS.email) errors.push(`Email maksimal ${LIMITS.email} karakter.`);
  if (data.company.length > LIMITS.company) errors.push(`Perusahaan maksimal ${LIMITS.company} karakter.`);
  if (!data.subject) errors.push('Subjek wajib diisi.');
  else if (data.subject.length > LIMITS.subject) errors.push(`Subjek maksimal ${LIMITS.subject} karakter.`);
  if (!data.message) errors.push('Pesan wajib diisi.');
  else if (data.message.length > LIMITS.message) errors.push(`Pesan maksimal ${LIMITS.message} karakter.`);

  return errors.length ? { data: null, errors } : { data, errors: [] };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { data, errors } = validate(body);
  if (!data) {
    return NextResponse.json({ error: errors[0], errors }, { status: 400 });
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.error('[/api/contact] SMTP_USER/SMTP_PASS belum dikonfigurasi.');
    return NextResponse.json({ error: 'Email belum dikonfigurasi.' }, { status: 500 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Warma Heritage Group" <${user}>`,
      to: user,
      replyTo: data.email,
      subject: `[WHG Contact] ${data.subject}`,
      text: [
        `Nama: ${data.name}`,
        `Email: ${data.email}`,
        data.company ? `Perusahaan: ${data.company}` : null,
        `Subjek: ${data.subject}`,
        '',
        data.message,
      ]
        .filter((line): line is string => line !== null)
        .join('\n'),
    });
  } catch (err) {
    console.error('[/api/contact] sendMail gagal:', err);
    return NextResponse.json({ error: 'Gagal mengirim pesan. Coba lagi nanti.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
