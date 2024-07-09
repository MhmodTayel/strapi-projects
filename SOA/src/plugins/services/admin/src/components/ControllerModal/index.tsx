import React, { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
// import { DevTool } from '@hookform/devtools';
import UploadFile from '../UploadFile';
import {
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Button,
} from '@strapi/design-system';
import DefaultFormField from '../DefaultFormField';
import api from '../../api';
import { RequestContext } from '../../pages/RequestPage';
import { useTranslation } from 'react-i18next';

export default function ControllerModal({
  setShowModal,
  action,
}: {
  setShowModal: any;
  action: any;
}) {
  const { t } = useTranslation();

  const requestContext = useContext(RequestContext) as any;

  const {
    register,
    control,
    handleSubmit,
    formState,
    setError,
    clearErrors,
    setValue,
  } = useForm({
    defaultValues: action.data,
  });

  const { errors } = formState;
  const onSubmit = async (data: any) => {
    try {
      await api.updateRequestStatusById(
        requestContext?.serviceSlug,
        requestContext?.reqId,
        { ...action.data, ...data }
      );
      setShowModal(false);
      window.location.reload();
    } catch (e: any) {
      // console.log({ ee: e.response.payload.error });
      setError('serverError', {
        message:
          // t(e.response.payload.error.message) ||
          t(e.response.payload.error?.details?.errors[0]?.message) ||
          e.response.payload.error?.details?.errors[0]?.message ||
          t(e.response.payload.error.message) ||
          e.response.payload.error.message,
        type: e.response.payload.error.details.errors[0].path,
      });
    }
  };

  return (
    <ModalLayout
      onClose={() => setShowModal((prev) => !prev)}
      labelledBy="title"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      onChange={() => {
        clearErrors('serverError');
      }}
      noValidate
      className="controller-modal"
    >
      <ModalHeader>
        <Typography
          fontWeight="bold"
          textColor="neutral800"
          as="h1"
          id="title"
          className="modal-title"
        >
          {action.popupLabel}
        </Typography>
      </ModalHeader>

      <ModalBody>
        {action.fields.map((fieldSchema: any, idx: any) =>
          fieldSchema.previewType == 'attachment' ? (
            <UploadFile
              fieldData={fieldSchema}
              key={idx}
              register={register}
              errors={errors}
              setValue={setValue}
              clearErrors={clearErrors}
              setError={setError}
            />
          ) : (
            <DefaultFormField
              fieldData={fieldSchema}
              enabled={fieldSchema.enabled}
              key={idx}
              register={register}
              errors={errors}
            />
          )
        )}
      </ModalBody>

      <ModalFooter
        startActions={
          <Button onClick={() => setShowModal(false)} variant="tertiary">
            إلغاء
          </Button>
        }
        endActions={<Button type="submit">تأكيد</Button>}
      />
      {/* <DevTool control={control} /> */}
    </ModalLayout>
  );
}
