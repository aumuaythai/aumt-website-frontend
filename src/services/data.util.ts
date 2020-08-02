import { AumtWeeklyTraining, AumtMembersObj, AumtMembersObjWithCollated } from "../types"
import { notification } from 'antd'

export type MemberPoint = Record<string, number>

class DataFormatUtil {
    getDataFromForm = (form: AumtWeeklyTraining): MemberPoint[] => {
        let sessionNames = Object.values(form.sessions).reduce((sessionObj, session) => {
            sessionObj[session.sessionId] = 0
            return sessionObj
        }, {} as Record<string, number>)
        const points = Object.values(form.sessions).reduce((arr, session) => {
            const memberUids = Object.keys(session.members)
            for (let uid of memberUids) {
                let inserted = false
                const uidTime = session.members[uid].timeAdded
                const sessionNameCopy = Object.assign({}, sessionNames)
                sessionNameCopy[session.sessionId] += 1
                const memberPoint = Object.assign({
                    time: uidTime.getTime(),
                }, sessionNameCopy)
                for (let i = 0; i < arr.length; i ++) {
                    if (arr[i].time > uidTime.getTime()) {
                        arr.splice(i, 0, memberPoint)
                        inserted = true
                        break
                    }
                }
                if (!inserted) {
                    arr.push(memberPoint)
                }
            }
            return arr
        }, [] as MemberPoint[])
        const newPoints = points.reduce((obj, memberPoint, idx) => {
            Object.keys(memberPoint).forEach((sessionCount) => {
                if (!obj.memberMap[sessionCount]) {
                    obj.memberMap[sessionCount] = 0
                }
                obj.memberMap[sessionCount] += memberPoint[sessionCount]
            })
            obj.totals.push(Object.assign(points[idx], obj.memberMap, {time: points[idx].time}))
            return {
                totals: obj.totals,
                memberMap: obj.memberMap
            }
        }, {totals: [] as MemberPoint[], memberMap: {} as MemberPoint})
        return newPoints.totals
    }

    getAttendance = (memberId: string, forms: AumtWeeklyTraining[]) => {
        forms.sort((a, b) => {
            return a.closes < b.closes ? 1 : -1
        })
        const attendance: {formTitle: string, formId: string, sessionTitle: string}[] = []
        forms.forEach((form) => {
            let foundSession = ''
            Object.values(form.sessions).forEach((session) => {
                if (session.members[memberId]) {
                    foundSession = session.title
                }
            })
            attendance.push({
                formTitle: form.title,
                formId: form.trainingId,
                sessionTitle: foundSession
            })
        })
        return attendance
    }

    getCollatedMembersObj = (members: AumtMembersObj): AumtMembersObjWithCollated => {
        return Object.keys(members).reduce((allMembers, uid) => {
            const member = members[uid]
            let collated = `${member.firstName} ${member.lastName.slice(0, 1)}`
            Object.keys(allMembers).forEach((uid) => {
                let charsInLastName = 2
                while (allMembers[uid].collated === collated) {
                    collated = `${member.firstName} ${member.lastName.slice(0, charsInLastName)}`
                    allMembers[uid].collated = `${allMembers[uid].preferredName || allMembers[uid].firstName} ${allMembers[uid].lastName.slice(0, charsInLastName)}`
                    charsInLastName += 1
                    if (charsInLastName > 10) {
                        console.error('WARNING: TWO COLLATED NAMES THE SAME TO 10 DIGITS')
                        break
                    }
                }
            })
            collated = `${collated.slice(0,1).toUpperCase()}${collated.slice(1)}`
            allMembers[uid] = {
                ...members[uid],
                collated
            }
            return allMembers
        }, {} as AumtMembersObjWithCollated)
    }

    copyText = (text: string): void => {
        navigator.clipboard.writeText(text).then(() => {
            notification.success({message: 'Copied'})
        })
        .catch((err) => {
            notification.error({message: 'Text not copied: ' + err.toString()})
        })
    }
}

export default new DataFormatUtil()