import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { useConfig } from '../../../context/ConfigProvider'
import { Links } from '../../../services/links'
import { cn } from '../../utility/utils'

export default function About() {
  const { clubConfig } = useConfig()
  const semesterFee = clubConfig?.semesterOneFee
  const fullYearFee = clubConfig?.fullYearFee

  return (
    <div className="flex flex-col items-center justify-center py-5">
      <h1 className="text-[25px] xl:text-[2.5vw] leading-[90%]">
        WELCOME TO <br />
        AUCKLAND UNIVERSITY MUAY THAI
      </h1>

      <img
        src="/photos/content/Landing_Coloured.jpg"
        alt="landing image"
        className="w-full h-[600px] object-cover"
      />
      <div className="pt-10 pb-5">
        <h3 className="text-2xl">
          AUMT INTODUCES STUDENTS TO THE ART OF MUAY THAI
        </h3>
        <p>
          Run by a passionate group of Muay Thai Enthusiasts, we run weekly
          trainings and social events. <br />
          we aim to teach martial arts in a friendly and low-pressure
          environment.
          <br />
          All experience levels are welcome!
        </p>
      </div>
      <div className="flex flex-col xl:flex-row max-w-[1000px] w-full gap-2.5">
        <BoldButton text="TRAININGS" href="/signups" color="teal" />
        <BoldButton text="EVENTS" href="/events" color="teal" />
      </div>
      <div className="pt-10 pb-5">
        <h3 className="text-2xl">WHAT IS MUAY THAI?</h3>
        <p>
          Known as the Art of Eight Limbs, this martial art discipline from
          Thailand is characterized by combat <br /> utilising the fists,
          elbows, knees and shins. It is a highly effective martial art and
          great for self-defence.
        </p>
      </div>

      <Divider />

      <Section>
        <h2 className="leading-[80%] text-[25px]">
          <span className="font-lacuna text-[50px]"> Membership</span> <br />{' '}
          Price
        </h2>
        <div className="flex flex-col xl:flex-row justify-center pt-5 pb-7 w-full max-w-[500px] xl:max-w-[1000px] gap-2.5">
          <div className="font-joyride text-[30px] py-3 px-7 text-center border-none bg-[#fbe74a] flex-1">
            1 SEMESTER <br /> ${semesterFee}
          </div>
          <div className="font-joyride text-[30px] py-3 px-7 text-center border-none bg-[#fbe74a] flex-1">
            FULL YEAR <br /> ${fullYearFee}
          </div>
          <div className="font-joyride text-[30px] py-3 px-7 text-center border-none bg-black text-white flex-1">
            1 OFF CLASS* <br /> $10
          </div>
        </div>
        <p>
          An AUMT membership gives you access to an 1 hour/1 class per week and
          discounted prices to our priced events! <br />
          *One off classes are allowed for $10, please message us to book a
          1-off session.
        </p>
      </Section>

      <Divider />

      <Section>
        <h2 className="leading-[80%] text-[25px]">
          <span className="font-lacuna text-[50px]"> Weekly</span> <br />{' '}
          TRAININGS
        </h2>
        <SectionBody>
          <div className="text-left flex flex-col justify-center items-center w-full xl:w-1/2">
            <p className="px-5">
              Trainings consist of up to 40 members. Our trainers and committee
              are at trainings to help you learn and give personalized feedback,
              so never hesitate to ask! <br />
              <br />
              Our classes are tailored to different skill levels.
              <br />
              <br />
              - Beginners Trainings are best for those with little to no Muay
              Thai experience. Learn the fundamentals of Muay Thai in a
              low-pressure and friendly environment.
              <br />
              <br />
              - Intermediate Trainings are best for those who have prior Muay
              Thai experience and/or approval from committee and coach. A more
              serious pace, these classes teach more advanced technique and
              includes sparring.
              <br />
            </p>
            <BoldButton
              text="SIGN UP TO TRAINING"
              href="/signups"
              color="orange"
            />
          </div>

          <img
            src="/photos/content/Trainings_Coloured.jpg"
            alt="landing image"
            className="w-full xl:w-1/2"
          />
        </SectionBody>
      </Section>

      <Divider />

      <Section>
        <h2 className="leading-[80%] text-[25px]">
          <span className="font-lacuna text-[50px]"> Social</span> <br /> EVENTS
        </h2>
        <SectionBody>
          <img
            src="/photos/content/Events_Coloured.jpg"
            alt="landing image"
            className="w-full xl:w-1/2"
          />
          <div className="w-full text-left flex flex-col justify-center items-center xl:w-1/2">
            <p className="px-5">
              The social events planned by our committee gives our members a
              chance to bond outside of the gym. <br />
              <br />
              Past events include:
              <br />
              - Annual Muay Thai Retreat
              <br />
              - Karaoke Night
              <br />
              - Collabs with other UoA Clubs
              <br />
              <br />
              Keep updated on our socials for any events!
            </p>

            <BoldButton text="JOIN EVENTS" href="/events" color="pink" />
          </div>
        </SectionBody>
      </Section>

      <Divider />

      <div className="p-10 flex flex-col justify-center items-center xl:text-left">
        <h3 className="text-2xl">WANT TO KNOW MORE?</h3>
        <p>
          Check out our <Link to="/faq">FAQ page</Link>, get in touch through
          <a href="mailto:uoamuaythai@gmail.com" className="text-[#11388d]">
            {' '}
            uoamuaythai@gmail.com{' '}
          </a>
          or&nbsp;
          <Button
            className="!p-0 m-0 !text-[#11388d]"
            type="link"
            onClick={Links.openAumtFb}
          >
            Facebook
          </Button>
          /
          <Button
            className="!p-0 m-0 !text-[#11388d]"
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

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-[50px] w-full max-w-[1200px] flex flex-col items-center">
      {children}
    </div>
  )
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex justify-between gap-5 py-5 xl:flex-row flex-col xl:px-0 px-5">
      {children}
    </div>
  )
}

function Divider() {
  return <div className="w-full max-w-[1200px] h-[5px] bg-black" />
}

const buttonColors = {
  teal: '!bg-teal-500 text-white hover:!bg-teal-600 flex-1 !transition-colors',
  yellow: '!bg-yellow-500 text-white hover:!bg-yellow-600 !transition-colors',
  orange: '!bg-orange-500 text-white hover:!bg-orange-600 !transition-colors',
  pink: '!bg-rose-500 text-white hover:!bg-rose-600 !transition-colors',
}

function BoldButton({
  text,
  href,
  color,
}: {
  text: string
  href: string
  color: keyof typeof buttonColors
}) {
  return (
    <div className="flex flex-col xl:flex-row justify-center items-center pt-5 pb-7 w-full max-w-[1000px] gap-x-2.5">
      <Link
        to={href}
        className={cn(
          'font-joyride text-xl py-3 px-7 text-center border-none cursor-pointer max-w-[500px] xl:max-w-none xl:w-fit w-full',
          buttonColors[color]
        )}
      >
        {text}
      </Link>
    </div>
  )
}
