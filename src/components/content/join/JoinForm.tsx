// import { QuestionCircleOutlined } from '@ant-design/icons'
// import {
//   Alert,
//   Button,
//   Form,
//   Input,
//   Radio,
//   Select,
//   Tooltip,
//   message,
//   notification,
// } from 'antd'
// import { FormInstance } from 'antd/lib/form'
// import React, { Component } from 'react'
// import { createUser } from '../../../services/auth'
// import DataFormatterUtil from '../../../services/data.util'
// import { setMember } from '../../../services/db'
// import validator from '../../../services/validator'
// import { AumtMember, ClubConfig } from '../../../types'
// import PaymentInstructions from '../../utility/PaymentInstructions'

// interface JoinFormProps {
//   isAdmin: boolean
//   clubConfig: ClubConfig | null
// }

// interface JoinFormState {
//   currentExperienceInMuayThai: string
//   submitting: boolean
// }

// export const ETHNICITIES = [
//   'New Zealand European',
//   'Māori',
//   'Chinese',
//   'Indian',
//   'Korean',
//   'British and Irish',
//   'African',
//   'Pasifika',
//   'Australian',
//   'Cambodian',
//   'Dutch',
//   'Filipino',
//   'German',
//   'Greek',
//   'Italian',
//   'Japanese',
//   'Latin American/Hispanic',
//   'Middle Eastern',
//   'Sri Lankan',
//   'Thai',
//   'Vietnamese',
//   'Other',
// ]

// export class JoinForm extends Component<JoinFormProps, JoinFormState> {
//   private formRef = React.createRef<FormInstance>()
//   private currentYear = new Date().getFullYear()

//   private clubSignupSem = this.props.clubConfig?.clubSignupSem

//   private verticalRadioStyle = {
//     display: 'block',
//   }

//   private alignInputLayout = {
//     labelCol: { span: 7 },
//     wrapperCol: { span: 17 },
//   }

//   constructor(props: JoinFormProps) {
//     super(props)
//     this.state = {
//       currentExperienceInMuayThai: '',
//       submitting: false,
//     }
//   }

//   private onSubmitFail = (obj: any) => {
//     const { errorFields } = obj
//     if (errorFields && errorFields.length) {
//       notification.error({
//         message: obj.errorFields[0].errors[0],
//         duration: 1.5,
//       })
//     }
//   }

//   private onSubmit = (values: any) => {
//     const {
//       UoaStudent: isUoAStudent,
//       interestedInCamp = 'No',
//       ReturningMember: isReturningMember,
//       FirstName: firstName,
//       LastName: lastName,
//       PreferredName: preferredName = '',
//       Ethnicity: ethnicity,
//       Gender: gender,
//       Experience: initialExperience,
//       EmergencyContactName,
//       EmergencyContactNumber,
//       EmergencyContactRelationship,
//       Paid: paid = 'No',
//       Membership: membership,
//       upi,
//       studentId,
//       email,
//       password,
//       uid,
//       Payment: paymentType,
//     } = values

//     const member: string | AumtMember = validator.createAumtMember({
//       firstName,
//       lastName,
//       preferredName,
//       ethnicity,
//       gender,
//       email,
//       isUoAStudent,
//       upi,
//       studentId,
//       membership,
//       initialExperience,
//       interestedInCamp,
//       paymentType,
//       paid,
//       timeJoinedMs: new Date().getTime(),
//       isReturningMember,
//       EmergencyContactName,
//       EmergencyContactNumber,
//       EmergencyContactRelationship,
//     })

//     if (typeof member === 'string') {
//       return message.error({
//         content: `Error creating member: ${member}`,
//       })
//     }

//     this.setState({
//       ...this.state,
//       submitting: true,
//     })

//     const key = 'submitFormMessage'

//     if (password) {
//       message.loading({ content: 'Creating User', key })
//       createUser(email, password)
//         .then((userCredential) => {
//           const { user } = userCredential
//           if (!user) {
//             throw new Error('No user returned from Firebase create')
//           }
//           return user.uid
//         })
//         .then((uid: string) => {
//           message.loading({ content: 'Adding to Club', key })
//           return setMember(uid, member)
//         })
//         .then(() => {
//           message.success({
//             content: 'You are now part of the club!',
//             key,
//             duration: 5,
//           })
//         })
//         .catch((err) => {
//           if (err.code === 'auth/email-already-in-use') {
//             return message.error({
//               content: 'Email already in use. Contact the AUMT committee ',
//               key,
//               duration: 5,
//             })
//           }
//           return message.error({
//             content: err.toString(),
//             key,
//             duration: 5,
//           })
//         })
//         .finally(() => {
//           this.setState({
//             ...this.state,
//             submitting: false,
//           })
//         })
//     } else if (uid) {
//       message.loading({ content: 'Adding to Club', key })
//       setMember(uid, member)
//         .then(() => {
//           message.success({
//             content: 'You are now part of the club!',
//             key,
//             duration: 5,
//           })
//         })
//         .catch((err) => {
//           if (err.code === 'auth/email-already-in-use') {
//             return message.error({
//               content: 'Email already in use. Contact the AUMT committee ',
//               key,
//               duration: 5,
//             })
//           }
//           return message.error({
//             content: err.toString(),
//             key,
//             duration: 5,
//           })
//         })
//         .finally(() => {
//           this.setState({
//             ...this.state,
//             submitting: false,
//           })
//         })
//     } else {
//       notification.error({
//         message: 'No UID or password, somethings very very wrong',
//       })
//     }
//   }

//   private copyText = (text: string) => {
//     DataFormatterUtil.copyText(text)
//   }

//   render() {
//     return (
//       <div className="max-w-[600px] text-left mx-auto px-8">
//         {!this.props.isAdmin ? (
//           <div>
//             <h2>
//               AUMT {this.currentYear}
//               {this.clubSignupSem === 'S1' ? ' Semester 1 ' : ''}
//               {this.clubSignupSem === 'S2' ? ' Semester 2 ' : ''}
//               {this.clubSignupSem === 'SS' ? ' Summer School ' : ''}
//               Club Sign-ups
//             </h2>

//             <p>
//               Welcome to AUMT! We look forward to you being a part of our club.
//               Please fill in the form below to create an account. Your account
//               will enable you to sign up to future training sessions and join
//               events. Please contact us if you have any questions.
//             </p>

//             <h3 className="!mt-12">Agreement:</h3>
//             <p>
//               I understand that by filling out and submitting this form, I am
//               partaking in the club activities at my own risk and all injuries
//               sustained to any person or any damage to equipment during the
//               ordinary course of training will not be the responsibility of the
//               club. Any loss of equipment or personal belongings is the sole
//               responsibility of the member and is not the responsibility of the
//               club or training facility.
//             </p>
//           </div>
//         ) : (
//           <div>
//             <Alert
//               type="warning"
//               message="NOTE TO ADMIN"
//               description="Adding a member here will only add them to the database and not give them a login (email and password).
//                     You must FIRST create an account for them at the Firebase console in the Authentication section and then enter their UID in the form below."
//             />
//           </div>
//         )}
//         <div className="joinFormEntry">
//           <Form
//             scrollToFirstError
//             ref={this.formRef}
//             onFinishFailed={this.onSubmitFail}
//             onFinish={this.onSubmit}
//           >
//             {!this.props.isAdmin ? (
//               <Form.Item
//                 name="Disclaimer"
//                 rules={[{ required: true }]}
//                 label="Have you read and understood the above agreement?"
//               >
//                 <Radio.Group name="DisclaimerRadio">
//                   <Radio value="Yes">Yes</Radio>
//                 </Radio.Group>
//               </Form.Item>
//             ) : null}

//             <div>
//               <h3 className="!mt-12">Login Details</h3>
//               {!this.props.isAdmin ? (
//                 <p>
//                   This is your account to sign in to this site for trainings and
//                   events. Your email here will be used both as your username for
//                   the account and as a point of contact for club announcements
//                   and invitations. You can reset your password at any time.
//                 </p>
//               ) : null}
//             </div>

//             <Form.Item
//               {...this.alignInputLayout}
//               rules={[{ required: true }]}
//               name="email"
//               label="Email"
//             >
//               <Input type="email" />
//             </Form.Item>

//             {!this.props.isAdmin ? (
//               <Form.Item
//                 {...this.alignInputLayout}
//                 rules={[{ required: true }]}
//                 name="password"
//                 label="Password"
//               >
//                 <Input.Password />
//               </Form.Item>
//             ) : (
//               <Form.Item
//                 {...this.alignInputLayout}
//                 rules={[{ required: true }]}
//                 name="uid"
//                 label="UID"
//                 help="Found in the Firebase Authentication section"
//               >
//                 <Input placeholder="See NOTE TO ADMIN" />
//               </Form.Item>
//             )}

//             <h3 className="!mt-12">Personal Details</h3>
//             <Form.Item
//               name="ReturningMember"
//               rules={[{ required: true }]}
//               label="Are you a returning AUMT member? "
//             >
//               <Radio.Group buttonStyle="solid" name="ReturningMemberRadio">
//                 <Radio.Button value={'Yes'}>Yes</Radio.Button>
//                 <Radio.Button value={'No'}>No</Radio.Button>
//               </Radio.Group>
//             </Form.Item>
//             <Form.Item
//               {...this.alignInputLayout}
//               name="FirstName"
//               rules={[{ required: true }]}
//               label="First Name "
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item
//               {...this.alignInputLayout}
//               name="LastName"
//               rules={[{ required: true }]}
//               label="Last Name "
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item
//               {...this.alignInputLayout}
//               name="PreferredName"
//               label="Preferred Name"
//             >
//               <Input placeholder="If different from first name" />
//             </Form.Item>

//             <Form.Item
//               name="Ethnicity"
//               label="Ethnicity"
//               rules={[{ required: true }]}
//               {...this.alignInputLayout}
//             >
//               <Select>
//                 {ETHNICITIES.map((ethnicity) => (
//                   <Select.Option value={ethnicity}>{ethnicity}</Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item
//               rules={[{ required: true }]}
//               name="Gender"
//               label="Gender"
//               {...this.alignInputLayout}
//             >
//               <Radio.Group
//                 name="GenderRadio"
//                 onChange={(v) =>
//                   this.setState({
//                     ...this.state,
//                   })
//                 }
//               >
//                 <Radio style={this.verticalRadioStyle} value={'Male'}>
//                   Male
//                 </Radio>
//                 <Radio style={this.verticalRadioStyle} value={'Female'}>
//                   Female
//                 </Radio>
//                 <Radio style={this.verticalRadioStyle} value={'Non-binary'}>
//                   Non-binary
//                 </Radio>
//                 <Radio
//                   style={this.verticalRadioStyle}
//                   value={'Prefer not to say'}
//                 >
//                   Prefer not to say
//                 </Radio>
//               </Radio.Group>
//             </Form.Item>

//             <h3 className="!mt-12">University Details</h3>
//             <Form.Item
//               name="UoaStudent"
//               rules={[{ required: true }]}
//               label="Are you a current UoA student? "
//             >
//               <Radio.Group
//                 buttonStyle="solid"
//                 name="UoaStudentRadio"
//                 onChange={(e) => this.forceUpdate()}
//               >
//                 <Radio.Button value={'Yes'}>Yes</Radio.Button>
//                 <Radio.Button value={'No'}>No</Radio.Button>
//               </Radio.Group>
//             </Form.Item>
//             {this.formRef.current?.getFieldValue('UoaStudent') !== 'No' ? (
//               <div>
//                 <Form.Item
//                   {...this.alignInputLayout}
//                   name="upi"
//                   label={
//                     <span>
//                       UPI&nbsp;
//                       <Tooltip title="This is the part before your university email (e.g. jdoe295)">
//                         <QuestionCircleOutlined />
//                       </Tooltip>
//                     </span>
//                   }
//                   rules={[{ required: true }]}
//                 >
//                   <Input />
//                 </Form.Item>
//                 <Form.Item
//                   {...this.alignInputLayout}
//                   name="studentId"
//                   rules={[{ required: true }]}
//                   label="Student Id"
//                 >
//                   <Input />
//                 </Form.Item>
//               </div>
//             ) : null}

//             <h3 className="!mt-12">Emergency Contact Details</h3>
//             <Form.Item
//               {...this.alignInputLayout}
//               rules={[{ required: true }]}
//               name="EmergencyContactName"
//               label="Name"
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item
//               {...this.alignInputLayout}
//               rules={[{ required: true }]}
//               name="EmergencyContactNumber"
//               label="Phone Number"
//             >
//               <Input type="tel" />
//             </Form.Item>
//             <Form.Item
//               {...this.alignInputLayout}
//               rules={[{ required: true }]}
//               name="EmergencyContactRelationship"
//               label="Relationship"
//             >
//               <Input />
//             </Form.Item>

//             <h3 className="!mt-12">Muay Thai Experience</h3>
//             <Form.Item
//               rules={[{ required: true }]}
//               name="Experience"
//               label="Experience in Muay Thai"
//             >
//               <Radio.Group
//                 name="ExperienceRadio"
//                 onChange={(v) =>
//                   this.setState({
//                     ...this.state,
//                     currentExperienceInMuayThai: v.target.value,
//                   })
//                 }
//               >
//                 <Radio style={this.verticalRadioStyle} value={'None'}>
//                   None
//                 </Radio>
//                 <Radio
//                   style={this.verticalRadioStyle}
//                   value={'Beginner/Intermediate'}
//                 >
//                   Beginner/Intermediate
//                 </Radio>
//                 <Radio style={this.verticalRadioStyle} value={'Advanced'}>
//                   Advanced
//                 </Radio>
//                 <Radio style={this.verticalRadioStyle} value={'Other'}>
//                   Other
//                   {this.state.currentExperienceInMuayThai === 'Other' ? (
//                     <Input
//                       style={{
//                         width: 100,
//                         marginLeft: 10,
//                       }}
//                     />
//                   ) : null}
//                 </Radio>
//               </Radio.Group>
//             </Form.Item>

//             <h3 className="!mt-12">Membership Payment</h3>
//             <Form.Item
//               name="Membership"
//               rules={[{ required: true }]}
//               label="Membership Duration"
//             >
//               <Radio.Group
//                 buttonStyle="solid"
//                 name="MembershipRadio"
//                 value={this.props.clubConfig?.clubSignupSem}
//               >
//                 {this.props.clubConfig?.clubSignupSem === 'S1' ? (
//                   <>
//                     <Radio.Button value={'S1'}>Semester 1 Only</Radio.Button>
//                     <Radio.Button value={'FY'}>
//                       Full Year (Semester 1 and 2)
//                     </Radio.Button>
//                   </>
//                 ) : null}

//                 {this.props.clubConfig?.clubSignupSem === 'SS' ? (
//                   <Radio.Button value={'SS'}>Summer School Only</Radio.Button>
//                 ) : null}

//                 {this.props.clubConfig?.clubSignupSem === 'S2' ? (
//                   <Radio.Button value={'S2'}>Semester 2 Only</Radio.Button>
//                 ) : null}
//               </Radio.Group>
//             </Form.Item>

//             <Form.Item
//               name="Payment"
//               rules={[{ required: true }]}
//               label="Payment Type"
//             >
//               <Radio.Group
//                 buttonStyle="solid"
//                 name="PaymentRadio"
//                 onChange={(e) => this.forceUpdate()}
//               >
//                 <Radio.Button value={'Bank Transfer'}>
//                   Bank Transfer (Best)
//                 </Radio.Button>
//                 <Radio.Button value={'Cash'}>Cash</Radio.Button>
//                 <Radio.Button value={'Other'}>Other</Radio.Button>
//               </Radio.Group>
//             </Form.Item>

//             {this.props.isAdmin && (
//               <Form.Item name="Paid" rules={[{ required: true }]} label="Paid?">
//                 <Radio.Group buttonStyle="solid" name="PaidRadio">
//                   <Radio.Button value={'Yes'}>Yes</Radio.Button>
//                   <Radio.Button value={'No'}>No</Radio.Button>
//                 </Radio.Group>
//               </Form.Item>
//             )}

//             {!this.props.isAdmin &&
//             this.formRef.current?.getFieldValue('Payment') ===
//               'Bank Transfer' ? (
//               <PaymentInstructions
//                 clubConfig={this.props.clubConfig}
//                 paymentType="Bank Transfer"
//                 membershipType={this.props.clubConfig?.clubSignupSem}
//               />
//             ) : null}

//             {!this.props.isAdmin &&
//             this.formRef.current?.getFieldValue('Payment') === 'Cash' ? (
//               <PaymentInstructions
//                 clubConfig={this.props.clubConfig}
//                 paymentType="Cash"
//                 membershipType={this.props.clubConfig?.clubSignupSem}
//               />
//             ) : null}

//             {!this.props.isAdmin &&
//             this.formRef.current?.getFieldValue('Payment') === 'Other' ? (
//               <PaymentInstructions
//                 clubConfig={this.props.clubConfig}
//                 paymentType="Other"
//                 membershipType={this.props.clubConfig?.clubSignupSem}
//               />
//             ) : null}

//             <Form.Item>
//               <Button
//                 className="mt-5 mb-24"
//                 loading={this.state.submitting}
//                 block
//                 type="primary"
//                 htmlType="submit"
//               >
//                 Submit
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>
//       </div>
//     )
//   }
// }

import { QuestionCircleOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import {
  Alert,
  Button,
  Checkbox,
  Form,
  Input,
  Radio,
  Select,
  Tooltip,
  message,
  notification,
} from 'antd'
import { FormInstance } from 'antd/lib/form'
import { min } from 'moment'
import React, { Component } from 'react'
import { FieldErrors, useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { UNSAFE_getTurboStreamSingleFetchDataStrategy } from 'react-router'
import z from 'zod'
import { useConfig } from '../../../context/ClubConfigProvider'
import { createUser } from '../../../services/auth'
import DataFormatterUtil from '../../../services/data.util'
import { setMember } from '../../../services/db'
import validator from '../../../services/validator'
import { AumtMember, ClubConfig } from '../../../types'
import PaymentInstructions from '../../utility/PaymentInstructions'

interface JoinFormProps {
  isAdmin: boolean
  clubConfig: ClubConfig | null
}

interface JoinFormState {
  currentExperienceInMuayThai: string
  submitting: boolean
}

export const ETHNICITIES = [
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
type Ethnicities = (typeof ETHNICITIES)[number]

const GENDER = ['Male', 'Female', 'Non-binary', 'Prefer not to say'] as const
type Gender = (typeof GENDER)[number]

const INITIAL_EXPERIENCE = [
  'None',
  'Beginner/Intermediate',
  'Advanced',
  'Other',
] as const
type InitialExperience = (typeof INITIAL_EXPERIENCE)[number]

const MEMBERSHIP_PERIOD = ['S1', 'S2', 'FY', 'SS'] as const
type MembershipPeriod = (typeof MEMBERSHIP_PERIOD)[number]

const PAYMENT_TYPE = ['Cash', 'Bank Transfer', 'Other'] as const
type PaymentType = (typeof PAYMENT_TYPE)[number]

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

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
    watch,
  } = useForm<JoinForm>({
    resolver: zodResolver(joinSchema),
  })

  const createMember = useMutation({
    mutationFn: async ({
      member,
      password,
    }: {
      member: AumtMember
      password: string
    }) => {
      const user = await createUser(member.email, password)
      if (!user.user?.uid) {
        throw new Error('Failed to create user')
      }

      await setMember(user.user.uid, member)
    },
    onError: (error) => {
      notification.error({
        message: error.toString(),
      })
    },
  })

  async function handleValid(data: JoinForm) {
    const password = data.password
    const member: AumtMember = {
      firstName: data.firstName,
      lastName: data.lastName,
      preferredName: data.preferredName ?? null,
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
      upi: data.upi ?? null,
      studentId: data.studentId ?? null,
      notes: null,
      isInterestedInCamp: false,
    }

    console.log(member)

    await createMember.mutateAsync({ member, password })
  }

  function handleInvalid(errors: FieldErrors<JoinForm>) {
    console.log(errors)
  }

  const currentYear = new Date().getFullYear()
  const clubSignupSem = clubConfig?.clubSignupSem
  const isUoAStudent = watch('isUoAStudent')
  const paymentType = watch('paymentType')

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

      <Form
        layout="vertical"
        onFinish={handleSubmit(handleValid, handleInvalid)}
      >
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
