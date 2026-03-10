"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectCards } from "swiper/modules"

import "swiper/css"
import "swiper/css/effect-cards"

type HeroSliderProps = {
  images: string[]
  title: string
}

export default function HeroSlider({ images, title }: HeroSliderProps) {
  if (!images.length) {
    return null
  }

  return (
    <div className="h-full w-full">
      <Swiper
        effect="cards"
        grabCursor
        loop={images.length > 1}
        autoplay={images.length > 1 ? { delay: 2500, disableOnInteraction: false } : false}
        modules={[EffectCards, Autoplay]}
        className="w-[400px] h-[300px]"
      >
        {images.map((imageUrl, index) => (
          <SwiperSlide key={`${imageUrl}-${index}`}>
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <Image
                src={imageUrl}
                alt={`${title} banner ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1280px"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
