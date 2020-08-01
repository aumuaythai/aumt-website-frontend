import React, {Component} from 'react'
import {Divider} from 'antd'
import './Team.css'

export class Team extends Component {
    render() {
        return (
            <div className='teamContainer'>
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
                            <p className="name">Tom Woodd</p>
                            <img className='headshot' src="./photos/tomwoodd.jpg" alt="Tom Woodd"/>
                        </div>
                        <div className='personContainer'>
                            <p className="name">Kurt Russel</p>
                            <img className='headshot' src="./photos/kurt.jpg" alt="Kurt Russel"/>
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
                        <div className='personContainer'>
                            <p className="name">Kevin Ku</p>
                            <img className='headshot' src="./photos/kevin.jpg" alt="Kevin Ku"/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}