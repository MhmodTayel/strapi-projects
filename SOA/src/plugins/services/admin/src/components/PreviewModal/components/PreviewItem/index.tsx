import React, { useState } from 'react';
import PDFFileConverter from './PDFFileConverter';
import './Items.css';
export default function Modal({ asset }: any) {
  const assetTypes = {
    Image: 'image',
    VIDEO: 'video',
    FILE: 'application',
    AUDIO: 'audio',
  };
  const assetType = asset?.mime.split('/')[0];

  return (
    <>
      {assetType === assetTypes.Image && (
        <img src={asset.url} alt="image" className="item item-img" />
      )}
      {assetType === assetTypes.VIDEO && (
        <video
          className="item video-item"
          // type={asset.mime}
          controls
          controlsList="nodownload noplaybackrate"
        >
          <source src={asset.url} />{' '}
        </video>
      )}
      {assetType === assetTypes.AUDIO && (
        <audio
          className="item"
          controls
          src={asset.url}
          controlsList="nodownload noplaybackrate"
        />
      )}
      {assetType === assetTypes.FILE && <PDFFileConverter pdfUrl={asset.url} />}
    </>
  );
}
