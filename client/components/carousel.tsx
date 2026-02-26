'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';

export interface CarouselItem {
  id: number;
  url: string;
  title: string;
  subtitle?: string;
}

interface DraggableCarouselProps {
  items: CarouselItem[];
  height?: number;
  onSlideClick?: (item: CarouselItem) => void;
}

export default function DraggableCarousel({ items, height = 220, onSlideClick }: DraggableCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    if (!isDragging && containerRef.current) {
      const w = containerRef.current.offsetWidth || 1;
      animate(x, -index * w, { type: 'spring', stiffness: 340, damping: 34 });
    }
  }, [index, x, isDragging]);

  // Auto-advance every 5s
  useEffect(() => {
    const t = setInterval(() => {
      if (!isDragging) setIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(t);
  }, [isDragging, items.length]);

  return (
    <div className='relative overflow-hidden rounded-2xl' ref={containerRef} style={{ height }}>
      {/* Draggable strip */}
      <motion.div
        className='flex h-full cursor-grab active:cursor-grabbing'
        drag='x'
        dragElastic={0.12}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          const w = containerRef.current?.offsetWidth || 1;
          const { offset, velocity } = info;
          let next = index;
          if (Math.abs(velocity.x) > 400) {
            next = velocity.x > 0 ? index - 1 : index + 1;
          } else if (Math.abs(offset.x) > w * 0.25) {
            next = offset.x > 0 ? index - 1 : index + 1;
          }
          setIndex(Math.max(0, Math.min(items.length - 1, next)));
        }}
        style={{ x }}
      >
        {items.map((item, i) => (
          <div key={item.id} className='relative h-full w-full shrink-0' onClick={() => !isDragging && onSlideClick?.(item)}>
            <img src={item.url} alt={item.title} className='pointer-events-none h-full w-full select-none object-cover' draggable={false} />
            {/* Layered gradient — cinematic */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent' />
            <div className='absolute inset-0 bg-gradient-to-r from-black/20 to-transparent' />

            {/* Slide content */}
            <div className='absolute bottom-0 left-0 p-5'>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: i === index ? 1 : 0, y: i === index ? 0 : 8 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {item.subtitle && (
                  <p className='mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/90'>{item.subtitle}</p>
                )}
                <p className='text-xl font-bold leading-none tracking-tight text-white drop-shadow'>{item.title}</p>
              </motion.div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Prev / Next — minimal, elegant */}
      {index > 0 && (
        <button
          onClick={() => setIndex((i) => i - 1)}
          className='absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition hover:bg-black/40'
        >
          <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M15 19l-7-7 7-7' />
          </svg>
        </button>
      )}
      {index < items.length - 1 && (
        <button
          onClick={() => setIndex((i) => i + 1)}
          className='absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition hover:bg-black/40'
        >
          <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M9 5l7 7-7 7' />
          </svg>
        </button>
      )}

      {/* Progress bar style indicator — more refined than dots */}
      <div className='absolute bottom-3 right-4 flex items-center gap-1.5'>
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`duration-400 h-[3px] rounded-full transition-all ${
              i === index ? 'w-6 bg-white' : 'w-2 bg-white/35 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Slide count */}
      <div className='absolute right-4 top-4 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-semibold tabular-nums text-white/80 backdrop-blur-md'>
        {index + 1} / {items.length}
      </div>
    </div>
  );
}
