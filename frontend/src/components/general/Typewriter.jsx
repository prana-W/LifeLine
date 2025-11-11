import { useEffect, useState } from "react";

const MultiLangTypewriter = ({ texts = ["Welcome"] }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => setBlink(prev => !prev), 500);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const currentText = texts[index];

    if (!deleting && subIndex < currentText.length) {
      const timeout = setTimeout(() => setSubIndex(prev => prev + 1), 120);
      return () => clearTimeout(timeout);
    }

    if (!deleting && subIndex === currentText.length) {
      const timeout = setTimeout(() => setDeleting(true), 1500);
      return () => clearTimeout(timeout);
    }

    if (deleting && subIndex > 0) {
      const timeout = setTimeout(() => setSubIndex(prev => prev - 1), 80);
      return () => clearTimeout(timeout);
    }

    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex(prev => (prev + 1) % texts.length);
    }
  }, [subIndex, deleting, index, texts]);

  return (
    <div className="flex items-center justify-center p-4">
      <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
        {texts[index].substring(0, subIndex)}
        <span className={`${blink ? "opacity-100" : "opacity-0"} transition-opacity`}>|</span>
      </h1>
    </div>
  );
};

export default MultiLangTypewriter;
