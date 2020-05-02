import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Divider, Button } from 'antd'
import './About.css'
import { Links } from '../../../services/links'

export class About extends Component {
    render() {
        return (
            <div className='aboutContainer'>
                <h1 className="introTitle">
                    Welcome to Auckland University Muay Thai
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
                <Divider className='aboutDivider'/>
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
                    <div className="clearBoth"></div>
                </div>
                <Divider className='aboutDivider'/>
                <div className="aboutDescriptionRow">
                    <div className="aboutDescriptionImg floatLeft">
                        <img className='aboutDescriptionImgElement' src="./photos/content/muaythai3.jpg" alt="muay thai 3"/>
                    </div>
                    <div className="aboutDescription floatLeft">
                        <h3 className='aboutSectionHead'>Trainings</h3>
                        <p className='introStr'>An AUMT membership gives you access to an hour of training a week with our professional head trainer, Victor.</p>
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
                    </div>
                    <div className="clearBoth"></div>
                </div>
                <Divider className='aboutDivider'/>
                <div className='aboutDescriptionRow'>
                    <div className="aboutDescriptionImg">
                        <img className='aboutDescriptionImgElement' src="./photos/content/event1.jpg" alt="event 1"/>
                    </div>
                    <div className="aboutDescription">
                    <h3 className='aboutSectionHead'>
                        Social Events
                    </h3>
                    <p className="introStr">
                        We aim to have an event every few weeks so our members have a chance to interact outside of the gym.
                    </p>
                        <div className="listContainer">
                            <ul>
                                <li>
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
                    </div>
                    <div className="clearBoth"></div>
                </div>
                <Divider className='aboutDivider'/>
                <div className="aboutFooterNotes">
                    <h3 className='aboutSectionHead'>Want to know more?</h3>
                    <p>Check out our <Link to='/faq'>FAQ</Link> page or message the committee on
                    <Button className='aboutInlineLink' type='link' onClick={Links.openAumtFb}>facebook</Button>
                    or
                    <Button className='aboutInlineLink' type='link' onClick={Links.openAumtInsta}>instagram</Button>.
                    </p>
                </div>
            </div>
        )
    }
}