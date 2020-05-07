import { AumtMember } from "../types"

class Validator {
    public createAumtMember = (obj: any): AumtMember | string => {
        const yn = ['Yes', 'No']
        if (!obj.firstName) return 'First Name Required'
        if (!obj.lastName) return 'Last Name Required'
        if (!obj.email) return 'Email Required'
        if (yn.indexOf(obj.isReturningMember) < 0) return `"isReturningMember" field (${obj.isReturningMember}) invalid for firstName ${obj.firstName}`
        if (yn.indexOf(obj.paid) < 0) return `"Paid" field (${obj.paid}) invalid for firstName ${obj.firstName}`
        if (yn.indexOf(obj.isUoAStudent) < 0) return `"isUoAStudent" field (${obj.isUoAStudent}) invalid for firstName ${obj.firstName}`
        if (['S1', 'S2', 'FY'].indexOf(obj.membership) < 0) return `"membership" field (${obj.membership}) invalid for firstName ${obj.firstName}`
        if (!obj.EmergencyContactName) return 'Emergency Contact Name Required'
        if (!obj.EmergencyContactNumber) return 'Emergency Contact Number Required'
        return {
            firstName: obj.firstName,
            lastName: obj.lastName,
            preferredName: obj.preferredName || '',
            upi: obj.upi || '0',
            email: obj.email,
            emailVerified: obj.emailVerified || false,
            isReturningMember: obj.isReturningMember,
            isUoAStudent: obj.isUoAStudent,
            membership: obj.membership,
            initialExperience: obj.initialExperience,
            instagramHandle: obj.instagramHandle || '',
            paymentType: obj.paymentType || 'Cash',
            paid: obj.paid,
            EmergencyContactName: obj.EmergencyContactName,
            EmergencyContactNumber: obj.EmergencyContactNumber,
            EmergencyContactRelationship: obj.EmergencyContactRelationship
        }
    }
}
export default new Validator()