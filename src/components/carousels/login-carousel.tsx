'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const slides = [
  '/slider-img-running.jpg',
  '/slider-img-pool.jpg',
  '/slider-img-tennisgirl.jpeg',
  '/slider-img-tennis.jpg',
  '/slider-img-water.jpeg',
]

export function LoginCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {slides.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            fill
            priority={i === 0}
            sizes="50vw"
            className="h-screen w-full object-cover"
            src={src}
            alt=""
          />
        </div>
      ))}
    </div>
  )
}
