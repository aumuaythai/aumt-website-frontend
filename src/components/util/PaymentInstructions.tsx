import { Copy } from 'lucide-react'
import { copyText } from '../../lib/utils'
import { ClubConfig, MembershipPeriod, PaymentType } from '../../types'

interface PaymentInstructionsProps {
  clubConfig: ClubConfig | null
  membershipType: MembershipPeriod
  paymentType: PaymentType
}

export default function PaymentInstructions({
  clubConfig,
  membershipType,
  paymentType,
}: PaymentInstructionsProps) {
  return (
    <div>
      {paymentType === 'Bank Transfer' && (
        <p>
          If paying by <b>Bank Transfer</b>, include your 'NAME' and
          {membershipType === 'S1' &&
            ` 'AUMTS1' (for one semester) or AUMTFY (for one year) `}
          {membershipType === 'FY' && ` 'AUMTFY' (for one year) `}
          {membershipType === 'S2' && ` 'AUMTS2' (for one semester) `}
          {membershipType === 'SS' && ` 'AUMTSS' (for summer school) `}
          as the reference. Membership is
          {membershipType === 'S1' &&
            ` $${clubConfig?.semesterOneFee} for the semester or $${clubConfig?.fullYearFee} for the year `}
          {membershipType === 'FY' &&
            ` $${clubConfig?.fullYearFee} for the year `}
          {membershipType === 'S2' &&
            ` $${clubConfig?.semesterTwoFee} for the semester `}
          {membershipType === 'SS' &&
            ` $${clubConfig?.summerSchoolFee} for summer school `}
          and should be paid with your full name as the reference to:
          <div className="flex items-center justify-center my-2 text-base gap-x-2">
            {' ' + clubConfig?.bankAccountNumber}
            <button
              type="button"
              className="cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => copyText(`${clubConfig?.bankAccountNumber}`)}
            >
              <Copy className="size-4" />
            </button>
          </div>
          NOTE: It may take some time for our treasurer to process your payment.
          Do not worry if your payment status does not immediate take effect. If
          you have any questions, please contact us.
        </p>
      )}

      {paymentType === 'Cash' && (
        <p>
          If paying by <b>Cash</b>, please contact us via our Instagram or
          Email. We will sign you up manually to the first training session of
          your choice. There you can pay cash to one of our friendly execs. Once
          we process your cash payment, you will unlock access to future
          trainings and signup by yourself. Membership is
          {membershipType === 'S1' &&
            ` $${clubConfig?.semesterOneFee} for the semester or $${clubConfig?.fullYearFee} for the year`}
          {membershipType === 'FY' &&
            ` $${clubConfig?.fullYearFee} for the year`}
          {membershipType === 'S2' &&
            ` $${clubConfig?.semesterTwoFee} for the semester`}
          {membershipType === 'SS' &&
            ` $${clubConfig?.summerSchoolFee} for summer school`}
          .
        </p>
      )}

      {paymentType === 'Other' && (
        <p>
          If paying by <b>Other</b> methods, please contact us via our Facebook
          or Email, so we can discuss your method of payment.
        </p>
      )}
    </div>
  )
}
