import React, { useState } from 'react';
import { LinkButton, Button } from '@strapi/design-system';
import { Eye } from '@strapi/icons';
import PreviewModal from '../PreviewModal';

export default function AttachmentFormField({
  attachments,
}: {
  attachments: any;
}) {
  const [previewModal, setPreviewModal] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        endIcon={<Eye />}
        onClick={() => {
          setPreviewModal(true);
        }}
      >
        عرض
      </Button>

      {previewModal && (
        <div className="preview">
          <PreviewModal
            onClose={() => {
              setPreviewModal(false);
              document.body.classList.remove('active-modal');
            }}
            assets={Array.isArray(attachments) ? attachments : [attachments]}
          />
        </div>
      )}
    </>
  );
}
