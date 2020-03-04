import React, {Component} from 'react'
import { List } from 'antd'
import './About.css'

export default class About extends Component {
    private introTitle = `Welcome to our brand new AUMT website!`
    private introStr = 
        `Here we will be sharing signups and other exclusive club member content. 
        Our club strives to provide the best of the best for our members through every aspect, from thoroughly planned trainings to easy online communication.`
    private membershipTitle = `Your membership gets you...`
    private membershipStr = `An hour of training a week with our professional head trainer, Victor!`
    private trainingList = [`
    Trainings consist of up to 30 members with 5-7 trainers. This ratio allows for lots of personal feedback from several skilled fighters, resulting in easy learning and quick improvement for members of all skill levels.
    `, `
    By dividing the trainings into beginner and advanced, we aim to create a low pressure environment with maximum preparation for those who wish to move to advanced, while also allowing for fitness and fun for those who aren’t as interested in sparring.
    `, `
    Trainings are held on Thursdays and Fridays to try and best accommodate everyone's schedules. Each day has an hour slot for beginner and advanced so members can sign up for whenever suits.
    `]
    private eventsStr = `Social Events throughout the year!`
    private eventsList = [`
    We aim to have an event every few weeks so our members have a chance to interact outside of the gym. We value a friendly and inclusive setting and want the best club experience for all of our members.
    `, `
    The social events planned by our committee cover a range of activities. Though often we will have dinner and drinks, we’ll also make sure to accommodate those who prefer not to spend or drink as much.
    `, `
    Past events have included a scavenger hunt in albert park (with prizes), a pub quiz, and most importantly our Muay Thai retreat that will be held in semester 2.
    `]
    
    render() {
        return (
            <div className='aboutContainer'>
                <div className="introContainer">
                    <h2 className="introTitle">
                        {this.introTitle}
                    </h2>
                    <p className="introStr">
                        {this.introStr}
                    </p>
                </div>
                <div className="membershipSection">
                    <h2 className="membershipSection">
                        {this.membershipTitle}
                    </h2>
                    <h4>{this.membershipStr}</h4>
                    <div className="listContainer">
                        <ul>
                            {this.trainingList.map((item) => (<li>{item}</li>))}
                        </ul>
                    </div>
                    <h4>{this.eventsStr}</h4>
                    <div className="listContainer">
                        <ul>
                            {this.eventsList.map((item) => (<li>{item}</li>))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}