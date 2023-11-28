import React, {Component} from 'react'
import {Divider} from 'antd'
import './Team.css'
// import { CommitteeApplicationForm } from './CommitteeApplicationForm'
// import { RenderMarkdown } from '../../utility/RenderMarkdown'

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
* Preferred but not mandatory: experience in photoshop, public relations or mailchimp
    `
    render() {
        return (
            <div className='teamContainer'>
                    {/* <div>
                        <h1>Applications</h1>
                        <div className='committeeApplicationsContainer'>
                            <RenderMarkdown source={this.committeeAppMd}></RenderMarkdown>
                    {Date.now() < 160292160000 ?
                            <CommitteeApplicationForm></CommitteeApplicationForm>
                        : <p>Committee applications have closed. Message the AUMT page on Facebook or Instagram with any questions.</p>}
                        </div>
                    </div>
                <Divider/> */}
                <div className="teamGroup">
                    <h1>AUMT Committee</h1>

                    <div className='imgRow'>
                       coming soon!
                    </div>
                </div>
            </div>
        )
    }
}

export default Team