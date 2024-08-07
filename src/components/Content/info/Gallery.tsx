import React, {Component} from 'react'
import './Gallery.css'
import { Carousel } from 'antd';
import 'antd/dist/antd.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'


export class Gallery extends Component {

    render() {
        return (
            <div className="galleryContainer">
              <h1>Gallery</h1>
              <div className="carouselContainer">
                <Carousel arrows infinite={false} prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />} autoplay>
                  <div className='imgContainer'>
                    <img className="galleryImg" src="./photos/content/gallery0.JPG" alt="" />
                  </div>
                  <div className='imgContainer'>
                    <img className="galleryImg" src="./photos/content/gallery1.JPG" alt="" />
                  </div >
                  <div className='imgContainer'>
                    <img className="galleryImg" src="./photos/content/gallery2.JPG" alt=""/>
                  </div>
                  <div className='imgContainer'>
                    <img className="galleryImg" src="./photos/content/gallery3.JPG" alt="" />
                  </div>
                  <div className='imgContainer'>
                    <img className="galleryImg" src="./photos/content/gallery4.JPG" alt="" />
                  </div>
                </Carousel>
              </div>
              
            </div>
            
        )
    }
}
