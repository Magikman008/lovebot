export function FloatingDecor() {
  const pieces = Array.from({ length: 18 }, (_, index) => ({
    char: index % 4 === 0 ? "✦" : index % 4 === 1 ? "♡" : index % 4 === 2 ? "✧" : "♥",
    delay: `${index * -0.47}s`,
    duration: `${7.5 + (index % 5) * 0.55}s`,
    left: `${5 + ((index * 13) % 88)}vw`,
    size: `${0.9 + (index % 4) * 0.22}rem`,
  }));

  return (
    <div className="floating-decor" aria-hidden="true">
      {pieces.map((piece, index) => (
        <span
          style={{
            "--delay": piece.delay,
            "--duration": piece.duration,
            "--left": piece.left,
            "--size": piece.size,
          }}
          key={`${piece.char}-${index}`}
        >
          {piece.char}
        </span>
      ))}
    </div>
  );
}
