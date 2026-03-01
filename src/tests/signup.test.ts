import admin from 'firebase-admin'
import { describe, beforeAll, afterAll, it, expect } from 'vitest'

// ── Firebase Admin setup against emulators ─────────────────────────

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'

const app = admin.initializeApp({ projectId: 'aumt-website' })
const db = admin.firestore()
const auth = admin.auth()

// ── Test data constants ────────────────────────────────────────────

const ETHNICITIES = [
  'New Zealand European',
  'Māori',
  'Chinese',
  'Indian',
  'Korean',
  'British and Irish',
  'African',
  'Pasifika',
  'Australian',
  'Cambodian',
  'Dutch',
  'Filipino',
  'German',
  'Greek',
  'Italian',
  'Japanese',
  'Latin American/Hispanic',
  'Middle Eastern',
  'Sri Lankan',
  'Thai',
  'Vietnamese',
  'Other',
] as const

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'] as const
const EXPERIENCES = [
  'None',
  'Beginner/Intermediate',
  'Advanced',
  'Other',
] as const
const MEMBERSHIPS = ['S1', 'S2', 'FY', 'SS'] as const
const PAYMENT_TYPES = ['Cash', 'Bank Transfer', 'Other'] as const

const FIRST_NAMES = [
  'Aroha',
  'Ben',
  'Charlotte',
  'David',
  'Emily',
  'Finn',
  'Grace',
  'Hemi',
  'Isabella',
  'Jack',
  'Kaia',
  'Liam',
  'Mia',
  'Noah',
  'Olivia',
  'Phoebe',
  'Quentin',
  'Ruby',
  'Sam',
  'Tane',
  'Uma',
  'Vince',
  'Willow',
  'Xander',
  'Yuki',
  'Zara',
  'Aiden',
  'Bella',
  'Connor',
  'Daisy',
  'Ethan',
  'Freya',
  'George',
  'Hannah',
  'Isaac',
  'Jade',
  'Kai',
  'Luna',
  'Max',
  'Ngaio',
  'Oscar',
  'Poppy',
  'Quinn',
  'Riley',
  'Sofia',
  'Tyler',
  'Ursula',
  'Violet',
  'Wesley',
  'Zoe',
]

const LAST_NAMES = [
  'Smith',
  'Williams',
  'Brown',
  'Taylor',
  'Wilson',
  'Anderson',
  'Thomas',
  'Walker',
  'Harris',
  'Robinson',
  'Chen',
  'Kim',
  'Singh',
  'Patel',
  'Nguyen',
  'Garcia',
  'Martinez',
  'Lopez',
  'Lee',
  'Clark',
  'Lewis',
  'Young',
  'Hall',
  'Allen',
  'King',
  'Wright',
  'Scott',
  'Green',
  'Adams',
  'Baker',
  'Nelson',
  'Carter',
  'Mitchell',
  'Perez',
  'Roberts',
  'Turner',
  'Phillips',
  'Campbell',
  'Parker',
  'Evans',
  'Edwards',
  'Collins',
  'Stewart',
  'Morris',
  'Murphy',
  'Rivera',
  'Cook',
  'Rogers',
  'Morgan',
  'Cooper',
]

const RELATIONSHIPS = [
  'Mother',
  'Father',
  'Sister',
  'Brother',
  'Partner',
  'Spouse',
  'Friend',
  'Aunt',
  'Uncle',
  'Grandparent',
]

// ── Helpers ────────────────────────────────────────────────────────

function pick<T>(arr: readonly T[], index: number): T {
  return arr[index % arr.length]
}

function generatePhone(i: number): string {
  return `+6421${String(i).padStart(7, '0')}`
}

interface TestUser {
  email: string
  password: string
  member: {
    firstName: string
    lastName: string
    preferredName?: string
    email: string
    ethnicity: string
    gender: string
    membership: string
    paymentType: string
    isReturningMember: boolean
    paid: boolean
    timeJoinedMs: number
    isUoAStudent: boolean
    upi?: string
    studentId?: string
    initialExperience: string
    emergencyContactName: string
    emergencyContactNumber: string
    emergencyContactRelationship: string
  }
}

function generateTestUsers(count: number): TestUser[] {
  const users: TestUser[] = []

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[i]
    const lastName = LAST_NAMES[i]
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.test${i}@example.com`
    const isUoA = i % 3 !== 2 // ~66% are UoA students
    const hasPreferredName = i % 4 === 0

    users.push({
      email,
      password: `TestPass${i}!secure`,
      member: {
        firstName,
        lastName,
        ...(hasPreferredName && {
          preferredName: `${firstName.charAt(0)}${lastName.charAt(0)}`,
        }),
        email,
        ethnicity: pick(ETHNICITIES, i),
        gender: pick(GENDERS, i),
        membership: pick(MEMBERSHIPS, i),
        paymentType: pick(PAYMENT_TYPES, i),
        isReturningMember: i % 5 === 0,
        paid: false,
        timeJoinedMs: Date.now(),
        isUoAStudent: isUoA,
        ...(isUoA && {
          upi: `${firstName.charAt(0).toLowerCase()}${lastName.substring(0, 3).toLowerCase()}${String(100 + i)}`,
          studentId: String(100000000 + i),
        }),
        initialExperience: pick(EXPERIENCES, i),
        emergencyContactName: `EC ${pick(FIRST_NAMES, i + 25)} ${pick(LAST_NAMES, i + 25)}`,
        emergencyContactNumber: generatePhone(i),
        emergencyContactRelationship: pick(RELATIONSHIPS, i),
      },
    })
  }

  return users
}

// ── State shared across tests ──────────────────────────────────────

const NUM_USERS = 50
const testUsers = generateTestUsers(NUM_USERS)
const createdUids: string[] = []
let testTrainingId: string

// ── Tests ──────────────────────────────────────────────────────────

describe('Signup flow: 50 users end-to-end', () => {
  beforeAll(async () => {
    // Clean up any pre-existing test users from previous runs
    const testEmails = testUsers.map((u) => u.email)
    const listResult = await auth.listUsers(1000)
    for (const user of listResult.users) {
      if (user.email && testEmails.includes(user.email)) {
        // Delete Firestore member doc and auth user
        await db.collection('members').doc(user.uid).delete().catch(() => {})
        await auth.deleteUser(user.uid)
      }
    }

    // Clean up any test trainings from previous runs
    const trainingsSnap = await db.collection('weekly_trainings').get()
    for (const doc of trainingsSnap.docs) {
      if (doc.data().title === 'Test Weekly Training') {
        await doc.ref.delete()
      }
    }

    // Ensure the config document exists so the join form would load
    const configRef = db.collection('config').doc('config')
    const configSnap = await configRef.get()
    if (!configSnap.exists) {
      await configRef.set({
        summerSchoolFee: 30,
        semesterOneFee: 50,
        semesterTwoFee: 50,
        fullYearFee: 80,
        clubSignupSem: 'S1',
        clubSignupStatus: 'open',
        bankAccountNumber: '12-3456-7890123-00',
        schedule: [
          { title: 'Monday 6-8pm — Beginners', limit: 30 },
          { title: 'Wednesday 6-8pm — Intermediate', limit: 25 },
          { title: 'Friday 6-8pm — Advanced', limit: 20 },
        ],
        semesterOneDate: admin.firestore.Timestamp.fromDate(
          new Date('2026-03-02')
        ),
        semesterTwoDate: admin.firestore.Timestamp.fromDate(
          new Date('2026-07-20')
        ),
      })
    }
  })

  afterAll(async () => {
    await app.delete()
  })

  // ── 1. Create 50 users ────────────────────────────────────────

  it('should create 50 users with Firebase Auth and Firestore member documents', async () => {
    for (const user of testUsers) {
      // Create auth user (mirrors createUserWithEmailAndPassword)
      const authUser = await auth.createUser({
        email: user.email,
        password: user.password,
      })

      // Create member document keyed by uid (mirrors setDoc)
      await db
        .collection('members')
        .doc(authUser.uid)
        .set(user.member)

      createdUids.push(authUser.uid)
    }

    expect(createdUids).toHaveLength(NUM_USERS)
  })

  // ── 2. Verify all 50 users exist in Firestore ────────────────

  it('should have all 50 member documents in Firestore with correct data', async () => {
    const snapshot = await db.collection('members').get()
    // Filter to only our test users (in case there's pre-existing data)
    const testDocs = snapshot.docs.filter((doc) =>
      createdUids.includes(doc.id)
    )
    expect(testDocs).toHaveLength(NUM_USERS)

    for (let i = 0; i < NUM_USERS; i++) {
      const uid = createdUids[i]
      const docSnap = await db.collection('members').doc(uid).get()
      const data = docSnap.data()!

      const expected = testUsers[i].member

      expect(data.firstName).toBe(expected.firstName)
      expect(data.lastName).toBe(expected.lastName)
      expect(data.email).toBe(expected.email)
      expect(data.ethnicity).toBe(expected.ethnicity)
      expect(data.gender).toBe(expected.gender)
      expect(data.membership).toBe(expected.membership)
      expect(data.paymentType).toBe(expected.paymentType)
      expect(data.isReturningMember).toBe(expected.isReturningMember)
      expect(data.paid).toBe(false)
      expect(data.isUoAStudent).toBe(expected.isUoAStudent)
      expect(data.initialExperience).toBe(expected.initialExperience)
      expect(data.emergencyContactName).toBe(expected.emergencyContactName)
      expect(data.emergencyContactNumber).toBe(expected.emergencyContactNumber)
      expect(data.emergencyContactRelationship).toBe(
        expected.emergencyContactRelationship
      )

      if (expected.isUoAStudent) {
        expect(data.upi).toBe(expected.upi)
        expect(data.studentId).toBe(expected.studentId)
      }

      if (expected.preferredName) {
        expect(data.preferredName).toBe(expected.preferredName)
      }
    }
  })

  it('should have all 50 auth users with matching emails', async () => {
    for (let i = 0; i < NUM_USERS; i++) {
      const authUser = await auth.getUser(createdUids[i])
      expect(authUser.email).toBe(testUsers[i].email)
    }
  })

  // ── 3. Mark all 50 users as paid (admin dashboard flow) ──────

  it('should mark all 50 users as paid', async () => {
    const batch = db.batch()

    for (const uid of createdUids) {
      batch.update(db.collection('members').doc(uid), { paid: true })
    }

    await batch.commit()

    // Verify all are now paid
    for (const uid of createdUids) {
      const doc = await db.collection('members').doc(uid).get()
      expect(doc.data()!.paid).toBe(true)
    }
  })

  // ── 4. Verify paid users can see training schedule ───────────

  it('should create a training with paymentLock enabled', async () => {
    const now = new Date()
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const training = {
      title: 'Test Weekly Training',
      opens: admin.firestore.Timestamp.fromDate(now),
      closes: admin.firestore.Timestamp.fromDate(oneWeekFromNow),
      sessions: [
        {
          title: 'Beginners Session',
          limit: 30,
          members: {},
        },
        {
          title: 'Advanced Session',
          limit: 20,
          members: {},
        },
      ],
      openToPublic: false,
      notes: 'Test training for signup verification',
      maxSessions: 1,
      semester: 'S1',
      paymentLock: true,
    }

    const docRef = await db.collection('weekly_trainings').add(training)
    testTrainingId = docRef.id
    expect(testTrainingId).toBeTruthy()
  })

  it('paid users should not be blocked by paymentLock', async () => {
    // Simulate the frontend logic from Trainings.tsx:
    // if (!user.paid && training.paymentLock) → blocked
    // else → can see training form
    const trainingDoc = await db
      .collection('weekly_trainings')
      .doc(testTrainingId)
      .get()
    const training = trainingDoc.data()!

    expect(training.paymentLock).toBe(true)
    expect(training.openToPublic).toBe(false)

    for (const uid of createdUids) {
      const memberDoc = await db.collection('members').doc(uid).get()
      const member = memberDoc.data()!

      const isBlocked = !member.paid && training.paymentLock
      expect(isBlocked).toBe(false)

      // Check membership matches semester (for S1 members or FY members)
      const isMembershipOutOfDate =
        (member.membership === 'FY' && training.semester === 'SS') ||
        (member.membership !== 'FY' && member.membership !== training.semester)

      // Users with matching semester should see the training form
      if (!isMembershipOutOfDate) {
        // These users can fully access the training signup
        expect(member.paid).toBe(true)
      }
    }
  })

  it('unpaid users should be blocked by paymentLock', async () => {
    // Pick first user, set them back to unpaid, verify they'd be blocked
    const testUid = createdUids[0]
    await db.collection('members').doc(testUid).update({ paid: false })

    const memberDoc = await db.collection('members').doc(testUid).get()
    const member = memberDoc.data()!

    const trainingDoc = await db
      .collection('weekly_trainings')
      .doc(testTrainingId)
      .get()
    const training = trainingDoc.data()!

    const isBlocked = !member.paid && training.paymentLock
    expect(isBlocked).toBe(true)

    // Restore paid status
    await db.collection('members').doc(testUid).update({ paid: true })
  })

  it('all users should see training schedule from config', async () => {
    const configDoc = await db.collection('config').doc('config').get()
    const config = configDoc.data()!

    // The schedule from config is always visible to everyone (shown when no
    // open trainings exist). It is not gated by payment status — it's public.
    expect(config.schedule).toBeDefined()
    expect(config.schedule.length).toBeGreaterThanOrEqual(1)

    for (const entry of config.schedule) {
      expect(entry.title).toBeTruthy()
      expect(Number(entry.limit)).toBeGreaterThan(0)
    }
  })

  // ── 5. Data variety verification ─────────────────────────────

  it('should have diverse user data across all 50 members', async () => {
    const snapshot = await db.collection('members').get()
    const testDocs = snapshot.docs.filter((doc) =>
      createdUids.includes(doc.id)
    )

    const ethnicities = new Set<string>()
    const genders = new Set<string>()
    const memberships = new Set<string>()
    const paymentTypes = new Set<string>()
    const experiences = new Set<string>()
    let uoaStudentCount = 0
    let returningCount = 0
    let preferredNameCount = 0

    for (const doc of testDocs) {
      const data = doc.data()
      ethnicities.add(data.ethnicity)
      genders.add(data.gender)
      memberships.add(data.membership)
      paymentTypes.add(data.paymentType)
      experiences.add(data.initialExperience)
      if (data.isUoAStudent) uoaStudentCount++
      if (data.isReturningMember) returningCount++
      if (data.preferredName) preferredNameCount++
    }

    // Verify we have diversity in the data
    expect(ethnicities.size).toBeGreaterThanOrEqual(10)
    expect(genders.size).toBe(4)
    expect(memberships.size).toBe(4)
    expect(paymentTypes.size).toBe(3)
    expect(experiences.size).toBe(4)
    expect(uoaStudentCount).toBeGreaterThan(0)
    expect(uoaStudentCount).toBeLessThan(NUM_USERS) // not all are UoA
    expect(returningCount).toBeGreaterThan(0)
    expect(returningCount).toBeLessThan(NUM_USERS) // not all are returning
    expect(preferredNameCount).toBeGreaterThan(0)
    expect(preferredNameCount).toBeLessThan(NUM_USERS)
  })
})
