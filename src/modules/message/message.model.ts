import { Static, t } from 'elysia'

// Model Request Body Message
export const MessageModel = t.Object({
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
    error: 'Isi minimal satu subjek',
  }),
  messageBody: t.String({
    minLength: 10,
    maxLength: 2000,
    error: 'Pesan minimal 10 karakter dan maksimal 2000 karakter',
  }),
})
export type MessageProps = Static<typeof MessageModel>

// Model Params Message Id
export const ParamsMessageModel = t.Object({
  messageId: t.String({
    format: 'uuid',
    error: 'Format param message id tidak valid',
  }),
})
export type ParamsMessageProps = Static<typeof ParamsMessageModel>

// Definisikan dalam satu konstanta/enum
export const MessageStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  PROPOSAL_SENT: 'PROPOSAL_SENT',
  NEGOTIATION: 'NEGOTIATION',
  VERBAL_COMMITMENT: 'VERBAL_COMMITMENT',
  CLOSED_WON: 'CLOSED_WON',
  CLOSED_LOSS: 'CLOSED_LOSS',
  ON_HOLD: 'ON_HOLD',
} as const

// Gunakan di Model
export const MessageUpdateModel = t.Object({
  status: t.Enum(MessageStatus, {
    error: 'Status tidak valid. Pastikan status sesuai dengan alur CRM.',
  }),
})

export type MessageUpdateProps = Static<typeof MessageUpdateModel>
