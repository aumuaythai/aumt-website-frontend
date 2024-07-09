import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import {Button } from 'antd'
import './About.css'
import { Links } from '../../../services/links'

export class About extends Component {
    render() {
        return (
            <div className='aboutContainer'>
                <h1 className="introTitle">
                    WELCOME TO <br/>AUCKLAND UNIVERSITY MUAY THAI
                </h1>
                <img src="./photos/content/Landing.jpg" alt="group" className="landingImg"/>
                <div className="introContainer">
                    <h3 className='aboutSectionHead'>AUMT INTODUCES STUDENTS TO THE ART OF MUAY THAI</h3>
                    <p>
                      Run by a passionate group of Muay Thai Enthusiasts, we run weekly trainings and social events. <br/>
                      we aim to teach martial arts in a friendly and low-pressure environment.<br/>
                      All experience levels are welcome!
                    </p>
                </div>
                <div className="btnContainer">
                  <button className="boldBtn teal"><a href='/signups'>TRAININGS</a>  </button>
                  <button className="boldBtn teal"><a href = '/events'>EVENTS</a> </button>
                </div>
                <div className="introContainer">
                    <h3 className='aboutSectionHead'>WHAT IS MUAY THAI?</h3>
                    <p>
                    Known as the Art of Eight Limbs, this martial art discipline from Thailand is characterized by combat <br/> utilising the fists, elbows, knees and shins. It is a highly effective martial art and great for self-defence.

                    </p>
                </div>
                
                <div className='aboutDivider'/>
                <div className='aboutSection'>
                  <h2 className='aboutSectionHeader'><span className='lacuna'> Membership</span>  <br/> Price</h2>
                  <div className="btnContainer">
                    <button className="boldBtn yellow membershipBtn">1 SEMESTER <br/> $60</button>
                    <button className="boldBtn yellow membershipBtn">FULL YEAR <br/> $100 </button>
                    <button className="boldBtn invert membershipBtn">1 OFF CLASS* <br/> $10</button>
                  </div>
                  <p>
                  An AUMT membership gives you access to an 1 hour/1 class per week and discounted prices to our priced events! <br/>
                  *One off classes are allowed for $10, please message us to book a 1-off session.
                  </p>


                </div>
                <div className='aboutDivider'/>
                <div className='aboutSection'>
                  <h2 className='aboutSectionHeader'><span className='lacuna'> Weekly</span>  <br/> TRAININGS</h2>
                  <div className='aboutSectionBody'>
                    <div className='aboutSectionDescription'>
                      <p>
                      Trainings consist of up to 40 members. Our trainers and committee are at trainings to help you learn and give personalized feedback, so never hesitate to ask! <br/>
                      <br/>
                      Our classes are tailored to different skill levels.<br/>
                      <br/>
                      - Beginners Trainings are best for those with little to no Muay Thai experience. Learn the fundamentals of Muay Thai in a low-pressure and friendly environment.<br/>
                      <br/>
                      - Intermediate Trainings are best for those who have prior Muay Thai experience and/or approval from committee and coach. A more serious pace, these classes teach more advanced technique and includes sparring.<br/>

                      </p>
                      <div className="btnContainer">
                        <button className="boldBtn orange"><a href='/signups'>SIGN UP TO TRAINING</a>  </button>
                      </div>
                    </div>
                    <img  className="aboutSectionImg" src="./photos/content/Trainings.jpg" alt="" />
                  </div>
                  


                </div>
                <div className='aboutDivider'/>
                <div className='aboutSection'>
                  <h2 className='aboutSectionHeader'><span className='lacuna'> Social</span>  <br/> EVENTS</h2>
                  <div className='aboutSectionBody'>
                    <img  className="aboutSectionImg" src="./photos/content/Events.jpg" alt="" />
                    <div className='aboutSectionDescription'>
                      <p>
                        The social events planned by our committee gives our members a chance to bond outside of the gym. <br/>
                        <br/>
                        Past events include:<br/>
                        - Annual Muay Thai Retreat<br/>
                        - Karaoke Night<br/>
                        - Collabs with other UoA Clubs<br/>
                        <br/>
                        Keep updated on our socials for any events!
                      </p>
                    
                      <div className="btnContainer">
                        <button className="boldBtn pink"><a href='/events'>JOIN EVENTS</a>  </button>
                      </div>
                    </div>
                    
                  </div>
                  


                </div>
                <div className='aboutDivider'/>
                <div className="aboutFooterNotes">
                    <h3 className='aboutSectionHead'>WANT TO KNOW MORE?</h3>
                    <p>Check out our <Link to='/faq'>FAQ page</Link>, get in touch through
                    <a href='mailto:uoamuaythai@gmail.com'> uoamuaythai@gmail.com </a>
                    or&nbsp;
                    <Button className='aboutInlineLink' type='link' onClick={Links.openAumtFb}>Facebook </Button>
                    /
                    <Button className='aboutInlineLink' type='link' onClick={Links.openAumtInsta}>Instagram</Button>.
                    </p>
                </div>
            </div>
        )
    }
}