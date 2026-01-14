import { Static, t } from 'elysia'

export const MessageCreateModels = t.Object({
  senderName: t.String({
    minLength: 3,
    maxLength: 50,
    error: 'Nama pengirim harus antara 3 sampai 50 karakter',
  }),
  senderEmail: t.String({
    format: 'email',
    error: 'Format email tidak valid',
  }),
  organizationName: t.String({
    minLength: 2,
    maxLength: 100,
    error: 'Nama organisasi minimal 2 karakter',
  }),
  senderPhone: t.String({
    pattern: '^[0-9]{10,15}$',
    error: 'Nomor telepon harus berupa angka (10-15 digit)',
  }),
  subject: t.Array(t.String(), {
    minItems: 1,
    error: 'Pilih minimal satu subjek',
  }),
  messageBody: t.String({
    minLength: 10,
    maxLength: 2000,
    error: 'Pesan terlalu pendek (minimal 10 karakter) atau terlalu panjang',
  }),
})

export type MessageCreateProps = Static<typeof MessageCreateModels>
