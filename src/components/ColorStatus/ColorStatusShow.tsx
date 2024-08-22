import React, { FC } from "react";
import { ShowPropertyProps } from "adminjs";

import { ColorStatusBadgeWrapper, ColorStatusBadge, ShowLabel } from "./styles";

const ColorStatusShow: FC<ShowPropertyProps> = ({ record }) => {
  console.log(record, "record");
  return (
    <ColorStatusBadgeWrapper>
      <ShowLabel>Status</ShowLabel>
      <ColorStatusBadge color="green">
        {record.params.colorStatus}
      </ColorStatusBadge>
    </ColorStatusBadgeWrapper>
  );
};

export default ColorStatusShow;
