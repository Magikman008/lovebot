import { FaIcon } from "../lib/faIcons.jsx";


export function GifPlaceholder({ tone }) {
  return (
    <div className={`gif-placeholder ${tone}`} aria-hidden="true">
      <span className="gif-shape left">
        <FaIcon name="cat" />
      </span>
      <span className="gif-shape right">
        <FaIcon name={tone === "hug" ? "heart" : "sparkle"} />
      </span>
      <span className="gif-heart">
        <FaIcon name="heart" />
      </span>
    </div>
  );
}
