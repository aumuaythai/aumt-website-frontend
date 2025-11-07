// import eventsImg from '@/assets/photos/Events_Coloured.jpg'
// import landingImg from '@/assets/photos/Landing_Coloured.jpg'
// import trainingsImg from '@/assets/photos/Trainings_Coloured.jpg'
// import { Button } from 'antd'
// import { Link } from 'react-router'
// import { useConfig } from '../../context/ClubConfigProvider'
// import { cn } from '../../lib/utils'
// import { Links } from '../../services/links'

// export default function About() {
//   const clubConfig = useConfig()
//   const semesterFee = clubConfig?.semesterOneFee
//   const fullYearFee = clubConfig?.fullYearFee

//   return (
//     <div className="flex flex-col items-center justify-center pb-6 text-center">
//       <div className="relative bg-[#14947e] h-[500px] w-full flex-col flex items-center justify-center">
//         <img
//           src={landingImg}
//           alt="Two people training in a Muay Thai gym"
//           className="object-cover absolute inset-0 size-full"
//         />
//         <div className="inset-0 absolute bg-black/25 backdrop-blur-xs" />
//         <h1 className="text-[1.8vw] text-white drop-shadow-lg drop-shadow-white/20">
//           Auckland University
//         </h1>
//         <h1 className="text-[5vw] text-white drop-shadow-lg drop-shadow-white/20 leading-none">
//           MUAY THAI
//         </h1>
//       </div>

//       <div className="pt-10 pb-5">
//         <h3 className="text-2xl">
//           AUMT INTRODUCES STUDENTS TO THE ART OF MUAY THAI
//         </h3>
//         <p>
//           Run by a passionate group of Muay Thai enthusiasts, we run weekly
//           trainings and social events. <br />
//           We aim to teach martial arts in a friendly and low-pressure
//           environment.
//           <br />
//           All experience levels are welcome!
//         </p>
//       </div>
//       <div className="flex flex-col xl:flex-row max-w-[1000px] w-full gap-2.5">
//         <BoldButton text="TRAININGS" href="/signups" color="teal" />
//         <BoldButton text="EVENTS" href="/events" color="teal" />
//       </div>
//       <div className="pt-10 pb-5">
//         <h3 className="text-2xl">WHAT IS MUAY THAI?</h3>
//         <p>
//           Known as the Art of Eight Limbs, this martial art discipline from
//           Thailand is characterized by combat <br /> utilising the fists,
//           elbows, knees and shins. It is a highly effective martial art and
//           great for self-defence.
//         </p>
//       </div>

//       <Divider />

//       <Section>
//         <h2 className="leading-[80%] text-[25px]">
//           <span className="font-lacuna text-[50px]"> Membership</span> <br />{' '}
//           Price
//         </h2>
//         <div className="flex flex-col xl:flex-row justify-center pt-5 pb-7 w-full max-w-[500px] xl:max-w-[1000px] gap-2.5">
//           <div className="font-joyride text-[30px] py-3 px-7 text-center border-none bg-[#fbe74a] flex-1">
//             1 SEMESTER <br /> ${semesterFee}
//           </div>
//           <div className="font-joyride text-[30px] py-3 px-7 text-center border-none bg-[#fbe74a] flex-1">
//             FULL YEAR <br /> ${fullYearFee}
//           </div>
//           <div className="font-joyride text-[30px] py-3 px-7 text-center border-none bg-black text-white flex-1">
//             1 OFF CLASS* <br /> $10
//           </div>
//         </div>
//         <p>
//           An AUMT membership gives you access to as many classes as you want per
//           week and discounted prices to our priced events! <br />
//           *One off classes are allowed for $10, please message us to book a
//           1-off session.
//         </p>
//       </Section>

//       <Divider />

//       <Section>
//         <h2 className="leading-[80%] text-[25px]">
//           <span className="font-lacuna text-[50px]"> Weekly</span> <br />{' '}
//           TRAININGS
//         </h2>
//         <SectionBody>
//           <div className="text-left flex flex-col justify-center items-center w-full xl:w-1/2">
//             <p className="px-5">
//               Trainings consist of up to 40 members. Our trainers and committee
//               are at trainings to help you learn and give personalized feedback,
//               so never hesitate to ask! <br />
//               <br />
//               Our classes are tailored to different skill levels.
//               <br />
//               <br />
//               - Beginners Trainings are best for those with little to no Muay
//               Thai experience. Learn the fundamentals of Muay Thai in a
//               low-pressure and friendly environment.
//               <br />
//               <br />
//               - Intermediate Trainings are best for those who have prior Muay
//               Thai experience and/or approval from committee and coach. A more
//               serious pace, these classes teach more advanced techniques and
//               include sparring.
//               <br />
//             </p>
//             <BoldButton
//               text="SIGN UP TO TRAINING"
//               href="/signups"
//               color="orange"
//             />
//           </div>

//           <img
//             src={trainingsImg}
//             alt="A member holding a Muay Thai pad for another member"
//             className="object-cover xl:w-1/2"
//           />
//         </SectionBody>
//       </Section>

//       <Divider />

//       <Section>
//         <h2 className="leading-[80%] text-[25px]">
//           <span className="font-lacuna text-[50px]"> Social</span> <br /> EVENTS
//         </h2>
//         <SectionBody>
//           <img
//             src={eventsImg}
//             alt="Three members having fun at a social event"
//             className="object-cover xl:w-1/2"
//           />
//           <div className="w-full text-left flex flex-col justify-center items-center xl:w-1/2">
//             <p className="px-5">
//               The social events planned by our committee give our members a
//               chance to bond outside of training. <br />
//               <br />
//               Past events have included:
//               <br />
//               - Annual Muay Thai Retreat
//               <br />
//               - Karaoke Night
//               <br />
//               - Collabs with other UoA Clubs
//               <br />
//               <br />
//               Keep an eye on our socials for upcoming events!
//             </p>

//             <BoldButton text="JOIN EVENTS" href="/events" color="pink" />
//           </div>
//         </SectionBody>
//       </Section>

//       <Divider />

//       <div className="p-10 flex flex-col justify-center items-center xl:text-left">
//         <h3 className="text-2xl">WANT TO KNOW MORE?</h3>
//         <p>
//           Check out our <Link to="/faq">FAQ page</Link>, get in touch through
//           <a href="mailto:uoamuaythai@gmail.com" className="text-[#11388d]">
//             {' '}
//             uoamuaythai@gmail.com{' '}
//           </a>
//           or&nbsp;
//           <Button
//             className="!p-0 m-0 !text-[#11388d]"
//             type="link"
//             onClick={Links.openAumtFb}
//           >
//             Facebook
//           </Button>
//           /
//           <Button
//             className="!p-0 m-0 !text-[#11388d]"
//             type="link"
//             onClick={Links.openAumtInsta}
//           >
//             Instagram
//           </Button>
//           .
//         </p>
//       </div>
//     </div>
//   )
// }

// function Section({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="py-[50px] w-full max-w-[1200px] flex flex-col items-center">
//       {children}
//     </div>
//   )
// }

// function SectionBody({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="w-full flex justify-between gap-5 py-5 xl:flex-row flex-col xl:px-0 px-5">
//       {children}
//     </div>
//   )
// }

// function Divider() {
//   return <div className="w-full max-w-[1200px] h-[5px] bg-black" />
// }

// const buttonColors = {
//   teal: '!bg-teal-500 text-white hover:!bg-teal-600 flex-1 !transition-colors',
//   yellow: '!bg-yellow-500 text-white hover:!bg-yellow-600 !transition-colors',
//   orange: '!bg-orange-500 text-white hover:!bg-orange-600 !transition-colors',
//   pink: '!bg-rose-500 text-white hover:!bg-rose-600 !transition-colors',
// }

// function BoldButton({
//   text,
//   href,
//   color,
// }: {
//   text: string
//   href: string
//   color: keyof typeof buttonColors
// }) {
//   return (
//     <div className="flex flex-col xl:flex-row justify-center items-center pt-5 pb-7 w-full max-w-[1000px] gap-x-2.5">
//       <Link
//         to={href}
//         className={cn(
//           'font-joyride text-xl py-3 px-7 text-center border-none cursor-pointer max-w-[500px] xl:max-w-none xl:w-fit w-full',
//           buttonColors[color]
//         )}
//       >
//         {text}
//       </Link>
//     </div>
//   )
// }

import eventsImg from '@/assets/photos/Events_Coloured.jpg'
import landingImg from '@/assets/photos/Landing_Coloured.jpg'
import trainingsImg from '@/assets/photos/Trainings_Coloured.jpg'
import { Button } from 'antd'
import { Link } from 'react-router'
import { useConfig } from '../../context/ClubConfigProvider'
import { Links } from '../../services/links'

export default function About() {
  const clubConfig = useConfig()
  const semesterFee = clubConfig?.semesterOneFee
  const fullYearFee = clubConfig?.fullYearFee

  return (
    <div className="pb-6 text-center">
      <div className="relative bg-[#14947e] h-[500px] w-full flex-col flex items-center justify-center">
        <img
          src={landingImg}
          alt="Two people training in a Muay Thai gym"
          className="object-cover absolute inset-0 size-full"
        />
        <div className="inset-0 absolute bg-black/25 backdrop-blur-xs" />
        <div>
          <h1 className="text-[4vw] lg:text-[1.8vw] text-white drop-shadow-lg drop-shadow-white/20">
            Auckland University
          </h1>
          <h1 className="text-[10vw] lg:text-[5vw] text-white drop-shadow-lg drop-shadow-white/20 leading-none">
            MUAY THAI
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col gap-y-20 px-6">
        <section className="mt-10">
          <h3 className="text-2xl">
            AUMT INTRODUCES STUDENTS TO THE ART OF MUAY THAI
          </h3>
          <p className="mt-3">
            Run by a passionate group of Muay Thai enthusiasts, we run weekly
            trainings and social events. <br />
            We aim to teach martial arts in a friendly and low-pressure
            environment.
            <br />
            All experience levels are welcome!
          </p>

          <div className="flex mt-12 flex-col xl:flex-row max-w-4xl mx-auto w-full gap-2.5">
            <Link
              to="/signups"
              className="font-joyride inline-block text-xl w-full py-3 px-8 cursor-pointer bg-teal-500 text-white hover:bg-teal-600 transition-colors"
            >
              TRAININGS
            </Link>
            <Link
              to="/events"
              className="font-joyride inline-block text-xl w-full py-3 px-8 cursor-pointer bg-teal-500 text-white hover:bg-teal-600 transition-colors"
            >
              EVENTS
            </Link>
          </div>

          <h3 className="text-2xl mt-12">WHAT IS MUAY THAI?</h3>
          <p className="mt-3">
            Known as the Art of Eight Limbs, this martial art discipline from
            Thailand is characterized by combat <br /> utilising the fists,
            elbows, knees and shins. It is a highly effective martial art and
            great for self-defence.
          </p>
        </section>

        <div className="h-px bg-gray-200" />

        <section>
          <h2 className="flex items-center flex-col text-2xl -space-y-4">
            <span className="font-lacuna text-5xl">Membership</span>
            <span>Price</span>
          </h2>

          <div className="flex mt-8 flex-col xl:flex-row max-w-5xl mx-auto justify-center gap-2.5">
            <div className="font-joyride text-3xl py-5 px-7 border-none bg-amber-300 text-black flex-1">
              1 OFF CLASS* <br /> $10
            </div>
            <div className="font-joyride text-3xl py-5 px-7 border-none bg-amber-400 flex-1">
              1 SEMESTER <br /> ${semesterFee}
            </div>
            <div className="font-joyride text-3xl py-5 px-7 border-none bg-amber-500 flex-1">
              FULL YEAR <br /> ${fullYearFee}
            </div>
          </div>

          <p className="mt-6">
            An AUMT membership gives you access to as many classes as you want
            per week and discounted prices to our priced events!
            <br />
            *One off classes are allowed for $10, please message us to book a
            1-off session.
          </p>
        </section>

        <div className="h-px bg-gray-200" />

        <section>
          <h2 className="flex items-center flex-col text-2xl -space-y-4">
            <span className="font-lacuna text-5xl">Weekly</span>
            <span>TRAININGS</span>
          </h2>

          <div className="flex flex-col lg:flex-row mt-8 items-center gap-10">
            <div>
              <p className="text-left">
                Trainings are scheduled throughout the week, with trainers and
                committee members present to provide personalised guidance.
              </p>

              <p className="text-left mt-4">
                <span className="font-bold">Beginner trainings</span> are best
                for those with little to no Muay Thai experience. Learn the
                fundamentals of Muay Thai in a low-pressure and friendly
                environment.
              </p>
              <p className="mt-4 text-left">
                <span className="font-bold">Intermediate trainings</span> are
                best for those who have prior Muay Thai experience and/or
                approval from committee and coach. These classes teach more
                advanced techniques and include sparring.
              </p>

              <Link
                to="/signups"
                className="font-joyride inline-block mt-6 text-xl py-3 px-8 cursor-pointer bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                SIGN UP TO TRAININGS
              </Link>
            </div>

            <img
              src={trainingsImg}
              alt="A member holding a Muay Thai pad for another member"
              className="object-cover lg:w-1/2"
            />
          </div>
        </section>

        <div className="h-px bg-gray-200" />

        <section>
          <h2 className="flex items-center flex-col text-2xl -space-y-4">
            <span className="font-lacuna text-5xl">Social</span>
            <span>EVENTS</span>
          </h2>

          <div className="flex flex-col-reverse lg:flex-row mt-8 items-center gap-10">
            <img
              src={eventsImg}
              alt="Three members having fun at a social event"
              className="object-cover lg:w-1/2"
            />

            <div>
              <p className="text-left">
                The social events planned by our committee give our members a
                chance to bond outside of training.
              </p>
              <p className="text-left mt-4">Past events include:</p>
              <ul className="text-left list-disc list-inside mt-2">
                <li>Annual Muay Thai Retreat</li>
                <li>Karaoke Night</li>
                <li>Collabs with other UoA clubs</li>
              </ul>
              <p className="text-left mt-4">
                Keep an eye on our socials for upcoming events!
              </p>
              <Link
                to="/events"
                className="font-joyride inline-block mt-6 text-xl py-3 px-8 cursor-pointer bg-rose-500 text-white hover:bg-rose-600 transition-colors"
              >
                JOIN EVENTS
              </Link>
            </div>
          </div>
        </section>

        <div className="h-px bg-gray-200" />

        <section>
          <div className="flex flex-col justify-center items-center xl:text-left">
            <h3 className="text-2xl">WANT TO KNOW MORE?</h3>
            <p className="mt-4">
              Check out our <Link to="/faq">FAQ page</Link>, get in touch
              through
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
        </section>
      </div>
    </div>
  )
}
