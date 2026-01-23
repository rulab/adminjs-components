import React, { FC } from "react";
import { ShowPropertyProps } from "adminjs";

import { ColorStatusBadge } from "./styles";

import type { AvailableValueType } from "./types";

export const ColorStatusList: FC<ShowPropertyProps> = ({ property, record }) => {
  const currentOption = property.availableValues?.find(
    (item) => item.value === record.params[property.path],
  ) as AvailableValueType;
  const currentValue = record.params[property.path];
  const displayValue = currentOption?.label ?? currentValue;

  return (
    <ColorStatusBadge color={currentOption?.color}>
      {displayValue}
    </ColorStatusBadge>
  );
};

export default ColorStatusList;
