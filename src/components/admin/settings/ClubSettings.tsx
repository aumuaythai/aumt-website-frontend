import { useConfig } from '@/context/ClubConfigProvider'
import { useUpdateConfig } from '@/services/config'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Input, InputNumber, List, Radio, Spin, Switch } from 'antd'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'

const clubConfigSchema = z.object({
  summerSchoolFee: z.number().positive(),
  semesterOneFee: z.number().positive(),
  semesterTwoFee: z.number().positive(),
  fullYearFee: z.number().positive(),
  clubSignupSem: z.enum(['S1', 'S2', 'SS']),
  clubSignupStatus: z.enum(['open', 'closed']),
  bankAccountNumber: z.string().min(1),
  // phoneNumber: z.string().min(1),
  // address: z.string().min(1),
  // email: z.email(),
})

type ClubConfigForm = z.infer<typeof clubConfigSchema>

export default function ClubSettings() {
  const clubConfig = useConfig()
  const queryClient = useQueryClient()

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<ClubConfigForm>({
    resolver: zodResolver(clubConfigSchema),
    defaultValues: {
      summerSchoolFee: clubConfig?.summerSchoolFee,
      semesterOneFee: clubConfig?.semesterOneFee,
      semesterTwoFee: clubConfig?.semesterTwoFee,
      fullYearFee: clubConfig?.fullYearFee,
      clubSignupSem: clubConfig?.clubSignupSem,
      clubSignupStatus: clubConfig?.clubSignupStatus,
      bankAccountNumber: clubConfig?.bankAccountNumber,
      // phoneNumber: clubConfig?.phoneNumber,
      // address: clubConfig?.address,
      // email: clubConfig?.email,
    },
  })

  const updateConfig = useUpdateConfig()

  function handleSave(data: ClubConfigForm) {
    updateConfig.mutate(data)
  }

  if (!clubConfig) {
    return (
      <div>
        Loading club config <Spin />
      </div>
    )
  }

  return (
    <div className="text-left mx-auto pb-10 w-full max-w-2xl pt-8">
      <h1 className="text-2xl">Club Settings</h1>

      <List bordered header={<h2>Memberhip Prices ($)</h2>} className="!mt-5">
        <List.Item>
          <span>Summer School</span>
          <Controller
            control={control}
            name="summerSchoolFee"
            render={({ field: { value, onChange } }) => (
              <InputNumber value={value} onChange={onChange} />
            )}
          />
        </List.Item>
        <List.Item>
          <span>Semester 1</span>
          <Controller
            control={control}
            name="semesterOneFee"
            render={({ field: { value, onChange } }) => (
              <InputNumber value={value} onChange={onChange} />
            )}
          />
        </List.Item>
        <List.Item>
          <span>Semester 2</span>
          <Controller
            control={control}
            name="semesterTwoFee"
            render={({ field: { value, onChange } }) => (
              <InputNumber value={value} onChange={onChange} />
            )}
          />
        </List.Item>
        <List.Item>
          <span>Full Year</span>
          <Controller
            control={control}
            name="fullYearFee"
            render={({ field: { value, onChange } }) => (
              <InputNumber value={value} onChange={onChange} />
            )}
          />
        </List.Item>
      </List>

      <List bordered header={<h2>Join Form</h2>} className="!mt-5">
        <List.Item>
          <span>Status</span>
          <Controller
            control={control}
            name="clubSignupStatus"
            render={({ field: { value, onChange } }) => (
              <Switch
                checked={value === 'open'}
                checkedChildren="Open"
                unCheckedChildren="Closed"
                onChange={(checked) => onChange(checked ? 'open' : 'closed')}
              />
            )}
          />
        </List.Item>
        <List.Item>
          <span>Semester</span>
          <Controller
            control={control}
            name="clubSignupSem"
            render={({ field: { value, onChange } }) => (
              <Radio.Group value={value} onChange={onChange}>
                <Radio.Button value="S1">Sem 1</Radio.Button>
                <Radio.Button value="S2">Sem 2</Radio.Button>
                <Radio.Button value="SS">Summer School</Radio.Button>
              </Radio.Group>
            )}
          />
        </List.Item>
      </List>

      <List bordered header={<h2>Club Credentials</h2>} className="!mt-5">
        <List.Item>
          <span>Bank Account Number</span>
          <Controller
            control={control}
            name="bankAccountNumber"
            render={({ field: { value, onChange } }) => (
              <Input value={value} onChange={onChange} />
            )}
          />
        </List.Item>
      </List>

      <Button
        type="primary"
        onClick={handleSubmit(handleSave)}
        loading={isSubmitting || updateConfig.isPending}
        className="!mt-5"
      >
        Save Settings
      </Button>
    </div>
  )
}
