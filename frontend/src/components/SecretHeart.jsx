import { useState } from "react";

import { FaIcon } from "../lib/faIcons.jsx";


export function SecretHeart({ copy }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="secret-heart"
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Секретное сердечко"
      >
        <FaIcon name="heart" />
      </button>

      {isOpen && (
        <div className="secret-backdrop" role="presentation" onClick={() => setIsOpen(false)}>
          <section
            className="secret-note"
            role="dialog"
            aria-modal="true"
            aria-label={copy.title}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Закрыть">
              <FaIcon name="xmark" />
            </button>
            <span aria-hidden="true">
              <FaIcon name="heart" />
            </span>
            <h2>{copy.title}</h2>
            <p>{copy.text}</p>
          </section>
        </div>
      )}
    </>
  );
}
