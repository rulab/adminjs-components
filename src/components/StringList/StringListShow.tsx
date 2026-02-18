import React, { FC } from "react";
import { ShowPropertyProps } from "adminjs";

import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";

import { StyledShowLabel, StyledShowWrapper, StyledListItem } from "./styles.js";

const DEFAULT_SEPARATOR = "|";

interface StringListShowPropsType extends ShowPropertyProps {
  stringListSeparator?: string;
}

export const StringListShow: FC<StringListShowPropsType> = ({
  property,
  record,
  stringListSeparator = DEFAULT_SEPARATOR,
}) => {
  const separatorValue =
    (property.props?.stringListSeparator as string | undefined) ?? stringListSeparator;
  const value = record.params[property.path];

  return (
    <ThemeProvider theme={theme}>
      <StyledShowWrapper>
        <StyledShowLabel>{property.label ?? property.path}</StyledShowLabel>
        {value && (
          <ul>
            {value
              .split(separatorValue)
              .map((item: string, index: number) => (
                <StyledListItem key={index}>{`- ${item}`}</StyledListItem>
              ))}
          </ul>
        )}
      </StyledShowWrapper>
    </ThemeProvider>
  );
};

export default StringListShow;
