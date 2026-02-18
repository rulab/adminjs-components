import React, { FC } from "react";
import { ShowPropertyProps } from "adminjs";

import { ColorStatusBadgeWrapper, ColorStatusBadge, ShowLabel } from "./styles.js";

import type { AvailableValueType } from "./types.js";

export const ColorStatusShow: FC<ShowPropertyProps> = ({ property, record }) => {
  const currentOption = property.availableValues?.find(
    (item) => item.value === record.params[property.path],
  ) as AvailableValueType;
  const currentValue = record.params[property.path];
  const displayValue = currentOption?.label ?? currentValue;

  return (
    <ColorStatusBadgeWrapper>
      <ShowLabel>{property.label ?? property.path}</ShowLabel>
      <ColorStatusBadge color={currentOption?.color}>
        {displayValue}
      </ColorStatusBadge>
    </ColorStatusBadgeWrapper>
  );
};

export default ColorStatusShow;
