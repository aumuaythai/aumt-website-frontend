import { useConfig, useUpdateConfig } from '@/services/config'
import { ClubConfig, clubConfigSchema } from '@/types'
import { PlusCircleOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Input,
  InputNumber,
  List,
  notification,
  Radio,
  Spin,
  Switch,
} from 'antd'
import { ExternalLink, MinusCircle } from 'lucide-react'
import {
  Controller,
  FieldErrors,
  useFieldArray,
  useForm,
} from 'react-hook-form'

export default function ClubSettings() {
  const { data: clubConfig } = useConfig()

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<ClubConfig>({
    resolver: zodResolver(clubConfigSchema),
    values: clubConfig,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedule',
  })

  const updateConfig = useUpdateConfig()

  function handleSave(data: ClubConfig) {
    updateConfig.mutate(data)
  }

  function onInvalid(errors: FieldErrors<ClubConfig>) {
    console.log(errors)
    const firstError = Object.keys(errors)[0]
    if (firstError) {
      notification.error({ message: errors[firstError]?.message })
    }
  }

  if (!clubConfig) {
    return (
      <div>
        Loading club config <Spin />
      </div>
    )
  }

  return (
    <div className="text-left mx-auto pb-10 w-full max-w-2xl pt-8 flex flex-col gap-y-5">
      <h1 className="text-2xl">Club Settings</h1>

      <List bordered header={<h2>Memberhip Prices ($)</h2>}>
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

      <List bordered header={<h2>Join Form</h2>}>
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

      <List bordered header={<h2>Trainings</h2>}>
        {fields.map((field, index) => (
          <List.Item key={field.id}>
            <div className="flex gap-x-2 w-full">
              <Controller
                control={control}
                name={`schedule.${index}.name`}
                render={({ field: { value, onChange } }) => (
                  <Input
                    placeholder="Training name"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <button
                className="text-gray-400 hover:text-red-500"
                onClick={() => remove(index)}
              >
                <MinusCircle className="size-3.5" />
              </button>
            </div>
          </List.Item>
        ))}
        <List.Item>
          <Button
            icon={<PlusCircleOutlined />}
            className="block"
            onClick={() => append({ name: '' })}
          >
            Add Training
          </Button>
        </List.Item>
      </List>

      <List
        bordered
        header={
          <a
            href="https://www.auckland.ac.nz/en/students/academic-information/important-dates.html"
            target="_blank"
            className="flex items-center gap-x-2 !text-black"
          >
            <h2>Semester Dates </h2>
            <ExternalLink className="size-3.5" />
          </a>
        }
      >
        <List.Item>
          <span>Semester 1</span>
          <Controller
            control={control}
            name="semesterOneDate"
            render={({ field: { value, onChange } }) => (
              <Input
                type="date"
                value={value?.toDate().toISOString().split('T')[0]}
                className="!max-w-40"
                onChange={(e) => onChange(new Date(e.target.value))}
              />
            )}
          />
        </List.Item>
        <List.Item>
          <span>Semester 2</span>
          <Controller
            control={control}
            name="semesterTwoDate"
            render={({ field: { value, onChange } }) => (
              <Input
                type="date"
                value={value?.toDate().toISOString().split('T')[0]}
                className="!max-w-40"
                onChange={(e) => onChange(new Date(e.target.value))}
              />
            )}
          />
        </List.Item>
      </List>

      <List bordered header={<h2>Club Credentials</h2>}>
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
        onClick={handleSubmit(handleSave, onInvalid)}
        loading={isSubmitting || updateConfig.isPending}
      >
        Save Settings
      </Button>
    </div>
  )
}
