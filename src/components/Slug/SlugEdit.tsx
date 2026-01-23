import {EditPropertyProps, flat} from "adminjs";
import React, {
  ChangeEvent,
  FC,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { ThemeProvider } from "styled-components";

import { theme } from "@adminjs/design-system";

import { slugifyTitle } from "../../utils";

import {
  StyledCustomInput,
  StyledGenerateButton,
  StyledInputWrapper,
  StyledLabel,
} from "./styles";
import SlugOptions from "./SlugOptions.type";

type CustomSlugTypes = Omit<EditPropertyProps, "where">;

export const SlugEdit: FC<CustomSlugTypes> = ({
  property,
  record,
  resource,
  onChange,
}) => {
  console.log("✅ SlugEdit loaded", { property });
  type SlugCustomProperty = {
    source: string,
    key: string
  }
  const { params } = record
  const { custom } = property as unknown as { custom: SlugCustomProperty }

  const source = flat.get(params, custom.source)
  const key = flat.get(params, custom.key)

  const [inputValue, setInputValue] = useState(key);

  useEffect(() => {
    onChange(property.path, inputValue);
  }, [inputValue]);

  return (
    <ThemeProvider theme={theme}>
      <StyledLabel htmlFor="customSlug">{property.label ?? property.path}</StyledLabel>
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
      record.params[property.props.sourceField ?? resource.titleProperty.name];

    if (slugSource) {
      setInputValue(slugifyTitle(slugSource));
    }
  }
};

export default SlugEdit;
