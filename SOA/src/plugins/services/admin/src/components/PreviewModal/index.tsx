/**
 *
 * PreviewAllMedia
 *
 */

import React, { useRef, useState } from 'react';
import Modal from './components/PreviewModal';

export default function PreviewModal({
  onClose,
  assets,
}: {
  onClose: any;
  assets: any;
}) {
  return (
    <>
      <Modal assets={assets} onClose={onClose} />
    </>
  );
}
