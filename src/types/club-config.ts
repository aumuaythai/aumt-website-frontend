import z from 'zod'
import { timestampSchema } from './util'

export const clubConfigSchema = z.object({
  summerSchoolFee: z.number().positive(),
  semesterOneFee: z.number().positive(),
  semesterTwoFee: z.number().positive(),
  fullYearFee: z.number().positive(),
  clubSignupSem: z.enum(['S1', 'S2', 'SS']),
  clubSignupStatus: z.enum(['open', 'closed']),
  bankAccountNumber: z.string().min(1),
  schedule: z.array(
    z.object({
      title: z.string().min(1),
      limit: z.number().positive(),
    })
  ),
  semesterOneDate: timestampSchema,
  semesterTwoDate: timestampSchema,
})

export type ClubConfig = z.infer<typeof clubConfigSchema>
