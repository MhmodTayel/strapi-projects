import React, { FC, useEffect, useMemo, useState } from 'react';
import { getDocument, GlobalWorkerOptions, version } from 'pdfjs-dist';

import './Items.css';

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;

const PDFFileConverter = ({ pdfUrl }: any) => {
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    setLoading(false);
  }, [imageUrls]);

  const renderPage = async (data: any) => {
    setLoading(true);
    const imagesList = [];
    const canvas = document.createElement('canvas');
    canvas.setAttribute('className', 'canv');
    const pdf = await getDocument({ data }).promise;
    for (let num = 1; num <= pdf.numPages; num++) {
      const page = await pdf.getPage(num);
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {
        canvasContext: canvas.getContext('2d') as any,
        viewport,
      };
      await page.render(renderContext).promise;
      const img = canvas.toDataURL('image/png');
      imagesList.push(img);
    }
    setImageUrls(imagesList);
  };

  const UrlUploader = (url: any) => {
    fetch(url).then((response) => {
      response.blob().then((blob) => {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const data = window.atob(
            event.target.result.replace(/.*base64,/, '')
          );
          renderPage(data);
        };
        reader.readAsDataURL(blob);
      });
    });
  };

  useMemo(() => {
    UrlUploader(pdfUrl);
  }, []);

  return imageUrls.length > 0 ? (
    <div className="pdf-container">
      {imageUrls.map((url, index) => (
        <img
          key={String(index + 1)}
          src={url}
          alt={`Page ${index + 1}`}
          width={500}
          height={500}
        />
      ))}
    </div>
  ) : null;
};

export default PDFFileConverter;
