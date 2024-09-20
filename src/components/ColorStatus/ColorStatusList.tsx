import React, { FC } from "react";
import { ShowPropertyProps } from "adminjs";

import { ColorStatusBadge } from "./styles";

import type { AvailableValueType } from "./types";

const ColorStatusList: FC<ShowPropertyProps> = ({ property, record }) => {
  const currentOption = property.availableValues?.find(
    (item) => item.value === record.params.colorStatus,
  ) as AvailableValueType;

  return (
    <ColorStatusBadge color={currentOption.color}>
      {record.params.colorStatus}
    </ColorStatusBadge>
  );
};

export default ColorStatusList;
