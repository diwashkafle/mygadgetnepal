'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

type Banner = {
  id?: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
};

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    created() {
      setLoaded(true);
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // Autoplay + Pause on Hover
  useEffect(() => {
    if (!loaded || !instanceRef.current || banners.length === 0) return;

    const slider = instanceRef.current;
    let autoplay: NodeJS.Timeout;

    const start = () => {
      autoplay = setInterval(() => slider.next(), 4000);
    };
    const stop = () => clearInterval(autoplay);

    const sliderEl = slider.container;

    sliderEl.addEventListener('mouseenter', stop);
    sliderEl.addEventListener('mouseleave', start);

    start();

    return () => {
      stop();
      sliderEl.removeEventListener('mouseenter', stop);
      sliderEl.removeEventListener('mouseleave', start);
    };
  }, [loaded, banners]);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banner');
        const data: Banner[] = await res.json();

        const fallbackBanner: Banner = {
          id: 'fallback',
          title: 'Nepal’s Finest Tech Gadget',
          subtitle: 'Explore premium gadgets at unbeatable prices',
          image: '/fallbackBanner.svg',
          ctaText: 'Shop Now',
          ctaLink: '/products',
        };

        const filtered = data.filter((b) => b.image);
        setBanners([fallbackBanner, ...filtered]);
      } catch (err) {
        console.error('Banner fetch failed:', err);
        setBanners([
          {
            id: 'fallback',
            title: 'Nepal’s Finest Tech Gadget',
            subtitle: 'Explore premium gadgets at unbeatable prices',
            image: '/fallbackbanner.svg',
            ctaText: 'Shop Now',
            ctaLink: '/products',
          },
        ]);
      }
    };

    fetchBanners();
  }, []);

  if (banners.length === 0) {
    return (
      <div className="w-full aspect-[32/9] bg-neutral-900 animate-pulse rounded-md" />
    );
  }

  return (
    <div className="relative">
      <div
        ref={sliderRef}
        className="keen-slider w-full rounded-lg overflow-hidden relative h-[136px] sm:h-auto sm:aspect-[24/9] md:aspect-[32/9] bg-neutral-900"
      >
        {banners.map((banner, idx) => (
          <div
            key={idx}
            className="keen-slider__slide relative w-full aspect-[4/1] sm:aspect-[24/9] md:aspect-[32/9] rounded-md overflow-hidden shadow-md"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover"
            />
            <div className="absolute hidden bottom-0 md:flex flex-col justify-center items-start text-white p-10">
              {banner.ctaLink && (
                <Link href={banner.ctaLink}>
                  <Button className="mt-4 text-white bg-primary hover:bg-primary/90">
                    {banner.ctaText || 'Shop Now'}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Arrows — hidden on mobile */}
      {loaded && instanceRef.current && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            className="hidden sm:block absolute top-1/2 left-3 -translate-y-1/2 bg-black/10 text-white px-3 py-2 rounded-full z-10"
          >
            ◀
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="hidden sm:block absolute top-1/2 right-3 -translate-y-1/2 bg-black/10 text-white px-3 py-2 rounded-full z-10"
          >
            ▶
          </button>
        </>
      )}

      {/* Dots */}
      {loaded && instanceRef.current && (
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`sm:w-3 w-1 h-1 sm:h-3 rounded-full ${
                currentSlide === idx ? 'bg-primary' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
