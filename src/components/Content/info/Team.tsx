import React, {Component} from 'react'
import {Divider} from 'antd'
import './Team.css'
 import { CommitteeApplicationForm } from './CommitteeApplicationForm'
 import { RenderMarkdown } from '../../utility/RenderMarkdown'

class Team extends Component {
    private committeeAppMd = `
### What we do

Being part of the AUMT committee is an opportunity to get more involved with the best club in the world and it comes with endless benefits (see below).
You will be part of a small team that directs AUMT on its path towards world domination, little by little.
As there is a large variety of tasks the club has to manage, there is a variety of roles available to suit your skills.
Below are our roles and some loosely defined responsibilities for each:

* President and Vice President - Lead club operations, establish short and long term goals and plans, set deadlines and handle relations within committee
* Secretary - Create written content such as emails, organise meetings and take minutes, liase with social and events and web dev officers for logistics, promotion and content
* Treasurer - Create annual budget, receive and safeguard all payments for the club, discuss finances with members
* Social and Public Relations - Post on Instagram and Facebook, take photos at trainings and events, design event banners, reply to member messages
* Web Dev - maintain our new website, add features like this committee application form, get experience with Typescript, React and Firebase
* Events - Organise events and their logistics, liase with Public Relations Officer for event marketing

![Our Team](https://media.gettyimages.com/photos/together-wed-make-quite-a-formidable-team-picture-id854434990 "=192x260")

Pictured above: the current committee after a productive meeting.


### What's in it for you

* Gain experience leading and/or running a lively, vibrant club
* Free membership for the whole year
* Make awesome new friends
* Acquaint yourself with the Muay Thai community in Auckland
* Access exclusive committee trainings
* Each role's responsibilities can be a Major CV Addition™
* Much much more

### What we are looking for

* Passion for AUMT and Muay Thai
* Willingness to listen to feedback, learn and grow
* Ability to commit some time and effort towards the club throughout the year
* Willingness to make your voice heard; to contribute to new ideas and give feedback to your fellow committee members
* Preferred but not mandatory: experience in photoshop, public relations or Mailerlite
    `
    render() {
        return (
            <div className='teamContainer'>
                    <div>
                        <h1>Applications</h1>
                        <div className='committeeApplicationsContainer'>
                            <RenderMarkdown source={this.committeeAppMd}></RenderMarkdown>
                    {Date.now() < 16276463990000 ?
                            <CommitteeApplicationForm></CommitteeApplicationForm>
                        : <p>Committee applications have closed. Message the AUMT page on Facebook or Instagram with any questions.</p>}
                        </div>
                    </div>
                <Divider/>
                <div className="teamGroup">
                    <h1>Committee</h1>

                    <div className='imgRow mainRow'>
                        <div></div>
                        <div className='personContainer'>
                            <p className="name">Joon Kwon - President</p>
                            <img className='headshot' src="./photos/joon.jpg" alt="Joon Kwon"/>
                        </div>
                    </div>
                    <div className='imgRow'>
                        <div className='personContainer'>
                            <p className="name">Louise Miao - Secretary</p>
                            <img className='headshot' src="./photos/louise.jpg" alt="Louise Miao"/>
                        </div>
                        <div className='personContainer'>
                            <p className="name">Henry Gann - Web Developer</p>
                            <img className='headshot' src="./photos/henry.jpg" alt="Henry Gann"/>
                        </div>

                        <div className='personContainer'>
                            <p className="name">Jay Janah - Treasurer</p>
                            <img className='headshot' src="./photos/jay.jpg" alt="Jay Janah"/>
                        </div>
                        
                        </div>
                    </div>

                    <div className = 'imgRow'>
                    <div className='personContainer'>
                            <p className="name">James Stinson - Sponsorship Coordinator</p>
                            <img className='headshot' src="./photos/james.jpg" alt="James Stinson"/>
                    </div>
                    <div className='personContainer'>
                            <p className="name">Tatki "TK" Lo - Event Coordinator</p>
                            <img className='headshot' src="./photos/TK.jpg" alt="Tatki Lo"/>
                        </div>
                </div>
                <Divider></Divider>
                <div className="teamGroup">
                    <h1>Trainers</h1>
                    <div className='imgRow mainRow'>
                        <div className='personContainer'>
                            <p className="name">Victor Ng - Head Trainer</p>
                            <div className="imgContainer">
                                {/* <div className="aboutText">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo magni magnam dolor non quisquam deleniti nostrum voluptatibus dignissimos ducimus, sapiente ullam libero at voluptas amet rem, sint beatae, aperiam quod. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Exercitationem libero repellat voluptatum reprehenderit error aliquid cupiditate nemo harum modi id eum, voluptas voluptates, tempora architecto quibusdam vero, facere optio voluptatibus! Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita recusandae beatae dicta quaerat a eaque voluptatum fugiat tempore rem tempora, cum ab, reiciendis doloribus enim quasi. Sed ea at vel.
                                </div> */}
                                <img className='headshot' src="./photos/victor.jpg" alt="Victor Ng"/>
                            </div>
                        </div>
                    </div>
                    <div className='imgRow'>


                        <div className='personContainer'>
                            <p className="name">Emma Spierings</p>
                            <img className='headshot' src="./photos/emma.jpg" alt="Emma Spierings"/>
                        </div>
                        <div className='personContainer'>
                            <p className="name">Josh Webb</p>
                            <img className='headshot' src="./photos/josh.jpeg" alt="Josh Webb"/>
                        </div>
                        <div className='personContainer'>
                            <p className="name">Catherine Ma</p>
                            <img className='headshot' src="./photos/cat.jpg" alt="Josh Webb"/>
                        </div>

                        <div className='personContainer'>
                            <p className="name">Tom Haliday</p>
                            <img className='headshot' src="./photos/tom.jpg" alt="Josh Webb"/>
                        </div>
                        <div className='personContainer'>
                            <p className="name">Anthony Wei</p>
                            <img className='headshot' src="./photos/anthony.jpg" alt="Josh Webb"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Team