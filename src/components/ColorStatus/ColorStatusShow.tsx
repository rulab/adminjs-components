import React, { FC } from "react";
import { ShowPropertyProps } from "adminjs";

import { ColorStatusBadgeWrapper, ColorStatusBadge, ShowLabel } from "./styles";

import type { AvailableValueType } from "./types";

const ColorStatusShow: FC<ShowPropertyProps> = ({ property, record }) => {
  const currentOption = property.availableValues?.find(
    (item) => item.value === record.params.colorStatus,
  ) as AvailableValueType;

  return (
    <ColorStatusBadgeWrapper>
      <ShowLabel>{property.path}</ShowLabel>
      <ColorStatusBadge color={currentOption.color}>
        {record.params.colorStatus}
      </ColorStatusBadge>
    </ColorStatusBadgeWrapper>
  );
};

export default ColorStatusShow;
