import moment from 'moment'
import { AumtWeeklyTraining } from '../types'

// @ts-ignore
import { createPdf, TDocumentDefinition } from 'pdfmake/build/pdfmake';
// @ts-ignore
import * as vfsFonts from "pdfmake/build/vfs_fonts";
import dataUtil from './data.util'



class PdfUtil {
    public createSignupPdf = (trainings: AumtWeeklyTraining, selected: string[]) => {
        // const doc = createPdf(this.getTrainingDocDefinition(trainings) as TDocumentDefinition, null, {
        //     Roboto: {
        //       normal: 'Roboto-Regular.ttf',
        //       bold: 'Roboto-Medium.ttf',
        //       italics: 'Roboto-Italic.ttf',
        //       bolditalics: 'Roboto-MediumItalic.ttf'
        //     },
        //     Courier: {
        //       normal: 'Courier',
        //       bold: 'Courier-Bold',
        //       italics: 'Courier-Oblique',
        //       bolditalics: 'Courier-BoldOblique'
        //     },
        //   }, vfsFonts.pdfMake.vfs)
        // doc.download('aumt_training_report.pdf')
    }

    public createTrainingPdf = (trainings: AumtWeeklyTraining[]) => {
        const doc = createPdf(this.getTrainingDocDefinition(trainings) as TDocumentDefinition, null, {
            Roboto: {
                normal: 'Roboto-Regular.ttf',
                bold: 'Roboto-Medium.ttf',
                italics: 'Roboto-Italic.ttf',
                bolditalics: 'Roboto-MediumItalic.ttf'
            },
            Courier: {
                normal: 'Courier',
                bold: 'Courier-Bold',
                italics: 'Courier-Oblique',
                bolditalics: 'Courier-BoldOblique'
            },
        }, vfsFonts.pdfMake.vfs)
        doc.download('aumt_training_report.pdf')
    }

    private getTrainingDocDefinition = (data: AumtWeeklyTraining[]) => {
        const currentDate = new Date()
        const content = [
            // {image: '/logorectangle.png', width: 150, alignment: 'center'},
            { text: `AUMT Trainings Report ${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`, style: 'header', alignment: 'center' },
        ]
        content.push({ text: `${data.length} Trainings`, style: 'subHeader', alignment: 'left' })
        const summaryBody = data.reduce((body, training) => {
            const [total, limit] = Object.values(training.sessions).sort((a, b) => a.position - b.position).reduce((arr, session) => {
                arr[0] += Object.keys(session.members).length
                arr[1] += session.limit
                return arr
            }, [0, 0])
            body.push([
                training.title,
                { text: `Signups: ${total} / ${limit}\n\n`, alignment: 'right' }
            ])
            return body
        }, [] as Array<string | { text: string, alignment: string }>[])
        content.push({
            table: {
                widths: ['*', '*'],
                body: summaryBody,
            },
            layout: 'noBorders'
        } as any)
        data.forEach((training) => {
            content.push({ text: training.title, style: 'subHeader', alignment: 'left' })
            const { widths, flatSessions } = Object.values(training.sessions).sort((a, b) => a.position - b.position).reduce((obj, session) => {
                obj.widths.push('*')
                const names = Object.keys(session.members)
                    .sort((uidA, uidB) => {
                        return new Date(session.members[uidB].timeAdded).getTime() - new Date(session.members[uidA].timeAdded).getTime()
                    })
                    .map((uid) => {
                        const addedDate = new Date(session.members[uid].timeAdded)
                        const dateStr = moment(addedDate).format('MMM DD HH:mm')
                        return `${session.members[uid].name} \n ${dateStr}`
                    })
                    // .sort()
                    .map(name => {
                        return { text: name, style: 'tableText' }
                    })
                const sessionNames = [{
                    text: session.title,
                    style: 'tableHeader'
                }, {
                    text: `${names.length} / ${session.limit}`,
                    style: 'sessionInfoLine'
                }].concat(names)
                obj.flatSessions.push(sessionNames)
                return obj
            }, { widths: [], flatSessions: [] } as { widths: string[], flatSessions: Array<Object>[] })
            const maxLength = flatSessions.reduce((len, cur) => {
                return Math.max(len, cur.length)
            }, 0)
            const evenedSessions = flatSessions.map(session => {
                while (session.length < maxLength) {
                    session = session.concat([' '])
                }
                return session
            })
            const body = dataUtil.transpose(evenedSessions)
            content.push({
                table: {
                    widths,
                    body
                },
                layout: 'lightHorizontalLines'
            } as any)
        })
        const docDefinition = {
            content,
            styles: {
                header: { fontSize: 30, bold: true, margin: [0, 20, 0, 20] },
                subHeader: { fontSize: 25, bold: false, margin: [0, 40, 0, 10] },
                tableHeader: { fontSize: 12, bold: true },
                tableText: { fontSize: 8, margin: [0, 2, 0, 2] },
                sessionInfoLine: { margin: [0, 7, 0, 7] }
            }
        }
        return docDefinition
    }
}


export default new PdfUtil()