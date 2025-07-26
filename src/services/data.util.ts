import { notification } from 'antd'
import {
  AumtMembersObj,
  AumtMembersObjWithCollated,
  AumtWeeklyTraining,
  LicenseClasses,
  TableRow,
} from '../types'

export type MemberPoint = Record<string, number>

export type CarAllocation = {
  driver: string
  carOwner: string
  passengers: string[]
  seats: number
}

class DataFormatUtil {
  getDataFromForm = (form: AumtWeeklyTraining): MemberPoint[] => {
    let sessionNames = Object.values(form.sessions).reduce(
      (sessionObj, session) => {
        sessionObj[session.sessionId] = 0
        return sessionObj
      },
      {} as Record<string, number>
    )
    const points = Object.values(form.sessions).reduce((arr, session) => {
      const memberUids = Object.keys(session.members)
      for (let uid of memberUids) {
        let inserted = false
        const uidTime = session.members[uid].timeAdded
        const sessionNameCopy = Object.assign({}, sessionNames)
        sessionNameCopy[session.sessionId] += 1
        const memberPoint = Object.assign(
          {
            time: uidTime.getTime(),
          },
          sessionNameCopy
        )
        for (let i = 0; i < arr.length; i++) {
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
    const newPoints = points.reduce(
      (obj, memberPoint, idx) => {
        Object.keys(memberPoint).forEach((sessionCount) => {
          if (!obj.memberMap[sessionCount]) {
            obj.memberMap[sessionCount] = 0
          }
          obj.memberMap[sessionCount] += memberPoint[sessionCount]
        })
        obj.totals.push(
          Object.assign(points[idx], obj.memberMap, { time: points[idx].time })
        )
        return {
          totals: obj.totals,
          memberMap: obj.memberMap,
        }
      },
      { totals: [] as MemberPoint[], memberMap: {} as MemberPoint }
    )
    return newPoints.totals
  }

  getAttendance = (memberId: string, forms: AumtWeeklyTraining[]) => {
    forms.sort((a, b) => {
      return a.closes < b.closes ? 1 : -1
    })
    const attendance: {
      formTitle: string
      formId: string
      sessionTitles: string[]
    }[] = []
    forms.forEach((form) => {
      let foundSessions: string[] = []
      Object.values(form.sessions).forEach((session) => {
        if (session.members[memberId]) {
          foundSessions.push(session.title)
        }
      })
      attendance.push({
        formTitle: form.title,
        formId: form.trainingId,
        sessionTitles: foundSessions,
      })
    })
    return attendance
  }

  shuffleArray = (arr: any[]) => {
    return arr
      .slice()
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value)
  }

  getRandomCars = (
    signups: TableRow[],
    max4Seats: boolean = false
  ): CarAllocation[] => {
    let owners: {
      key: string
      name: string
      license: LicenseClasses
      seats: number
    }[] = []
    let fullDrivers: { key: string; name: string; license: LicenseClasses }[] =
      []
    const passengers: { key: string; name: string }[] = []
    const cars: CarAllocation[] = []
    let totalCarSeats = 0
    const shuffled = this.shuffleArray(signups)

    shuffled.forEach((signup) => {
      if (signup.seatsInCar && signup.seatsInCar > -1) {
        totalCarSeats += signup.seatsInCar
        owners.push({
          key: signup.key,
          name: signup.displayName,
          seats: signup.seatsInCar,
          license: signup.driverLicenseClass || 'Restricted',
        })
      } else if (
        signup.driverLicenseClass &&
        signup.driverLicenseClass !== 'Other' &&
        signup.driverLicenseClass !== 'Restricted'
      ) {
        fullDrivers.push({
          key: signup.key,
          name: signup.displayName,
          license: signup.driverLicenseClass,
        })
      } else {
        passengers.push({
          key: signup.key,
          name: signup.displayName,
        })
      }
    })
    const totalSignups = shuffled.length
    if (totalCarSeats < totalSignups) {
      throw new Error('More signups than car seats')
    }
    let needsRestrictedDrivers = false
    const fullOwners = owners.filter((o) => o.license !== 'Restricted')
    if (fullOwners) {
      const fullOwnerSeats = fullOwners.reduce((totalSeats, owner) => {
        return totalSeats + owner.seats
      }, 0)
      if (fullOwnerSeats < shuffled.length) {
        needsRestrictedDrivers = true
      }
    }
    let seatsAvailable = 0
    while (seatsAvailable < totalSignups) {
      if (!needsRestrictedDrivers) {
        const car1Owner = owners.find((o) => o.license !== 'Restricted')
        if (car1Owner) {
          if (max4Seats && car1Owner.seats === 5) {
            car1Owner.seats = 4
          }
          cars.push({
            driver: car1Owner.name,
            carOwner: car1Owner.name,
            passengers: [],
            seats: car1Owner.seats,
          })
          owners = owners.filter((o) => o.key !== car1Owner.key)
          seatsAvailable += car1Owner.seats
        } else {
          throw new Error('End of car owners before run out')
        }
      } else {
        const car1Owner = owners.find((o) => o.license === 'Restricted')
        if (car1Owner) {
          if (max4Seats && car1Owner.seats === 5) {
            car1Owner.seats = 4
          }
          const driver =
            fullDrivers.find((d) => d.license === 'Full 2+ years') ||
            fullDrivers.pop()
          if (!driver) {
            throw new Error('Not enough full license holders to drive cars')
          }
          cars.push({
            driver: driver.name,
            carOwner: car1Owner.name,
            passengers: [],
            seats: car1Owner.seats,
          })
          owners = owners.filter((o) => o.key !== car1Owner.key)
          fullDrivers = fullDrivers.filter((d) => d.key !== driver.key)
          seatsAvailable += car1Owner.seats
        } else {
          needsRestrictedDrivers = false
        }
      }
    }
    const remainingSignups = this.shuffleArray(
      passengers.concat(fullDrivers).concat(owners)
    )
    let loopidx = 0
    while (remainingSignups.length > 0) {
      const carIdx = loopidx % cars.length
      const c = cars[carIdx]
      loopidx += 1
      if (loopidx > 1000) {
        throw new Error('Infinite loop trying to fit passengers into cars')
      }
      if (
        c.passengers.length + 1 + (c.driver === c.carOwner ? 0 : 1) <
        c.seats
      ) {
        cars[carIdx].passengers.push(remainingSignups.pop()?.name || '')
      } else {
        continue
      }
    }
    return cars
  }

  getCollatedMembersObj = (
    members: AumtMembersObj
  ): AumtMembersObjWithCollated => {
    return Object.keys(members).reduce((allMembers, uid) => {
      const member = members[uid]
      let collated = `${member.firstName} ${member.lastName.slice(0, 1)}`
      Object.keys(allMembers).forEach((uid) => {
        let charsInLastName = 2
        while (allMembers[uid].collated === collated) {
          collated = `${member.firstName} ${member.lastName.slice(
            0,
            charsInLastName
          )}`
          allMembers[uid].collated = `${
            allMembers[uid].preferredName || allMembers[uid].firstName
          } ${allMembers[uid].lastName.slice(0, charsInLastName)}`
          charsInLastName += 1
          if (charsInLastName > 10) {
            console.error('WARNING: TWO COLLATED NAMES THE SAME TO 10 DIGITS')
            break
          }
        }
      })
      collated = `${collated.slice(0, 1).toUpperCase()}${collated.slice(1)}`
      allMembers[uid] = {
        ...members[uid],
        collated,
      }
      return allMembers
    }, {} as AumtMembersObjWithCollated)
  }

  copyText = (text: string): void => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        notification.success({ message: 'Copied' })
      })
      .catch((err) => {
        notification.error({ message: 'Text not copied: ' + err.toString() })
      })
  }

  transpose = (matrix: Array<any>[]) => {
    return matrix[0].map((col, c) =>
      matrix.map((row, r) => matrix[r][c]).map((e) => e || '')
    )
  }

  downloadCsv = (fileName: string, text: string): void => {
    const blob = new Blob([text])
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = fileName + '.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

export default new DataFormatUtil()
