import React, {Component} from 'react'
import Divider from 'antd/es/divider'
import { Links } from '../../services/links'
import './Faq.css'

export default class Faq extends Component {
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
                        A: There is a 6:30 Beginners training and a 7:30 Advanced training every Thursday and Friday. Trainings are held at the Hawk's Nest Gym, located at the third floor of&nbsp;
                        <span className='socialLink' onClick={this.mapClick}>492 Queen Street</span>
                    </p>
                    <Divider/>
                </div>
                <div className="questionContainer">
                    <p className="question">
                        Q: How much is a membership?
                    </p>
                    <p className="answer">
                        A: Membership is $50 for one semester or $90 for the full year
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
                        A: The committee members will be more than happy to answer if you approach them at trainings or events, otherwise you can message our&nbsp;
                        <span className='socialLink' onClick={this.fbClick}>facebook</span>
                        &nbsp;or&nbsp;
                        <span className='socialLink' onClick={this.igClick}>instagram page.</span>
                    </p>
                    <Divider/>
                </div>
            </div>
        )
    }
}