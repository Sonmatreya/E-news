'use client'
import React from 'react'
import Image from 'next/image'
import { base_api_url } from '../../config/config'

const Gallery = () => {

    const [images, setImages] = React.useState([])

    React.useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch(`${base_api_url}/api/images/news`)
                const data = await res.json()
                setImages(data.images || [])
            } catch (error) {
                console.error('Error fetching images:', error)
            }
        }
        fetchImages()
    }, [])

    return (
        <div className="w-full flex flex-col gap-y-[14px]">
            <div className="text-xl font-bold text-white relative before:absolute before:w-[4px] before:bg-[#c80000] before:h-full before:-left-0 pl-3">
                Gallery
            </div>
            <div className="grid grid-cols-3 gap-2">
                {images && images.length > 0 && images.map((item, i) => (
                    <div key={i} className="w-full h-[85px] relative overflow-hidden" style={{ position: 'relative' }}>
                        <Image
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            src={
                                item.image
                            }
                            alt="images"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Gallery
