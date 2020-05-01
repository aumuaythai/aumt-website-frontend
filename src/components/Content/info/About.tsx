import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import './About.css'
import { Divider } from 'antd'

export class About extends Component {
    render() {
        return (
            <div className='aboutContainer'>
                <h1 className="introTitle">
                    Welcome to Auckland University Muay Thai!
                </h1>
                <div className="groupHeaderContainer">
                    <img src="./photos/content/group1.jpg" alt="group" className='groupHeader'/>
                </div>
                <div className="introContainer">
                    <h3 className='aboutSectionHead'>AUMT aims to introduce the UoA community to Muay Thai.</h3>
                    <p className="introStr">
                     Run by a passionate group of Muay Thai enthusiasts, we organise sessions where members can learn more about Muay Thai and pick up some self-defence skills in a safe, supportive environment.
                    </p>
                </div>
                <div className="aboutDescriptionRow">
                    
                    <div className="aboutDescriptionImg">
                        <img className='aboutDescriptionImgElement' src="./photos/content/muaythai2.jpg" alt="muay thai 2"/>
                    </div>
                    <div className="aboutDescription">
                        <h3 className="aboutSectionHead">What is Muay Thai?</h3>
                        <p className="introStr">
                            Known as 'the art of eight limbs', this martial art discipline from Thailand is characterized by combat utilizing the fists, elbows, knees and shins.
                            It is a highly effective martial art in terms of variety and efficiency.
                        </p>
                    </div>
                </div>
                <div className="clearBoth"></div>
                {/* Complete beginner or someone with a bit more experience? Just want to keep fit or looking to learn a new skill? We have something for everyone! */}
                {/* <div className="aboutRightImageContainer">
                    <img className='aboutImage' src="./photos/content/muaythai1.jpg" alt="muay thai 1"/>
                </div>
                <div className="clearBoth"></div> */}
                <div className="membershipSection">
                    {/* <h2 className="membershipSection">
                        Your Membership Gets You...
                    </h2> */}
                    <h4>
                        An hour of training a week with our professional head trainer, Victor!
                    </h4>
                    <div className="listContainer">
                        <ul>
                            <li>
                                Trainings consist of up to 30 members with 5-7 trainers.
                                This ratio allows for lots of personal feedback from several skilled fighters, resulting in easy learning and quick improvement for members of all skill levels.
                            </li>
                            <li>
                                By dividing the trainings into beginner and advanced,
                                we aim to create a low pressure environment with maximum preparation for those who wish to move to advanced,
                                while also allowing for fitness and fun for those who aren’t as interested in sparring.
                            </li>
                            <li>
                                Trainings are held on Thursdays and Fridays to try and best accommodate everyone's schedules.
                                Each day has an hour slot for beginner and advanced so members can sign up for whenever suits.
                            </li>
                        </ul>
                    </div>
                    <h4>
                        Social Events throughout the year!
                    </h4>
                    <div className="listContainer">
                        <ul>
                            <li>
                            We aim to have an event every few weeks so our members have a chance to interact outside of the gym.
                            We value a friendly and inclusive setting and want the best club experience for all of our members.
                            </li>
                            <li>
                            The social events planned by our committee cover a range of activities.
                            Though often we will have dinner and drinks, we’ll also make sure to accommodate those who prefer not to spend or drink as much.
                            </li>
                            <li>
                            Past events have included a scavenger hunt in albert park (with prizes), a pub quiz, and most importantly our Muay Thai retreat that will be held in semester 2.
                            </li>
                        </ul>
                    </div>
                    <h2>Want to know more?</h2>
                    <p>Check out our <Link to='/faq'>FAQ</Link> page or message the committee on facebook or instagram.</p>
                </div>
            </div>
        )
    }
}