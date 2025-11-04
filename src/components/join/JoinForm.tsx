import PaymentInstructions from '@/components/utility/PaymentInstructions'
import { useConfig } from '@/context/ClubConfigProvider'
import { useCreateMember } from '@/services/member'
import { Member } from '@/types'
import {
  ETHNICITIES,
  GENDER,
  INITIAL_EXPERIENCE,
  MEMBERSHIP_PERIOD,
  PAYMENT_TYPE,
} from '@/types/Member'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  Form,
  Input,
  Radio,
  Select,
  Spin,
  Tooltip,
} from 'antd'
import { useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import z from 'zod'

const joinSchema = z.object({
  disclaimer: z.literal(
    true,
    'To proceed, you must confirm you have read and understood the agreement'
  ),
  email: z.email('Required'),
  password: z
    .string('Required')
    .min(8, 'Password must be at least 8 characters long'),
  isReturningMember: z.boolean('Required'),
  firstName: z.string('Required').min(1, 'Required'),
  lastName: z.string('Required').min(1, 'Required'),
  preferredName: z.string().optional(),
  ethnicity: z.enum(ETHNICITIES, 'Required'),
  gender: z.enum(GENDER, 'Required'),
  isUoAStudent: z.boolean('Required'),
  upi: z.string().optional(),
  studentId: z.string().optional(),
  emergencyContactName: z.string('Required').min(1, 'Required'),
  emergencyContactNumber: z
    .string('Required')
    .regex(/^\+?[0-9]+$/, 'Invalid phone number'),
  emergencyContactRelationship: z.string('Required').min(1, 'Required'),
  initialExperience: z.enum(INITIAL_EXPERIENCE, 'Required'),
  membership: z.enum(MEMBERSHIP_PERIOD, 'Required'),
  paymentType: z.enum(PAYMENT_TYPE, 'Required'),
})

type JoinForm = z.infer<typeof joinSchema>

export default function JoinForm() {
  const clubConfig = useConfig()
  const createMember = useCreateMember()

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    watch,
  } = useForm<JoinForm>({
    resolver: zodResolver(joinSchema),
  })

  async function handleValid(data: JoinForm) {
    const password = data.password
    const member: Member = {
      firstName: data.firstName,
      lastName: data.lastName,
      preferredName: data.preferredName,
      email: data.email,
      ethnicity: data.ethnicity,
      gender: data.gender,
      isReturningMember: data.isReturningMember,
      isUoAStudent: data.isUoAStudent,
      membership: data.membership,
      paymentType: data.paymentType,
      paid: false,
      timeJoinedMs: Date.now(),
      initialExperience: data.initialExperience,
      emergencyContactName: data.emergencyContactName,
      emergencyContactNumber: data.emergencyContactNumber,
      emergencyContactRelationship: data.emergencyContactRelationship,
      upi: data.upi,
      studentId: data.studentId,
    }

    await createMember.mutateAsync({ member, password })
  }

  const currentYear = new Date().getFullYear()
  const clubSignupSem = clubConfig?.clubSignupSem
  const isUoAStudent = watch('isUoAStudent')
  const paymentType = watch('paymentType')

  if (!clubConfig) {
    return (
      <div>
        <Spin />
      </div>
    )
  }

  return (
    <div className="max-w-2xl text-left mx-auto px-6 pt-8 flex flex-col gap-y-4">
      <div>
        <h1 className="text-2xl">
          AUMT {currentYear}
          {clubSignupSem === 'S1' && ' Semester 1 '}
          {clubSignupSem === 'S2' && ' Semester 2 '}
          {clubSignupSem === 'SS' && ' Summer School '}
          Sign-Ups
        </h1>
        <p>
          Welcome to AUMT! We look forward to you being a part of our club.
          Please fill in the form below to create an account. Your account will
          enable you to sign up to future training sessions and join events.
          Please contact us if you have any questions.
        </p>
      </div>

      <Form layout="vertical" onFinish={handleSubmit(handleValid)}>
        <div>
          <h2>Agreement</h2>
          <p>
            I understand that by filling out and submitting this form, I am
            partaking in the club activities at my own risk and all injuries
            sustained to any person or any damage to equipment during the
            ordinary course of training will not be the responsibility of the
            club. Any loss of equipment or personal belongings is the sole
            responsibility of the member and is not the responsibility of the
            club or training facility.
          </p>
          <FormItem control={control} name="disclaimer">
            <Checkbox>I have read and understood the above agreement</Checkbox>
          </FormItem>
        </div>

        <div>
          <h2>Login Details</h2>
          <FormItem control={control} name="email" label="Email">
            <Input type="email" />
          </FormItem>
          <FormItem control={control} name="password" label="Password">
            <Input.Password />
          </FormItem>
        </div>

        <div>
          <h2>Personal Details</h2>
          <FormItem
            control={control}
            name="isReturningMember"
            label="Are you a returning AUMT member? "
          >
            <Radio.Group>
              <Radio.Button value={true}>Yes</Radio.Button>
              <Radio.Button value={false}>No</Radio.Button>
            </Radio.Group>
          </FormItem>
          <FormItem control={control} name="firstName" label="First Name ">
            <Input />
          </FormItem>
          <FormItem control={control} name="lastName" label="Last Name ">
            <Input />
          </FormItem>
          <FormItem
            control={control}
            name="preferredName"
            label="Preferred Name"
          >
            <Input placeholder="If different from first name" />
          </FormItem>
          <FormItem control={control} name="ethnicity" label="Ethnicity">
            <Select>
              {ETHNICITIES.map((ethnicity) => (
                <Select.Option value={ethnicity}>{ethnicity}</Select.Option>
              ))}
            </Select>
          </FormItem>
          <FormItem control={control} name="gender" label="Gender">
            <Radio.Group>
              <Radio.Button value={'Male'}>Male</Radio.Button>
              <Radio.Button value={'Female'}>Female</Radio.Button>
              <Radio.Button value={'Non-binary'}>Non-binary</Radio.Button>
              <Radio.Button value={'Prefer not to say'}>
                Prefer not to say
              </Radio.Button>
            </Radio.Group>
          </FormItem>
        </div>

        <div>
          <h2>University Details</h2>
          <FormItem
            control={control}
            name="isUoAStudent"
            label="Are you a current UoA student? "
          >
            <Radio.Group>
              <Radio.Button value={true}>Yes</Radio.Button>
              <Radio.Button value={false}>No</Radio.Button>
            </Radio.Group>
          </FormItem>
          {isUoAStudent && (
            <div>
              <FormItem
                control={control}
                name="upi"
                label={
                  <span>
                    UPI&nbsp;
                    <Tooltip title="This is the part before your university email (e.g. jdoe295)">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                }
              >
                <Input />
              </FormItem>
              <FormItem control={control} name="studentId" label="Student Id">
                <Input />
              </FormItem>
            </div>
          )}
        </div>

        <div>
          <h2>Emergency Contact Details</h2>
          <FormItem control={control} name="emergencyContactName" label="Name">
            <Input />
          </FormItem>
          <FormItem
            control={control}
            name="emergencyContactNumber"
            label="Phone Number"
          >
            <Input type="tel" />
          </FormItem>
          <FormItem
            control={control}
            name="emergencyContactRelationship"
            label="Relationship"
          >
            <Input />
          </FormItem>
        </div>

        <div>
          <h2>Muay Thai Experience</h2>
          <FormItem
            control={control}
            name="initialExperience"
            label="Experience in Muay Thai"
          >
            <Radio.Group>
              <Radio.Button value="None">None</Radio.Button>
              <Radio.Button value="Beginner/Intermediate">
                Beginner/Intermediate
              </Radio.Button>
              <Radio.Button value="Advanced">Advanced</Radio.Button>
              <Radio.Button value="Other">Other</Radio.Button>
            </Radio.Group>
          </FormItem>
        </div>

        <div>
          <h2>Membership Payment</h2>
          <FormItem
            control={control}
            name="membership"
            label="Membership Duration"
          >
            <Radio.Group>
              {clubSignupSem === 'S1' && (
                <>
                  <Radio.Button value={'S1'}>Semester 1 Only</Radio.Button>
                  <Radio.Button value={'FY'}>
                    Full Year (Semester 1 and 2)
                  </Radio.Button>
                </>
              )}
              {clubSignupSem === 'SS' && (
                <Radio.Button value={'SS'}>Summer School Only</Radio.Button>
              )}
              {clubSignupSem === 'S2' && (
                <Radio.Button value={'S2'}>Semester 2 Only</Radio.Button>
              )}
            </Radio.Group>
          </FormItem>
          <FormItem control={control} name="paymentType" label="Payment Type">
            <Radio.Group>
              <Radio.Button value={'Bank Transfer'}>
                Bank Transfer (Best)
              </Radio.Button>
              <Radio.Button value={'Cash'}>Cash</Radio.Button>
              <Radio.Button value={'Other'}>Other</Radio.Button>
            </Radio.Group>
          </FormItem>
          {paymentType === 'Bank Transfer' && (
            <PaymentInstructions
              clubConfig={clubConfig}
              paymentType="Bank Transfer"
              membershipType={clubSignupSem}
            />
          )}
          {paymentType === 'Cash' && (
            <PaymentInstructions
              clubConfig={clubConfig}
              paymentType="Cash"
              membershipType={clubSignupSem}
            />
          )}
          {paymentType === 'Other' && (
            <PaymentInstructions
              clubConfig={clubConfig}
              paymentType="Other"
              membershipType={clubSignupSem}
            />
          )}
        </div>

        <Form.Item>
          <Button
            className="mt-5 mb-24"
            loading={isSubmitting}
            block
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
