import { AumtWeeklyTraining } from "../types"

export type MemberPoint = Record<string, number>

class GraphUtil {
    getDataFromForm = (form: AumtWeeklyTraining): MemberPoint[] => {
        let sessionNames = form.sessions.reduce((sessionObj, session) => {
            sessionObj[session.sessionId] = 0
            return sessionObj
        }, {} as Record<string, number>)

        const points = form.sessions.reduce((arr, session) => {
            const memberUids = Object.keys(session.members)
            for (let uid of memberUids) {
                let inserted = false
                const uidTime = session.members[uid].timeAdded
                const sessionNameCopy = Object.assign({}, sessionNames)
                sessionNameCopy[session.sessionId] += 1
                const memberPoint = Object.assign({
                    time: uidTime.getTime() * 1000,
                }, sessionNameCopy)
                for (let i = 0; i < arr.length; i ++) {
                    if (arr[i].time > uidTime.getTime() * 1000) {
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
}

export default new GraphUtil()