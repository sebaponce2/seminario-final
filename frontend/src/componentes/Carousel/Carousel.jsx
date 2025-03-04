"use client"

import { useState, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../components/ui/carousel"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

export default function ImageCarousel({ images = [] }) {
  const [api, setApi] = useState(null)
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Usar imágenes por defecto si no se proporciona ninguna
  const defaultImages = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/carousel-o68PK3j7xqiRe2ZebmOYHjANKdebas.png",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ]

  const carouselImages = images?.length > 0 ? images : defaultImages

  const openModal = (index) => {
    setSelectedImageIndex(index)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden" // Prevenir scroll del body
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = "auto" // Restaurar scroll del body
  }

  const handleModalClick = (e) => {
    if (e.target.id === "modal-overlay") {
      closeModal()
    }
  }

  return (
    <div className="relative w-full">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {carouselImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-96 object-cover cursor-pointer rounded-lg"
                  onClick={() => openModal(index)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 border-0" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 border-0" />
      </Carousel>
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={cn("h-2 w-2 rounded-full transition-all", current === index ? "bg-black" : "bg-gray-300")}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Modal para ver imagen ampliada */}
      {isModalOpen && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={handleModalClick}
        >
          <div className="relative w-11/12 md:w-4/5 max-w-4xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white rounded-full p-1 z-10"
              aria-label="Cerrar modal"
            >
              <X className="h-6 w-6" />
            </button>

            <Carousel className="w-full" defaultIndex={selectedImageIndex}>
              <CarouselContent>
                {carouselImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="flex justify-center">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Imagen ampliada ${index + 1}`}
                        className="max-h-[80vh] max-w-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 border-0" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 border-0" />
            </Carousel>

            <div className="text-center text-white mt-4">
              {selectedImageIndex + 1} / {carouselImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

