// import { Button, Form, Input, InputNumber, Radio } from 'antd'
// import { FormInstance } from 'antd/lib/form'
// import React, { Component } from 'react'
// import { AumtCampSignupData } from '../../types'

// interface CampSignupFormProps {
//   includeNameAndEmail: boolean
//   submitting: boolean
//   isWaitlist: boolean
//   isCamp: boolean
//   onSubmit: (obj: AumtCampSignupData) => void
// }

// interface CampSignupFormState {
//   currentStay: string
// }

// export class CampSignupForm extends Component<
//   CampSignupFormProps,
//   CampSignupFormState
// > {
//   private formRef = React.createRef<FormInstance>()
//   constructor(props: CampSignupFormProps) {
//     super(props)
//     this.state = {
//       currentStay: '',
//     }
//   }

//   onSubmit = (vals: any) => {
//     const submitObj: AumtCampSignupData = {
//       name: vals.name || '',
//       email: vals.email || '',
//       phoneNumber: vals.phoneNumber || '',
//       ecName: vals.ecName || '',
//       ecPhoneNumber: vals.ecPhoneNumber || '',
//       ecRelation: vals.ecRelation || '',
//       dietaryRequirements: vals.dietaryRequirements || '',
//       medicalInfo: vals.medicalInfo || '',
//       hasFirstAid: vals.hasFirstAid || false,
//       daysStaying: 'full',
//       driverLicenseClass: vals.license || '',
//       insuranceDescription: vals.insuranceDescription || '',
//       carModel: vals.carModel || '',
//       seatsInCar: vals.seatsInCar || -1,
//     }
//     this.props.onSubmit(submitObj)
//   }

//   render() {
//     return (
//       <div className="text-left">
//         <Form onFinish={this.onSubmit} ref={this.formRef}>
//           <h4 className="!mt-[50px]">Contact</h4>
//           {this.props.includeNameAndEmail ? (
//             <div>
//               <Form.Item
//                 label="Full name"
//                 name="name"
//                 rules={[{ required: true }]}
//               >
//                 <Input />
//               </Form.Item>
//               <Form.Item
//                 label="Email"
//                 name="email"
//                 rules={[{ required: true }]}
//               >
//                 <Input />
//               </Form.Item>
//             </div>
//           ) : null}
//           {this.props.isCamp ? (
//             <div>
//               <Form.Item
//                 label="Phone Number"
//                 name="phoneNumber"
//                 rules={[{ required: true }]}
//               >
//                 <Input />
//               </Form.Item>
//               <h4 className="!mt-[50px]">Emergency Contact</h4>
//               <Form.Item
//                 label="Name"
//                 name="ecName"
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Emergency Contact Name Required',
//                   },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//               <Form.Item
//                 label="Phone"
//                 name="ecPhoneNumber"
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Emergency Contact Phone Required',
//                   },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//               <Form.Item
//                 label="Relationship"
//                 name="ecRelation"
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Emergency Contact Relationship Required',
//                   },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>
//               <h4 className="!mt-[50px]">Requirements</h4>
//               <Form.Item
//                 label="Dietary Requirements (optional)"
//                 name="dietaryRequirements"
//               >
//                 <Input placeholder="Allergies, vegetarian, etc" />
//               </Form.Item>
//               <Form.Item label="Medical Info (optional)" name="medicalInfo">
//                 <Input placeholder="Allergies, injuries, conditions, etc" />
//               </Form.Item>
//               <Form.Item
//                 label="Do you have a First Aid Certificate?"
//                 name="hasFirstAid"
//               >
//                 <Radio.Group name="FirstAidRadio">
//                   <Radio.Button value={true}>Yes</Radio.Button>
//                   <Radio.Button value={false}>No</Radio.Button>
//                 </Radio.Group>
//               </Form.Item>

//               <h4 className="!mt-[50px]">Driving (optional)</h4>
//               <p>
//                 If selected as a driver, you won't need to pay for fuel - we
//                 will reimburse any fuel costs.
//               </p>
//               <Form.Item name="license" label="License Class">
//                 <Radio.Group
//                   name="PaymentRadio"
//                   onChange={(e) => this.forceUpdate()}
//                 >
//                   <Radio.Button value={'Full 2+ years'}>
//                     Full 2+ years
//                   </Radio.Button>
//                   <Radio.Button value={'Full <2 years'}>
//                     Full &lt;2 years
//                   </Radio.Button>
//                   <Radio.Button value={'Restricted'}>Restricted</Radio.Button>
//                   <Radio.Button value={'Other'}>Other/None</Radio.Button>
//                 </Radio.Group>
//               </Form.Item>
//               {this.formRef?.current?.getFieldValue('license') &&
//               this.formRef?.current?.getFieldValue('license') !== 'Other' ? (
//                 <div>
//                   <p className="h-8 text-sm text-black/85">
//                     Do you own a car you would be willing to drive down?
//                   </p>
//                   <Form.Item name="ownsCar">
//                     <Radio.Group
//                       name="ownsCarRadio"
//                       onChange={(e) => this.forceUpdate()}
//                     >
//                       <Radio.Button value={true}>Yes</Radio.Button>
//                       <Radio.Button value={false}>No</Radio.Button>
//                     </Radio.Group>
//                   </Form.Item>
//                   {this.formRef?.current?.getFieldValue('ownsCar') ? (
//                     <div>
//                       <Form.Item
//                         label="How Many Seats (including driver)?"
//                         name="seatsInCar"
//                         rules={[{ required: true }]}
//                       >
//                         <InputNumber min={1} />
//                       </Form.Item>
//                       <Form.Item
//                         label="What is your car's year and model?"
//                         name="carModel"
//                         rules={[{ required: true }]}
//                       >
//                         <Input placeholder="E.g. 2004 Nissan March" />
//                       </Form.Item>
//                       <Form.Item
//                         label="Describe your insurance"
//                         name="insuranceDescription"
//                         rules={[{ required: true }]}
//                       >
//                         <Input />
//                       </Form.Item>
//                     </div>
//                   ) : null}
//                 </div>
//               ) : null}
//             </div>
//           ) : null}
//           <Button
//             loading={this.props.submitting}
//             htmlType="submit"
//             type="primary"
//             block
//             className="reserveEventSpotButton"
//           >
//             {this.props.isWaitlist ? 'Join Waitlist' : 'Reserve a Spot'}
//           </Button>
//         </Form>
//       </div>
//     )
//   }
// }

import { useAuth } from '@/context/AuthProvider'
import { generateMockUid } from '@/lib/utils'
import { useAddMemberToEvent } from '@/services/events'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Input, InputNumber, Radio } from 'antd'
import { FormInstance } from 'antd/lib/form'
import React, { Component } from 'react'
import { useForm } from 'react-hook-form'
import { FormItem } from 'react-hook-form-antd'
import { AumtCampSignupData, EventSignup, eventSignupSchema } from '../../types'

export default function EventSignupForm({ eventId }: { eventId: string }) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EventSignup>({
    resolver: zodResolver(eventSignupSchema),
  })

  const { user } = useAuth()
  const addMember = useAddMemberToEvent()

  async function onSubmit(data: EventSignup) {
    await addMember.mutateAsync({
      eventId,
      userId: user?.id ?? generateMockUid(),
      signupData: data,
    })
  }

  return (
    <main>
      <h2>Signup</h2>
      <Form onFinish={handleSubmit(onSubmit)}>
        <FormItem control={control} name="displayName" label="Display Name">
          <Input />
        </FormItem>
        <FormItem control={control} name="email" label="Email">
          <Input />
        </FormItem>
        <Button type="primary" htmlType="submit" loading={isSubmitting}>
          Submit
        </Button>
      </Form>
    </main>
  )
}
