import React, { memo, useState, useEffect, useRef, FC } from "react";
import { ShowPropertyProps } from "adminjs";

import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";

import { StyledShowLabel, StyledShowWrapper, StyledListItem } from "./styles";
import { separator } from "./constants";

interface StringListShowPropsType extends ShowPropertyProps {
  stringListSeparator?: string;
}

const StringListShow: FC<StringListShowPropsType> = ({
  property,
  record,
  stringListSeparator = separator,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <StyledShowWrapper>
        <StyledShowLabel>{property.path}</StyledShowLabel>
        {record.params.facts && (
          <ul>
            {record.params.facts
              .split(stringListSeparator)
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
