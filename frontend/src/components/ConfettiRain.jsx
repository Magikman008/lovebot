export function ConfettiRain({ active = true }) {
  if (!active) {
    return null;
  }

  const pieces = Array.from({ length: 56 }, (_, index) => ({
    delay: `${index * -0.055}s`,
    duration: `${2.2 + (index % 7) * 0.14}s`,
    left: `${2 + ((index * 17) % 96)}vw`,
    shape: index % 4 === 0 ? "heart" : index % 4 === 1 ? "spark" : index % 4 === 2 ? "dot" : "pill",
    size: `${0.72 + (index % 5) * 0.13}rem`,
    x: `${(index % 2 === 0 ? 1 : -1) * (18 + (index % 9) * 5)}px`,
  }));

  const burst = Array.from({ length: 28 }, (_, index) => ({
    delay: `${index * 0.018}s`,
    rotate: `${index * 13}deg`,
    spread: `${90 + (index % 6) * 18}px`,
  }));

  return (
    <div className="confetti-rain" aria-hidden="true">
      <div className="confetti-fall">
        {pieces.map((piece, index) => (
          <span
            className={`confetti-piece ${piece.shape}`}
            style={{
              "--delay": piece.delay,
              "--duration": piece.duration,
              "--left": piece.left,
              "--size": piece.size,
              "--x": piece.x,
            }}
            key={index}
          >
            {piece.shape === "heart" ? "♡" : piece.shape === "spark" ? "✦" : ""}
          </span>
        ))}
      </div>
      <div className="confetti-burst">
        {burst.map((piece, index) => (
          <span
            style={{
              "--delay": piece.delay,
              "--rotate": piece.rotate,
              "--spread": piece.spread,
            }}
            key={index}
          >
            {index % 2 === 0 ? "♡" : "✦"}
          </span>
        ))}
      </div>
    </div>
  );
}
