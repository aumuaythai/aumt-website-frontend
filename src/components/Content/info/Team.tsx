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

* President and Vice President - Lead club operations, establish short and long term goals and plans
* Secretary - Send emails to members, organise meetings, coordinate with web dev for training/event signups and logistics
* Treasurer - Collect and handle payments, make budgets
* Public Relations - Photography and posting on Instagram and Facebook, designing event banners, replying to member messages
* Web Dev - maintain our new website, add features like this committee application form, get experience with Typescript, React and Firebase

![Our Team](https://media.gettyimages.com/photos/together-wed-make-quite-a-formidable-team-picture-id854434990 "=192x260")

Pictured above: the current committee after a productive meeting.


### What's in it for you

* Continue training for free
* Make awesome new friends
* Each role's responsibilities can be a Major CV Addition™
* Leadership opportunities including training members
* Get to know the Muay Thai community in Auckland
* Exclusive committee trainings
* Much much more (if we listed all the benefits your computer would probably crash)

### What we are looking for

* Passion for AUMT and Muay Thai
* Willingness to learn and receive feedback
* Preferred but not mandatory: experience in photoshop, public relations or mailchimp
* Ability to commit some time and effort towards the club throughout the year
* Contribute consistently to the team, constructively give and listen to opinions
    `
    render() {
        return (
            <div className='teamContainer'>
                {/* {Date.now() < 1602072000000 ? 
                    <p>The application form will open Thursday 08/10</p> :
                    Date.now() < 1602921600000 ? */}
                    <div>
                        <h1>Applications</h1>
                        <div className='committeeApplicationsContainer'>
                            <RenderMarkdown source={this.committeeAppMd}></RenderMarkdown>
                            <CommitteeApplicationForm></CommitteeApplicationForm>
                        </div>
                    </div>
                {/* : <p>Committee applications have closed.</p>} */}
                <div className="teamGroup">
                    <h1>Committee</h1>
                    <div className='imgRow mainRow'>
                        <div></div>
                        <div className='personContainer'>
                            <p className="name">Tom Haliday - President</p>
                            <img className='headshot' src="./photos/tom.jpg" alt="Tom Haliday"/>
                        </div>
                        <div className='personContainer'>
                            <p className="name">Catherine Ma - Vice President</p>
                            <img className='headshot' src="./photos/cat.jpg" alt="Catherine Ma"/>
                        </div>
                    </div>
                    <div className='imgRow'>
                        <div className='personContainer'>
                            <p className="name">Karl Oberio - Secretary</p>
                            <img className='headshot' src="./photos/karl.jpg" alt="Karl Oberio"/>
                        </div>
                        <div className='personContainer'>
                            <p className="name">Alex Walker - Treasurer</p>
                            <img className='headshot' src="./photos/alex.jpg" alt="Alex Walker"/>
                        </div>
                        <div className='personContainer'>
                            <p className="name">Annie Milsom - Public Relations</p>
                            <img className='headshot' src="./photos/annie2.jpg" alt="Annie Milsom"/>
                        </div>
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
                            <p className="name">Sunny Thangavelu</p>
                            <img className='headshot' src="./photos/sunny.jpg" alt="Sundaresh Thangavelu"/>
                        </div>
                        <div className='personContainer'>
                            <p className="name">Johnson Lo</p>
                            <img className='headshot' src="./photos/johnson.jpg" alt="Johnson Lo"/>
                        </div>
                        <div className='personContainer'>
                            <p className="name">Huch</p>
                            <img className='headshot' src="./photos/huch.jpg" alt="Huch"/>
                        </div>
                        <div className='personContainer'>
                            <p className="name">Emma Spierings</p>
                            <img className='headshot' src="./photos/emma.jpg" alt="Emma Spierings"/>
                        </div>
                        <div className='personContainer'>
                            <p className="name">Christian Lux</p>
                            <img className='headshot' src="./photos/christian.jpg" alt="Christian Lux"/>
                        </div>
                        <div className='personContainer'>
                            <p className="name">Hasnaen Hossain</p>
                            <img className='headshot' src="./photos/hasnaen.jpg" alt="Hasnaen Hossain"/>
                        </div>
                        {/* <div className='personContainer'>
                            <p className="name">Kevin Ku</p>
                            <img className='headshot' src="./photos/kevin.jpg" alt="Kevin Ku"/>
                        </div> */}
                        <div className='personContainer'>
                            <p className="name">Josh Webb</p>
                            <img className='headshot' src="./photos/josh.jpeg" alt="Josh Webb"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Team