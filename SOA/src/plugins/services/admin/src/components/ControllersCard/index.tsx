//@ts-nocheck
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Icon,
  Button,
  Typography,
  Divider,
} from '@strapi/design-system';
import { Cross, Check, Pencil, Dashboard, Briefcase, Key } from '@strapi/icons';
import ControllerModal from '../ControllerModal';

const controllerMap = {
  accept: {
    icon: Check,
    variant: 'success-light',
  },
  edit: {
    icon: Pencil,
    variant: 'secondary',
  },
  reject: {
    icon: Cross,
    variant: 'danger-light',
  },
  confirmPayment: {
    icon: Briefcase,
    variant: 'success',
  },
};

export default function ControllersCard({
  controllers,
  schema,
  requestData,
}: {
  controllers: any;
  schema: any;
  requestData: any;
}) {
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState();

  const handleOnclick = (controller) => {
    setShowModal(true);
    const fields = controller.action.fields.map((field) => {
      const fieldSchema = schema.fields.find((f) => f.id == field);
      fieldSchema.value = fieldSchema.initialValue
        ? requestData[fieldSchema.initialValue]
        : undefined;
      return fieldSchema;
    });

    setAction({ ...controller.action, fields });
  };
  return (
    <>
      <Box padding={6} background="neutral0" marginBottom={4}>
        <Flex>
          <Icon
            marginLeft={2}
            width={`${25 / 16}rem`}
            height={`${25 / 16}rem`}
            as={Dashboard}
          />
          <Typography variant="beta">لوحة التحكم</Typography>
        </Flex>
        <Divider unsetMargin={false} marginBottom={4} />
        <Box
          hasRadius={true}
          shadow="filterShadow"
          style={{ marginTop: '10px' }}
          padding={4}
        >
          {controllers.map((controller, idx) => {
            const Icon = controllerMap[controller.type].icon;
            return (
              <Button
                fullWidth
                key={idx}
                size="M"
                marginBottom={4}
                variant={controllerMap[controller.type].variant}
                endIcon={<Icon />}
                onClick={() => {
                  handleOnclick(controller);
                }}
              >
                {controller.action.actionLabel}
              </Button>
            );
          })}
        </Box>
      </Box>
      {showModal && (
        <ControllerModal setShowModal={setShowModal} action={action} />
      )}
    </>
  );
}
