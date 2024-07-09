import React, { useState } from 'react';
import { Field, Box, FieldError } from '@strapi/design-system';
import PDFComponent from './pdf';
import CloseIcon from './CloseIcon';
interface props {
  fieldData: any;
  multiple?: boolean;
  accept?: string;
  register?: any;
  errors: any;
  setValue: any;
  setError?: any;
  clearErrors?: any;
}
export default function UploadFile({
  fieldData,
  multiple,
  accept,
  register,
  errors,
  setValue,
  setError,
  clearErrors = () => null,
}: props) {
  const [files, setFiles] = useState<any>([]);
  const handleFileUpload = async (e: any) => {
    !multiple && files.length && deleteFile(files[0].id);
    let uploadedFiles = e.target.files;
    const maxSize = 1 * 1024 * 1024; // 1 MB in bytes

    for (let i = 0; i < uploadedFiles.length; i++) {
      if (uploadedFiles[i].size > maxSize) {
        setError &&
          setError(fieldData.id, {
            type: 'fileSize',
            message: 'حجم الملف يتجاوز الحد المسموح به (1 ميجابايت)',
          });
        return;
      }
    }
    let formData = new FormData();
    clearErrors && clearErrors(fieldData.id);
    // Iterate over the files and append them to the FormData
    for (let i = 0; i < uploadedFiles.length; i++) {
      formData.append('files', uploadedFiles[i]);
    }

    const response = await fetch(
      `${process.env.STRAPI_ADMIN_BACKEND_URL}/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${JSON.parse(
            sessionStorage.getItem('jwtToken') || ''
          )}`,
        },
      }
    );

    const data = await response.json();
    setValue(fieldData.id, data);
    multiple ? setFiles([...files, ...data]) : setFiles(data);
  };

  const deleteFile = async (id: number) => {
    setFiles(files.filter((ele: any) => ele.id != id));
    await fetch(`${process.env.STRAPI_ADMIN_BACKEND_URL}/upload/files/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${JSON.parse(
          sessionStorage.getItem('jwtToken') || ''
        )}`,
      },
    });
  };

  return (
    <Box padding={5} background="neutral0">
      <Field
        hint={fieldData?.hint}
        error={
          errors?.[fieldData?.id]?.message ||
          (fieldData.id == errors?.serverError?.type &&
            errors?.serverError?.message)
        }
      >
        <div className="file-input">
          <input
            type="file"
            name="uploadFile"
            id={fieldData?.id}
            className="file-input__input"
            multiple={multiple}
            accept={accept || 'image/png, image/jpeg'}
            onChange={handleFileUpload}
          />
          <label className="file-input__label" htmlFor={fieldData?.id}>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="upload"
              className="svg-inline--fa fa-upload fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
              ></path>
            </svg>
            <span>{fieldData.label} </span>
          </label>
        </div>
        <FieldError />
      </Field>
      <div style={{ display: 'flex', gap: 10, flex: 'wrap' }}>
        {files &&
          files.map((ele: any) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
                position: 'relative',
              }}
            >
              <div
                onClick={(e) => {
                  deleteFile(ele.id);
                }}
              >
                <CloseIcon />
              </div>

              {ele.mime.includes('image') ? (
                <>
                  <img src={ele.url} width={100} height={100} alt="" />
                  <span>{ele.name}</span>
                </>
              ) : ele.mime.includes('pdf') ? (
                <>
                  <PDFComponent />
                  <span>{ele.name}</span>
                </>
              ) : (
                ''
              )}
            </div>
          ))}
      </div>
    </Box>
  );
}
