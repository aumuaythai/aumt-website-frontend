import { Button, Divider } from 'antd'
import { useEffect, useState } from 'react'
import db from '../../../services/db'
import { Links } from '../../../services/links'
import { ClubConfig } from '../../../types/ClubConfig'
import './Faq.css'

export default function Faq() {
  const [clubConfig, setClubConfig] = useState<ClubConfig | null>(null)

  useEffect(() => {
    db.getClubConfig()
      .then((clubConfig: ClubConfig) => {
        setClubConfig(clubConfig)
      })
      .catch((error: any) => {
        console.error('Error fetching club configuration:', error)
      })
  }, [])

  return (
    <div className="faqContainer">
      <h1 className="faqTitle">FAQ</h1>
      <div className="questionContainer" key="trainings">
        <p className="question">Q: When and where are trainings?</p>
        <p className="answer">
          A: Find the timetable <a href="/signups">here</a>.
          <br />
          Trainings are located at the Hawks Nest Gym, 4/18 Beach Road.
        </p>
        <iframe
          title="Training Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d633.4536252469256!2d174.76206034919215!3d-36.856698459636775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d47bb9877fca5%3A0x70e64b98b3aeed38!2sThe%20Hawks&#39;%20Nest%20Gym!5e0!3m2!1sen!2snz!4v1644916967606!5m2!1sen!2snz"
          loading="lazy"
        />
        <Divider />
      </div>
      <div className="questionContainer" key="membership">
        <p className="question">Q: How much is a membership?</p>
        <p className="answer">
          A: Memberships are ${clubConfig?.semesterOneFee} for one semester or $
          {clubConfig?.fullYearFee} for the full year
        </p>
        <Divider />
      </div>
      <div className="questionContainer" key="join">
        <p className="question">Q: How do I join the club?</p>
        <p className="answer">
          A: You can join anytime throughout the year. Just pay for your
          membership as per the instructions.
          <br />
          If your payment has not been processed after a few days, let us know.
        </p>
        <Divider />
      </div>
      <div className="questionContainer" key="money">
        <p className="question">
          Q: How do we transfer money to AUMT for events or memberships?
        </p>
        <p className="answer">
          A: For online baking, our bank account is{' '}
          {clubConfig?.bankAccountNumber}.
          <br />
          For cash payments, message us and let us know you want to pay in cash.
          We will arrange the payment with you
        </p>
        <Divider />
      </div>
      <div className="questionContainer" key="bring">
        <p className="question">Q: What do I need to bring?</p>
        <p className="answer">
          A: Workout clothes, drink bottle and handwraps (if you have them).
          <br />
          <em>We highly recommend buying handwraps.</em>
          <br />
          <br />
          The club provides gloves and shinpads.
          <br />
          <em>If you have your own, please bring them.</em>
          <br />
          <br />
          For Intermediate/sparring, you must have a mouthguard.
          <br />
          <br />
        </p>
      </div>

      <div className="thickDivider" />

      <div className="bottomContainer">
        <h2>Have more questions?</h2>
        <p>
          Get in touch through
          <a href="mailto:uoamuaythai@gmail.com"> uoamuaythai@gmail.com </a>
          or&nbsp;
          <Button
            className="aboutInlineLink"
            type="link"
            onClick={Links.openAumtFb}
          >
            Facebook{' '}
          </Button>
          /
          <Button
            className="aboutInlineLink"
            type="link"
            onClick={Links.openAumtInsta}
          >
            Instagram
          </Button>
          .
        </p>
      </div>
    </div>
  )
}
