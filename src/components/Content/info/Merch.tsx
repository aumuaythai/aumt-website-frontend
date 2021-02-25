import React, {Component} from 'react'
import {Divider} from 'antd'
import './Merch.css'

export class Merch extends Component {

    render() {
        return (
            <div className="merchContainer">
                <h1 className = "header">Merchandise</h1>
        
                <div className = "imgcontainer">
                    <img className='photoshoot' src="./photos/merch/merchLeft.jpg" alt="Showing off the AUMT shirt and shorts"/>
                    <img className='photoshoot' src="./photos/merch/merchMid.jpg" alt="Showing off the AUMT shirt and shorts"/>
                    <img className='photoshoot' src="./photos/merch/merchRight.jpg" alt="The back of the AUMT shirt and shorts"/>
                </div>

                <div className = "contentContainer">
                    <div className = "tshirtContainer">
                        <h2><span className = "tshirtHeading">T-Shirt</span></h2>
                        <p>$20</p>
                        <p>This shirt has the AUMT logo on the front and a custom design on the back depicting a dragon</p>
                        <p>The shirt is made of polyester which is highly breathable and ideal for training</p>
                        <p>Available in sizes S-XXXL</p>
                    </div>

                    <div className = "wrapsContainer">
                        <h2><span className = "wrapsHeading">Wrist Wraps</span></h2>
                        <p>$10-25</p>
                        <p>Wrist wraps are worn in order to protect and support the wrist during punches</p>
                        <p>Wraps come in many different colours and patterns, the length may also vary</p>
                        <p>Usually made using a blend of elastic gauze and cotton</p>
                        

                    </div>

                    <div className = "shortsContainer">
                        <h2><span className = "shortsHeading">Shorts</span></h2>
                        <p>$45</p>
                        <p>This style of shorts are traditionally worn by Muay Thai fighters during training and fighting</p>
                        <p>These shorts allow for good range of motion and are made of a nylon and polyester blend which is ideal for training </p>
                        <p>Available in sizes S-XXXXL</p>
                    </div>
                </div>
            </div>
            
        )
    }
}
