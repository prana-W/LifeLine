// Timeline Component With Text
import { useEffect, useRef } from "react";

const Timeline = ({ items = [], gap = 56 }) => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let x = 0;
    let animationFrameId;

    const itemWidth = 256; // card width
    const singleSetWidth = (itemWidth + gap) * items.length;

    const animate = () => {
      x -= 1;
      slider.style.transform = `translateX(${x}px)`;

      if (Math.abs(x) >= singleSetWidth) {
        x = 0;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [items.length, gap]);

  return (
    <div className="w-full overflow-hidden py-10 bg-white">
      <div
        ref={sliderRef}
        className="flex items-center"
        style={{ gap: `${gap}px` }}
      >
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            className="w-64 h-56 bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0 hover:scale-110 hover:shadow-2xl transition-all duration-300"
          >
            <img
              src={item.image}
              className="w-full h-36 object-cover"
              alt={item.title}
            />

            <div className="p-3 text-center">
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
