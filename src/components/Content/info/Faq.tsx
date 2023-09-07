import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import {Divider} from 'antd'
import { Links } from '../../../services/links'
import './Faq.css'

export class Faq extends Component {
    fbClick = () => {
        Links.openAumtFb()
    }
    igClick = () => {
        Links.openAumtInsta()
    }
    mapClick = () => {
        Links.openAumtAddress()
    }
    render() {
        return (
            <div className='faqContainer'>
                <div className="questionContainer">
                    <p className="question">Q: When and where are trainings?</p>
                    <p className="answer">
                    A: Training times:
                    <ul>
                        <li>Beginner: 4:30pm Wednesday, 4:30pm Thursday, 7:30pm Friday</li>
                        <li>Intermediate: 4:30pm Tuesday, 6:30pm Friday</li>
                        <li>Advanced: 5:30pm Thursday</li>
                    </ul>
                    </p>
                    <p>
                        Trainings are located a The Hawks Nest Gym,&nbsp;<span className='socialLink' onClick={this.mapClick}> 492 Queen Street</span>

                    </p>
                    <iframe title="Training Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d633.4536252469256!2d174.76206034919215!3d-36.856698459636775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d47bb9877fca5%3A0x70e64b98b3aeed38!2sThe%20Hawks&#39;%20Nest%20Gym!5e0!3m2!1sen!2snz!4v1644916967606!5m2!1sen!2snz" loading="lazy" />
                    <Divider/>
                </div>
                <div className="questionContainer">
                    <p className="question">
                        Q: How much is a membership?
                    </p>
                    <p className="answer">
                        A: Memberships are $50 for one semester or $90 for the full year
                    </p>
                    <Divider/>
                </div>
                <div className="questionContainer">
                    <p className="question">
                        Q: How do I join?
                    </p>
                    <p className="answer">
                        A: Club signups are only open at the beginning of each semester. When they open, you can join at <Link to='/join'>aumt.co.nz/join</Link>.
                    </p>
                    <Divider/>
                </div>
                <div className="questionContainer">
                    <p className="question">
                        Q: What do I need to bring?
                    </p>
                    <p className="answer">
                        A: Just a comfortable shirt and shorts. All gloves and pads are provided by the club. Having handwraps is highly recommended, as well as a mouth guard for advanced members. These can be purchased from the Hawk’s Nest Gym. You’re welcome to bring your own gear if you prefer.
                    </p>
                    <Divider/>
                </div>
                <div className="questionContainer">
                    <p className="question">
                        Q: I want to represent the club. Where can I get some sweet sweet merch?
                    </p>
                    <p className="answer">
                        A: Talk to your nearest committee member! We have AUMT muay thai shorts and a club shirt as well. 
                    </p>
                    <Divider/>
                </div>
                <div className="questionContainer">
                    <p className="question">
                        Q: Who do I contact if I have additional questions?
                    </p>
                    <p className="answer">
                        A: The committee members will be more than happy to answer if you approach them at trainings or events or email them at
                        <a href='mailto:uoamuaythai@gmail.com'> uoamuaythai@gmail.com, </a>
                        otherwise you can message our&nbsp;
                        <span className='socialLink' onClick={this.fbClick}>Facebook</span>
                        &nbsp;or&nbsp;
                        <span className='socialLink' onClick={this.igClick}>Instagram</span>
                        &nbsp;page
                    </p>
                    <Divider/>
                </div>
            </div>
        )
    }
}