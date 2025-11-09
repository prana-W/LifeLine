//pass props like below
//<Timeline items={timeData} gap={200}/>
import { useEffect, useRef } from "react";

const Timeline = ({ items = [], gap = 56 }) => {
  const sliderRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const container = containerRef.current;
    
    if (!slider || !container) return;

    let x = 0;
    let animationFrameId;

    // Calculate the width of one set of items including gaps
    const itemWidth = 256; // w-64 = 16rem = 256px
    const singleSetWidth = (itemWidth + gap) * items.length;

    const animate = () => {
      x -= 1; // speed (increase to go faster)
      slider.style.transform = `translateX(${x}px)`;

      // Reset when one complete set has scrolled past
      if (Math.abs(x) >= singleSetWidth) {
        x = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [items.length, gap]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden py-6 bg-white">
      <div
        ref={sliderRef}
        className="flex"
        style={{ gap: `${gap}px` }}
      >
        {/* Duplicate items for infinite loop */}
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="w-64 h-40 bg-white/10 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-white/30 hover:z-10"
          >
            <img
              src={item.image}
              className="w-full h-full object-cover"
              alt={item.title || ""}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline