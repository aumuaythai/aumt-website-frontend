import { Timestamp } from 'firebase/firestore'
import z from 'zod'

export const timestampSchema = z.custom<Timestamp>(
  (timestamp) => timestamp instanceof Timestamp,
  'Invalid timestamp'
)
