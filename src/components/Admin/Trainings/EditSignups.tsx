import React, {Component, ReactText} from 'react'
import {Select, Button, Statistic, notification, Input, Dropdown, Menu, Row, Col} from 'antd'
import './EditSignups.css'
import db from '../../../services/db'
import { AumtWeeklyTraining, AumtTrainingSession } from '../../../types'


interface EditSignupsProps {
    form: AumtWeeklyTraining
}

interface EditSignupsState {
    selectedMembers: {
        [sessionId: string]: string
    }
    removingInProcess: {
        [sessionId:string]: boolean
    }
    movingInProcess: {
        [sessionId: string]: boolean
    }
    addedMember: {
        [sessionId: string]: string
    }
    addingInProcess: {
        [sessionId: string]: boolean
    }
}

export class EditSignups extends Component<EditSignupsProps, EditSignupsState> {
    constructor(props: EditSignupsProps) {
        super(props)
        this.state = {
            selectedMembers: {},
            removingInProcess: {},
            movingInProcess: {},
            addedMember: {},
            addingInProcess: {}
        }
    }
    onSelectChange = (member: any, sessionId: string) => {
        this.setState({
            ...this.state,
            selectedMembers: Object.assign(this.state.selectedMembers, {
                [sessionId]: member
            })
        })
    }
    memberSort = (uidA: string, uidB: string, session: AumtTrainingSession): number => {
        return session.members[uidA].name > session.members[uidB].name ? 1 : -1
    }
    generateMockUid = () => {
        let alphabet = '1234567890qwertyuiopasdfghjklzxcvbnm'
        let uid = 'NONMEMBER'
        for (let i = 0; i < 10; i++) {
            uid += alphabet[Math.floor(Math.random() * alphabet.length)]
        }
        return uid
    }
    onRemoveClick = (sessionId: string) => {
        const uidToRemove = this.state.selectedMembers[sessionId]
        if (uidToRemove) {
            this.setState({
                ...this.state,
                removingInProcess: Object.assign(this.state.removingInProcess, {[sessionId]: true})
            })
            db.removeMemberFromForm(uidToRemove, this.props.form.trainingId, sessionId)
                .then(() => {
                    delete this.state.selectedMembers[sessionId]
                    this.setState({
                        ...this.state,
                        removingInProcess: Object.assign(this.state.removingInProcess, {[sessionId]: false})
                    })
                })
                .catch((err) => {
                    notification.error({
                        message: 'Error removing member: ' + err.toString()
                    })
                    this.setState({
                        ...this.state,
                        removingInProcess: Object.assign(this.state.removingInProcess, {[sessionId]: false})
                    })
                })
        }
    }
    setAddMember = (sessionId: string, name: string) => {
        this.setState({
            ...this.state,
            addedMember: {...this.state.addedMember, [sessionId]: name}
        })
    }
    addToSession = (sessionId: string) => {
        const name = this.state.addedMember[sessionId]
        if (name) {
            this.setState({...this.state, addingInProcess: {...this.state.addingInProcess, [sessionId]: true}})
            db.signUserUp(this.generateMockUid(), name, new Date(), this.props.form.trainingId, sessionId, '', '')
                .then(() => {
                    notification.success({message: 'Successfully signed up ' + name})
                })
                .catch((err) => {
                    notification.error({message: 'Error adding to session: ' + err.toString()})
                })
                .finally(() => {
                    this.setState({...this.state, addingInProcess: {...this.state.addingInProcess, [sessionId]: false}})
                })
        }
    }
    onMoveClick = (clickParam: {key: ReactText}, fromSession: string) => {
        const {key} = clickParam
        if (typeof key !== 'string') {
            return notification.error({message: 'Ant-D error: click handler returned non-string value'})
        }
        const currentUserIdSelected = this.state.selectedMembers[fromSession]
        const session = this.props.form.sessions[fromSession]
        const displayName = session &&
            session.members[currentUserIdSelected] &&
            session.members[currentUserIdSelected].name
        const timeAdded = session &&
            session.members[currentUserIdSelected] &&
            session.members[currentUserIdSelected].timeAdded
        if (!displayName || !timeAdded) {
            return notification.error({
                message: 'No user found for user id ' + currentUserIdSelected + ' in session'
            })
        }
        this.setState({
            ...this.state,
            movingInProcess: Object.assign(this.state.movingInProcess, {
                [fromSession]: true
            })
        })
        db.signUserUp(currentUserIdSelected, displayName, timeAdded, this.props.form.trainingId, key, '', fromSession)
            .then(() => {
                delete this.state.selectedMembers[fromSession]
                this.setState({
                    ...this.state,
                    movingInProcess: Object.assign(this.state.movingInProcess, {[fromSession]: false})
                })
            })
            .catch((err: Error) => {
                this.setState({
                    ...this.state,
                    movingInProcess: Object.assign(this.state.movingInProcess, {[fromSession]: false})
                })
                // if (err.message === 'Missing or insufficient permissions.') {
                //     window.location.href = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAREBAQEBIPEBAPDw8QDw8PDw8NDw8PFRUWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQFy0dHR0rKy0tLS0tLSstLS0tLSstLS0tLSstLS0tLS0rLS0tLS0tLS0tLSstLS0tLS03LTcrLf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAEBQMGAAIHAQj/xAA/EAABAwIEBAMFBgQDCQAAAAABAAIDBBEFEiExBkFRYRMicRSBkaHBBzJCUnKxI9Hh8GKi8RYkJTRDgpKTsv/EABkBAAMBAQEAAAAAAAAAAAAAAAECAwQABf/EACcRAAICAgICAgIBBQAAAAAAAAABAhEDIRIxBEETIjJRkQUVYXGB/9oADAMBAAIRAxEAPwDjgK6d9m7bgHkuXtF10DgOr8OwvbVJFCM7hSN8oU1kpwzEAWjVNo3gpx7NgEZSGwv3QoapozZBhQeajsh3PJOqjzrM4QsdIJgGqKSp1WG81q7GmjohySOcG+hlMdloCksmMt1JIUIxxn5h8UOQeBYbr1KIMUaeaMjqwea7kdxYYvFG2UFSByNi0ZZQ1Q8p9FPdRzjylc+gx7PnL7WCfbGs5EEpTh1OGtuVY/tQpia+M8rEe9JawhkfuUL0iyVNsikr2hesrmFVmrqLk6qOnlIKbho75d0W4PuvTUhu6hwoZghccblGiRdln1YRLjQGyc4DiYebXXObklWHh0vEjdDYp5wXEjCbcixVYDahjv8AGLrsGAVrcjfQLkGJxGwdzBBTTC+JfCaATsEcSuIMjqR2l1WLboKqxJoG65fU8fNAtclIcQ4zkcDlO6emS5I7VguIsmmDLg6E262Vlc0EWIBC+bsE4gq4Zo6hhF2G4a46OHMHsQuqU32sYf4d5hNFIB5owzxLno1w399l0XWmc/ttCn7RsT9le+ME7At62I0XH63GJ5XWuQCeqb8acVmuqpJrZWE2jad2sAsL9+fvVfDtbquGfDdAlhjke2PoKG7QSdbarELFilgB0Xi9Jf1GI/8AbvG/S/kQwQpjSzuj1aUNTJxS0WZeVCa9mZqywYDxORYOKvuGcQNcBquS1FDl1C8grZGHRxVaTFtxO6MxhvULV2NN6hcZHEEw5/New4zK693JXEeOQ6+7H2dR8UBU8VMA+8PiuWyVj/zH4pa+dx3JPvQUbGeRo6DiXHG4bqUjn4ondsbBVfMp2uRcUBZJP2NpcenP4yhTikx/G4e8oJ5Wt0UkI5O+x7ScT1Mf4sw7p1SceSi2ZvwKpAK3DkHBP0MpyXs6rhvHsZ0cbHun8HF0J/GPiuEly2a89T8UrxL9jLM/aPoejx+J+zgfejpKxpboV86UtdJGQ5jnAjuVbMO40cBZ99vVTlCS6KRyRb2ibjin8Sdrhy3VWxjDi5oVppJDWzAC7WDWSQi4Y3r6nYDmU+fw3SyjIyWZr+TnhjmX7gAH5qFM0pHD6rCCCoWUBCvuL4W6KV8UgAfG7K6xuDzBB6EWPvSmSJoT8w/CuyLBICLI3GMKc9t7KWhLQrC2ZpZrbZI37KqNqjnMOE2dqFbcDoG5m6LLsLiNE1w1gBFl0pWBY0jTiKnAiPoqTOdFeuJT/Dd6KhVJ0WzBH6WYPIl96AJDqow7UeoW7lGweZv6guomy7UeHlzGkDSyR8QxZCOqvuF3ETMtrZQqfx6POw8zurLGqMcMr5UVRzlr4xC0uvHBQNik10bGYrFGsXUgcmEU8tirbhEoLUkjwsZjvunmGYa4bKXxg5UyaukFj6JG5ytcmEvcLAC6Mwbg1z3B0gFuivBqKFm2yjiNx+6CURS0suvkcuy0/C0TWizW/Bev4fZ0CV5f8DRgzkRpZD+EoYYfL+UrsIwBnQLyXAW22QWU6UGzjctO5u4XgKvOP4OBewVRmpCDsm52BRoDkctMymfTu6LwUrulk6YrWzxi2KlbTkDqo3NOwSOVFK0eNC2IXrIHHmFMKN3VLyYNAxK3jf8A1U7aFxTLBMLHtERksY2HxZByLWebKexIA96qmuNsWm5JItlDH7O2OKxBEOeUc3Tvykg/pFm+5NsKqvMM2h6HRVGvxV75XPbrmcSdzdOcFrDJYPBGuwP92XnvIuz2owaVCDjCr/3ycg3uYz8Y2H6qsSyFxR+PSl887+TpXkfpvZvyAST2ggoRFkwt0zm7XTXDJnPbYpE6oujaGsLdkzQEFVLHNfdNsJqHXCTy1BedQn2FQANukkOmaY/VXZbqqfUOCsmNi50UzKQMYGADbzGwu48yV6WOljPH8hv5LKK4rIxdzfUJ3juGtaGyMGW7srgNBm3BA5bJVRwkyMb1cEi/Z12joWF1eWNoPQKocaVGeQdAuk0eF2iaLfhC5txvTFk3ZW53EyQj90VpbFaFYSs5sPCsWhcsRBRfqWEbpxRPaCAkZhLBdDw4g4O1WmGLkjJkzcZUzpUAYQmmHVbRptZUKkxZwbuD0RMNfK86WWWWOnRsT1Z0tmIt23WSVXOyS4NA8x3O5KOkiI3WWc3F0enh8SMsabe2GNqmrJqltkhNQGnVbPrGkJlIxyjTF2PTtddU6eMXKuNUxpBOh6JJWUZdewF7aEaLllUXReHiSlHkJPZgUQKILaGklB+6pvZpeir8sf2Z/if6BHUw2QwpG3TM00hOyhmic3W1l3yRA8boHpqQXRjqYXCBNS4LZtcRuUznFE3Edw0AKJZRBkcjhzAbfte5/YJXS4l0Kskf/LsJOsmZ9u18o/b5qc8ycWkV8eH3TKk+B4ftoexIPe41antIXRQvmdoWRkgdXbDXpeynjpw46hD8bOEVLHG3QzSa/oZZx/zFixtXSPT5UmynS2KgdQA6rXxUZT1Deap0TWxc6jtyR1BR9Qi2lh6I6mLOyPIZGooWgXQldizYha+ybVrssZIXL8drHOkIvouxx5snlnwRdaCrbNfumrqhlgHnK4C1yDZ3e/IqgcPVxaQFdC4SNV1Nx+pknjU1Ysxqua60bTdoOYu2u61tOyVYe8CojJ2DrppU4XmN0O/CbEEHUK6ejK4Vo6xQ1zHNGo2C579oWV84tyCLoa1zGWN7gJNihMhLinSUYkYxbkVKeOxWgajKyM3UTG6KNo0oCLV6jRTrEeR1F9xVoAKrE8Z5Kx41LYG+6rjJs22q04c6UTNm8flOyaOdzWp1w1iV5A0pP7K8jZEYZRvbICs8sibNKhUaO1YLKMo6EIjEJmhpVYwWqc1oB6JjU5pAs86ZoxZZRVFYxeva1/3ra6oWDFWONg5M6zhoynW+qyi4ODDoEioDbYbhjGPFib9E5jwtp2C1w3CcqfwQ2CRwtmqOaSjQlGCt6LDg7eisJatSEyxE3lK+MGb0QVXgDXclbLLwxgp1iQjyHP5uEg9wDW6nkEFVcH8rajdXPGMdjg8rTreznDmenopcJxKOqBtuDoeoSvjfGwvDJw5VoolPwo4EAbkgDpcpxiuVto2/dja1jf0tFh+ytGLEQxOeBroG23uVQaus85Dt76kEFLOKjobx4exhhou4Jb9omskTfyQg+9zjf/5CZ4W4aOBuNrpFx3JeqtyEMQ+V/qjihzlRTPLjGylz76IZzyEfUQ8wh/DujKLiwRaa0RMqXdU1wyZxcEv9nTGgjslfQysd4rMBD7lymufeRx7q78SVZDCOyoLjckqvjx1ZDyJboIppcpCt+D4hcAEqkhMcNnIIVMkfZLHL0dCdMCEM+obfcJUJiW6Je2OQvub2vsjB6FyR2W2B4cvH0JcdF5g8JNlaqOkCSc2hscLKmeHQ/kvP9lh0XQGU7QtXsb2UNjygkc/PDnZeK9FjVibkxOKKDxdckkdUmwiF2ibYjJ4mg963w6HLyVVaVCPsa0VOSNkzgw/W9lFRv7J3RqbTHTCKClOisVFSdUDRhO6UrkghEVI3opTTBbxuWxcnpAsH8ALYNXrnrQyIMZM9ctCvHPWhcmQGb3Vbx7iRkb/BYdS05nDr0CF4nx7I90LXWLQLjrcXuqDitcHea+uuqWWStIrixXth1QySZ5vc22B2/U7oP3TKjrPZhljc4v5uGmvYclHQNMdLE06OkaJX9SXai/oLBAVLtSdLKLrs1qTevQ+r8ffJTkONywh1zob2I+qpT6tweed/cff/ADTj/oSH8xaPgP6pH4ettD6gfySW32FpJ6LPw9O4hw11A3sdbjZRYxRvnlkkY17xcC7WucLNAaNR2CM4Xpg1pc4WGgOXTQm2nQppV4i64bHZjG6NYzyho6BPgyrG2+30Tz4XlSjdIo/sJuQRqNwRYhC1WGlpuAun0crahvhTgG4s15HnjdyLT9OaQ1VGAXMNszHFpttcGy18ll9bMbjLC6btFIEdt1LC8ApzV4f0SCojLXWWacGjVCaktCniaS4KqgCuGJ0+ZqrE8GUq2JqqM+eLuyHIiKPcLI2reMWKpLojHsuODwBwCeR4QOir/D9UGkA7LoGGva4BZoSp0XnG42CUdGGck1hcp/AC3ECtJInC0QPlKBmmKOnbZLpwgkGTIDOViiIWJqQllVgaUxp2qGGNGRBMTYyok9pHJBTuTSnkSuIUyyUr02p3qtUsybU06RoomPWPXrnoCOVS51xxI560zrQla3QGRLmWpK1utXvsCegJTIDOR8c1d6uYjUB9u4IAB92iSYPAameOI/cvnl7RN1d8dG+rgtOIavPLId8z3G/qVY+EqMQUxlOslUGuJ18sQ+4z3/ePqByWft2bFpUMsQnu4nlyHIdLJLWzWt80ZPONbpBic1rlAZMbxz3hHdzj9PooYI7lQUjv4Mfdub/yN/qjKRlyFMe7LG2YRwtHNx+QGv7hDQ1IcbDruhOIJSwRtHKNxv6/6KHAzcAlLEo3ot+FtBPolj6OofJI9rWvDpHkBsjC4tubaX6Iw1HhQyyfkikf8GkhK8FmcQz0C0Ysji7RnyYlkWyKTRxa4FpBsQQQQehCVYlSBytXFMV2Q1GxcfCkPUgXYT7gR8FXnxOK36yQs85N4p0xHLSeVVTFqezl0CpiIbsqficRc86LLGDUjXOalErzmEBR+Im9XTWbskr27rTRjsaYZW2IC6Jw5W3tquRRyFpVv4bxOxAJWXLCnaNGOdqmdegkuigkWF1WYBO4n6LuVoKVMgqGpZUNTWcpdOU8RZC4tXqkKxNZMrLERGVjYFPHCnRJk8BTGAoOGJH07FxyD6YpvSpZThNKYqcmUQyiCnCgicpMyQY2JWhctHOUZcuGRKXoHGKjLBM7pG/9lOXJXxDE59LO1urjGbDqRrZH0H2cYkhMkrYxvI9rB2JNrroFZT3DGRNyRta1rWk20aLD5BVDhZzfGllcLuiZ5AeTnEtJt1sCP+5Wr24lpNxp8lnZriL66LSw5bnuq5icTpHxwt3kcAT+Vv4ne4fRWSsks0k80somWkfIdTkDW9tST9FydHS7CqiIfdaLBoAAHIDQKbDzZwBWQszaqdrALdVOyiRLxO24aerQF5hDLNHot8Sf4jWDmPn2W8UWVoty5Iro6yXiiryUZaN53MiHoTd3+Vrl5gcmjQgeMwctId2tkc53Y5bN/dylwh23RMloWyxcSSf8OmtqWOheP/Y0H5Eqp0GMCwBVzjYHwysOzmH5a/RViqwJoNxp6Lb4ruL/ANnn+VqX/DWauYQktUyMm6Lnwxw2KT1cD2rRWzOpOgLFLW0VYmZqVY3QEmyhqaDsuas5OirPCLw+pLHA90fPh2iVSwlhU5x1TKRls6vwxW5mhXCnmXJuD6+xAK6ZSPuFkqnRqTtWHTPQE7kS8oOZUROQOXLFqViIhAGBbtAQ3jLdsqYkHRhFRFLWSqdkyDChtHIjIJklZMiIpkGh0yyU8iLDkjpKhMmVASDBDioyVEZFrnQGRI4rTMtHOWhcnQGUjinBWU8rqqOzWz+V7BsJBc5h6pDTVdw7Xe+ivPGdMZaOTLq6O0gHMhu/yJXI21ZYexNwVHJDZfFkpbLDJW5o/RDUNRd9ilUlZv31UNDV2frp0S1oo5Ky8slaCG/3dE1bAG35qoxYndw15phWYj5B5lOivJUMaWS7vTZPKezmm/IaKnYfWixJVgpcQGXlsiwInxGUPjynW2n9VHhUdh/eyWz1Vz6phQSbWRORa6Ft2ube12uF/UJfTzh7R6IuinFh1uAq5HL4U0sIOkcjmtvuWX8p+Flr8OX5IxeZHpjSaEFJq6ivdOYagFeVMQI0W0xFNkp7FB1DLlP6yDVLJIdU9CWANp0HieE3aSArDBTI2SnaWkdkkkNF7ObYVIYpbHTVda4fqQ9gXN8Zw8tfmA5q08IVn4SsORbNuN6LvIg5FMX3CHkK5HMhIXi9JWIiCRr1MxyEa5TNenIhbCpmIRj0VG5cEKjCJjYoIXhGROCVjIIhBCOieg2PClEgSjoOa5bZkEJ1njIUMFl60L0MZVr4iZIDCsy5hxtwyYHGaIXgebkDeJx3H6V0Zr0n4mrA2M+iLjYE6ORMPJaPHReyVLXSOAGXXS2xWrgpONMqnaJc2ndRh55kn3rxatKFDNhYqS3bmiqXFHN32S7mvJAhxTDyaGwxIlybUGK20uqmzRT0xcXAN3QcRozOjYdiRLS7k0E6dgT9FXoK97pC95u5xFz6AAfIBFYc7JDJc3PhuHYFwtp8UoB1Wjw41bIeXO6RaoKrYhM4au41VVpKhHe0aaLazEM6sByCMQQbq8hQyYghyOoYFwCifOlr61DyVd0thoMqY2vaUuwyXw5gO9lNTVGvqgah38VpHVQyIvjZ0iCS7Qey1kKGw2T+GFLI9SRSRoSsURcsREK+2RSNkQTXKVhVSYdG9FRyJfGUQwoMAxilRsUqVRFGRFKxkM2SKQPQcb1KHJBkT51uJEIXrzOiNYZ4iwPQfiL1sqKODTLYErn3G+MaEAq14rV5Yz6LkPEVWXyHXROhWLoZPOD1Kezx6A9Qq8xWV7rsYf8ACFPL6KYvYECtQVs8rVIOSMK8cVGHLfNddR1mwCPpPL6lD07bo2SHI0OO7joPqhVuhulYbLVWYGDnq7+SG8VCeIsDlthFRjSMk25OxhFMj2TXCRsej6aRGxKJ5XIZzlNKhiUAmrnFaErZxWoK4BLEdUTS0ud7T3QUbvMB3VqwmnAF1PK9FcfY1hblaAopZF7JIhpHqKHbPTIsQxcvURbETXKZjl4sVSYTG5EsKxYgwBUJRkRWLErGQSwqXMsWJBjwleFerETiJy1zrFiISt8T19mkLms8mZxPUrFieIrI7qwQj+Ey/ReLEmXopi7BnHVY0rFimUMLVuxqxYuOGdBHchQ4nUEyFp2Z5QFixHD+TBl/FAwepWOWLFrMzJuSJopNV6sXAYdIdEDK7VYsXHEDnrZp0XixEHs2w/zSBXam0YFixRylIdGsjkO96xYpjshL1ixYiA//2Q=='
                // }
                notification.error({
                    message: err.toString()
                })
            })
    }
    getMoveDropdown = (sessionId: string) => {
        const availableMove = Object.values(this.props.form.sessions)
            .sort((a, b) => a.position - b.position)
            .map((session) => {
                return {
                    isSpaceLeft: session.limit >= 0 && Object.keys(session.members).length < session.limit,
                    sessionId: session.sessionId,
                    title: session.title,
                    isCurrentDropdown: session.sessionId === sessionId
                }
        })
        return (
            <Menu onClick={e => this.onMoveClick(e, sessionId)}>
                {availableMove.map((moveObj) => {
                    return (
                        <Menu.Item disabled={moveObj.isCurrentDropdown || !moveObj.isSpaceLeft} key={moveObj.sessionId}>
                            {moveObj.title}{!moveObj.isSpaceLeft ? '(full)' : ''}
                        </Menu.Item>
                        )
                    })
                }
            </Menu>
        )
    }
    render() {
        return (
            <div className='editSignedUpMembersContainer'>
                {Object.values(this.props.form.sessions)
                    .sort((a, b) => a.position - b.position)
                    .map((session) => {
                    return (
                        <div key={session.sessionId} className="sessionSelectContainer">
                            <Row>
                            <Col span={7} className="editSignupsTitleAndSelect">
                                <div className="weekStatsDisplayWrapper">
                                    <div key={session.sessionId} className="weekStatEachContainer">
                                        <Statistic title={session.title} value={Object.keys(session.members).length} suffix={`/ ${session.limit}`} />
                                    </div>
                                </div>
                            </Col>
                            <Col span={17}>
                                <Select
                                    showSearch={window.innerWidth > 600}
                                    className='memberSelect'
                                    placeholder="Select a person"
                                    optionFilterProp="children"
                                    onChange={e => this.onSelectChange(e, session.sessionId)}
                                    >
                                        {Object.keys(session.members).sort((a, b) => this.memberSort(a, b, session)).map((member) => {
                                                return (
                                                <Select.Option key={member} value={member}>{session.members[member].name}{member.indexOf('NONMEMBER') > -1 ? ' (non-member)': ''}</Select.Option>
                                                )
                                        })}
                                </Select>
                                <div className="editSignupsOptionButtons">
                                    <Input
                                        addonAfter={
                                            <Button
                                                className='editSignupsAddMemberButton'
                                                type='text'
                                                onClick={e => this.addToSession(session.sessionId)}
                                                loading={this.state.addingInProcess[session.sessionId]}>Add</Button>
                                        }
                                        onChange={e => this.setAddMember(session.sessionId, e.target.value)}
                                        className='editSignupsAddMemberInput'/>
                                    <Dropdown
                                        disabled={!this.state.selectedMembers[session.sessionId]}
                                        overlay={this.getMoveDropdown(session.sessionId)}
                                        trigger={['click']}>
                                        <Button loading={this.state.movingInProcess[session.sessionId]}
                                            >Move...</Button>
                                    </Dropdown>
                                    <Button
                                        loading={this.state.removingInProcess[session.sessionId]}
                                        disabled={!this.state.selectedMembers[session.sessionId]}
                                        danger
                                        type='primary'
                                        onClick={e => this.onRemoveClick(session.sessionId)}
                                        >Remove</Button>
                                </div>
                            </Col>
                            </Row>
                        </div>
                    )
                })}
            </div>
        )
    }
}