import React, {
  ChangeEvent,
  FC,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { ThemeProvider } from "styled-components";
import { EditPropertyProps } from "adminjs";

import { theme, Label } from "@adminjs/design-system";

import { slugifyTitle } from "../../utils/index.js";

import {
  StyledInputWrapper,
  StyledCustomInput,
  StyledGenerateButton,
} from "./styles.js";

type CustomSlugTypes = Omit<EditPropertyProps, "where" | "resource">;

const CustomSlug: FC<CustomSlugTypes> = ({ property, record, onChange }) => {
  const [inputValue, setInputValue] = useState(record.params.slug);

  useEffect(() => {
    onChange(property.path, inputValue);
  }, [inputValue]);

  return (
    <ThemeProvider theme={theme}>
      <Label htmlFor="customSlug">Slug</Label>
      <StyledInputWrapper>
        <StyledCustomInput
          id={property.path}
          name={property.path}
          value={inputValue}
          onChange={handleInput}
        />
        <StyledGenerateButton variant="outlined" onClick={generateSlug}>
          Generate Slug
        </StyledGenerateButton>
      </StyledInputWrapper>
    </ThemeProvider>
  );

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function generateSlug(e: SyntheticEvent<HTMLInputElement>) {
    e.preventDefault();
    const title = record.params.title;
    if (title) {
      setInputValue(slugifyTitle(title));
    }
  }
};

export default CustomSlug;
