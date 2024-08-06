import React, { memo, useState, useEffect, useRef, FC } from "react";
import { ShowPropertyProps } from "adminjs";

import { ThemeProvider } from "styled-components";
import { theme } from "@adminjs/design-system";

import { StringListShowLabel, StringListShowWrapper, ListItem } from "./styles";

const StringListShow: FC<ShowPropertyProps> = ({ property, record }) => {
  return (
    <ThemeProvider theme={theme}>
      <StringListShowWrapper>
        <StringListShowLabel>{property.name}</StringListShowLabel>
        {record.params.facts && (
          <ul>
            {record.params.facts
              .split("|")
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
