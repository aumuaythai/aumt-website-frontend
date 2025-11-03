import { Carousel } from 'antd'

export default function Gallery() {
  return (
    <div className="p-6">
      <h1 className="text-3xl">Gallery</h1>
      <Carousel arrows autoplay className="max-w-[1200px] mx-auto mt-5">
        <img src="./photos/content/gallery0.JPG" alt="" />
        <img src="./photos/content/gallery1.JPG" alt="" />
        <img src="./photos/content/gallery2.JPG" alt="" />
        <img src="./photos/content/gallery3.JPG" alt="" />
        <img src="./photos/content/gallery4.JPG" alt="" />
      </Carousel>
    </div>
  )
}
