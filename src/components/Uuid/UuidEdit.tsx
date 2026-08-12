import { EditPropertyProps, useTranslation } from "adminjs";
import React, { ChangeEvent, FC, SyntheticEvent, useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";

import { theme } from "@adminjs/design-system";

import {
  StyledCustomInput,
  StyledGenerateButton,
  StyledInputWrapper,
  StyledLabel,
} from "./styles.js";

type CustomUuidTypes = Omit<EditPropertyProps, "where">;

const generateUuidV4 = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

export const UuidEdit: FC<CustomUuidTypes> = ({
  property,
  record,
  onChange,
}) => {
  const { translateProperty } = useTranslation();
  const { custom } = property as unknown as { custom?: { button?: string } };
  const [inputValue, setInputValue] = useState(record.params[property.path] ?? "");

  useEffect(() => {
    onChange(property.path, inputValue);
  }, [inputValue]);

  return (
    <ThemeProvider theme={theme}>
      <StyledLabel htmlFor="customUuid">
        {translateProperty(property.label, property.resourceId)}
      </StyledLabel>
      <StyledInputWrapper>
        <StyledCustomInput
          id={property.path}
          name={property.path}
          value={inputValue}
          onChange={handleInput}
        />
        <StyledGenerateButton variant="outlined" onClick={generateUuid}>
          {custom?.button ?? "Generate UUID"}
        </StyledGenerateButton>
      </StyledInputWrapper>
    </ThemeProvider>
  );

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function generateUuid(e: SyntheticEvent<HTMLButtonElement>) {
    e.preventDefault();
    setInputValue(generateUuidV4());
  }
};

export default UuidEdit;

