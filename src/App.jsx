
import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const getImagePath = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const flavours = [
  {
    line1: "Pistachio",
    line2: "Dream",
    color: "#8BC53F",
    img: "pistachio.jpg",
    topping: "pistachiotopping.jpg",
    description:
      "Rich Pistachio flavour with real bits. Creamy, crunchy and delicious — for true Pistachio lovers.",
  },
  {
    line1: "Choco",
    line2: "Fudge",
    color: "#3A2011",
    img: "choco.jpg",
    topping: "chocotopping.jpg",
    description:
      "Deep, dark chocolate swirled with ribbons of fudge. Rich, indulgent and unapologetically delicious.",
  },
  {
    line1: "Orange",
    line2: "Sunset",
    color: "#FF8A1A",
    img: "orange.jpg",
    topping: "orangetopping.jpg",
    description:
      "Fresh orange flavour with a creamy texture. A delicious fruity treat for every moment.",
  },
  {
    line1: "Strawberry",
    line2: "Bliss",
    color: "#FF4A7A",
    img: "strawberry.jpg",
    topping: "strawberrytopping.jpg",
    description:
      "Sweet strawberry flavour blended with smooth and creamy goodness.",
  },
  {
    line1: "Blueberry",
    line2: "Lagoon",
    color: "#526DAA",
    img: "blueberry.jpg",
    topping: "blueberrytopping.jpg",
    description:
      "Fresh blueberry flavour with creamy sweetness. A refreshing treat for every moment.",
  },
];

function ImgNoWhite({ src, className }) {
  const canvasRef = useRef(null);
  const [processed, setProcessed] = useState(null);

  const imageSrc = getImagePath(src);

  useEffect(() => {
    let cancelled = false;
    setProcessed(null);

    const img = new Image();

    img.onload = () => {
      if (cancelled || !canvasRef.current) return;

      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          if (r > 230 && g > 230 && b > 230) {
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);

        if (!cancelled) {
          setProcessed(canvas.toDataURL("image/png"));
        }
      } catch (error) {
        if (!cancelled) {
          setProcessed(imageSrc);
        }
      }
    };

    img.onerror = () => {
      if (!cancelled) {
        console.error("Image not found:", imageSrc);
        setProcessed(imageSrc);
      }
    };

    img.src = imageSrc;

    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
      />

      {processed && (
        <img
          src={processed}
          className={className}
          alt=""
          draggable="false"
        />
      )}
    </>
  );
}

export default function App() {
  const [active, setActive] = useState(0);

  const current = flavours[active];
  const next = flavours[(active + 1) % flavours.length];

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % flavours.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActive((prev) => (prev + 1) % flavours.length);
  };

  return (
    <div
      className="website"
      style={{ backgroundColor: current.color }}
    >
      <section className="banner">

        {/* LEFT CONTENT */}

        <div className="left">
          <h1>
            {current.line1}
            <br />
            {current.line2}
          </h1>

          <p>{current.description}</p>

          <button type="button">
            Order Now
          </button>
        </div>

        {/* CENTER ICE CREAM */}

        <div className="center">
          <div className="cone-wrapper">

            {/* FLOATING TOPPINGS */}

            <div className="topping-area">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`topping-piece piece-${index + 1}`}
                >
                  <ImgNoWhite
                    src={current.topping}
                    className="ct-img"
                  />
                </div>
              ))}
            </div>

            {/* MAIN CONE */}

            <div className="main-wrap">
              <ImgNoWhite
                src={current.img}
                className="main-cone"
              />
            </div>

          </div>
        </div>

        {/* RIGHT SIDE NEXT CONE */}

        <div
          className="right"
          onClick={nextSlide}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              nextSlide();
            }
          }}
          aria-label="Show next flavour"
        >
          <div className="mini-wrap">
            <ImgNoWhite
              src={next.img}
              className="mini-cone"
            />
          </div>
        </div>

      </section>
    </div>
  );
}
