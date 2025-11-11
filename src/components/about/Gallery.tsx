import gallery0 from '@/assets/photos/gallery0.jpg'
import gallery1 from '@/assets/photos/gallery1.jpg'
import gallery2 from '@/assets/photos/gallery2.jpg'
import gallery3 from '@/assets/photos/gallery3.jpg'
import gallery4 from '@/assets/photos/gallery4.jpg'
import { Carousel } from 'antd'

export default function Gallery() {
  return (
    <div className="p-6">
      <h1 className="text-3xl text-center">Gallery</h1>
      <Carousel arrows autoplay className="max-w-[1200px] mx-auto mt-5">
        <img src={gallery0} alt="" />
        <img src={gallery1} alt="" />
        <img src={gallery2} alt="" />
        <img src={gallery3} alt="" />
        <img src={gallery4} alt="" />
      </Carousel>
    </div>
  )
}
