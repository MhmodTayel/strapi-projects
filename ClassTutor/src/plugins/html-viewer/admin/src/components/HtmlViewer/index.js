import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextInput } from "@strapi/design-system/TextInput";
import {
  Box,
  Button,
  ModalLayout,
  ModalBody,
  ModalHeader,
  Typography,
} from "@strapi/design-system";
import { useIntl } from "react-intl";

const Input = ({
  onChange,
  name,
  intlLabel,
  attribute,
  description,
  placeholder,
  error,
  value,
}) => {
  const { formatMessage } = useIntl();
  const [content, setContent] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  return (
    <Box>
      <TextInput
        placeholder={placeholder}
        label={formatMessage(intlLabel)}
        name={name}
        id={name}
        hint={description && formatMessage(description)}
        error={error}
        onChange={(e) => {
          setContent(e.target.value);
          onChange({
            target: {
              name: name,
              value: e.target.value,
              type: attribute.type,
            },
          });
        }}
        value={value}
        withTags
      ></TextInput>
      <Box paddingTop={2}>
        <iframe
          srcDoc={value}
          style={{ height: "200vh" }}
          width={"100%"}
          allowFullScreen={"true"}
        ></iframe>
      </Box>
    </Box>
  );
};

//default value if no value is given
Input.defaultProps = {
  description: null,
  error: null,
  labelAction: null,
  required: false,
  value: "",
};

// validation
Input.propTypes = {
  intlLabel: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.object,
  error: PropTypes.string,
  labelAction: PropTypes.object,
  required: PropTypes.bool,
  value: PropTypes.string,
};

export default Input;