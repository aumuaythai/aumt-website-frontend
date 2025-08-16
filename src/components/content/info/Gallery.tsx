import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Carousel } from 'antd'
import './Gallery.css'

export default function Gallery() {
  return (
    <div>
      <h1 className="text-3xl">Gallery</h1>
      <div className="max-w-[1200px] mx-auto">
        <Carousel
          arrows
          infinite={false}
          prevArrow={<LeftOutlined />}
          nextArrow={<RightOutlined />}
          autoplay
        >
          <div className="bg-black p-0 w-fit box-border">
            <img
              className="w-full max-w-[1200px] m-0"
              src="./photos/content/gallery0.JPG"
              alt=""
            />
          </div>
          <div className="bg-black p-0 w-fit box-border">
            <img
              className="w-full max-w-[1200px] m-0"
              src="./photos/content/gallery1.JPG"
              alt=""
            />
          </div>
          <div className="bg-black p-0 w-fit box-border">
            <img
              className="w-full max-w-[1200px] m-0"
              src="./photos/content/gallery2.JPG"
              alt=""
            />
          </div>
          <div className="bg-black p-0 w-fit box-border">
            <img
              className="w-full max-w-[1200px] m-0"
              src="./photos/content/gallery3.JPG"
              alt=""
            />
          </div>
          <div className="bg-black p-0 w-fit box-border">
            <img
              className="w-full max-w-[1200px] m-0"
              src="./photos/content/gallery4.JPG"
              alt=""
            />
          </div>
        </Carousel>
      </div>
    </div>
  )
}
