export interface AumtEvent {
    urlPath: string
    title: string
    id: string
    description: string
    photoPath: string
    date: Date
    location: string
    fbLink: string
    // signups?: {
    //     members: {
    //         [uid: string]: string
    //     },
    //     waitlist: {
    //         [uid: string]: string
    //     }
    // }
}