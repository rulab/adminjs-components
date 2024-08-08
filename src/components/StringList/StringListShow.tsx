import React, { memo, useState, useEffect, useRef, FC } from "react";
import { ShowPropertyProps } from "adminjs";

import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";

import { StringListShowLabel, StringListShowWrapper, ListItem } from "./styles";
import { separator } from "../../constants";

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
      <StringListShowWrapper>
        <StringListShowLabel>{property.name}</StringListShowLabel>
        {record.params.facts && (
          <ul>
            {record.params.facts
              .split(stringListSeparator)
              .map((item: string, index: number) => (
                <ListItem key={index}>{`- ${item}`}</ListItem>
              ))}
          </ul>
        )}
      </StringListShowWrapper>
    </ThemeProvider>
  );
};

export default StringListShow;
