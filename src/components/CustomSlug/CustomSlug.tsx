import { EditPropertyProps } from "adminjs";
import React, {
  ChangeEvent,
  FC,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { ThemeProvider } from "styled-components";

import { theme } from "@adminjs/design-system";

import { slugifyTitle } from "../../utils/index.js";

import {
  StyledCustomInput,
  StyledGenerateButton,
  StyledInputWrapper,
  StyledLabel,
} from "./styles.js";

type CustomSlugTypes = Omit<EditPropertyProps, "where" | "resource">;

const CustomSlug: FC<CustomSlugTypes> = ({ property, record, onChange }) => {
  const [inputValue, setInputValue] = useState(record.params.slug);

  useEffect(() => {
    onChange(property.path, inputValue);
  }, [inputValue]);

  return (
    <ThemeProvider theme={theme}>
      <StyledLabel htmlFor="customSlug">{property.path}</StyledLabel>
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
    const slugSource =
      record.params[property.props.sourceField] ||
      record.params.title ||
      record.params.name;

    if (slugSource) {
      setInputValue(slugifyTitle(slugSource));
    }
  }
};

export default CustomSlug;
