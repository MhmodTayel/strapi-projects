import React, { useState } from 'react';
import Items from '../PreviewItem';
import './Modal.css';

export default function Modal({ onClose, assets }: any) {
  document.body.classList.add('active-modal');
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? assets.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === assets.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: any) => {
    setCurrentIndex(slideIndex);
  };
  const assetType = assets[currentIndex].mime.split('/')[0];
  return (
    <>
      <div className="modal">
        <div onClick={onClose} className="overlay"></div>
        <div className="modal-header">
          <p className="asset-name">{assets[currentIndex].name}</p>
          <p className="asset-no">
            {currentIndex + 1} / {assets.length}
          </p>

          <div className="close-modal-wrapper">
            <button onClick={onClose} className="close-modal">
              X
            </button>
          </div>
        </div>
        {assets.length > 1 && (
          <button
            type="button"
            onClick={goToPrevious}
            className="arrow left-arrow"
          >
            ❰
          </button>
        )}
        {assets.length > 1 && (
          <button
            type="button"
            onClick={goToNext}
            className="arrow right-arrow"
          >
            ❱
          </button>
        )}

        <div
          className={`modal-content ${
            assetType !== 'application' ? 'modal-items-wrapper' : ''
          } `}
        >
          <Items asset={assets[currentIndex]} />
        </div>
        <div className="modal-footer">
          {assets.length > 1 &&
            assets.map((_: any, slideIndex: any) => (
              <button
                type="button"
                className={
                  currentIndex === slideIndex ? 'active-dot' : 'inactive-dot'
                }
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
              >
                <span className="slide-circle" />
              </button>
            ))}
        </div>
      </div>
    </>
  );
}
