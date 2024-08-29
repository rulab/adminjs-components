import React, { Context, FC, useContext } from "react";

import { StyledDragButton } from "./styles.js";
import type { DragContext } from "./types.js";

interface DragHandlePropsType {
  context: Context<DragContext>;
}

export const DragHandle: FC<DragHandlePropsType> = ({ context }) => {
  const { attributes, listeners, ref } = useContext(context);

  return (
    <StyledDragButton {...attributes} {...listeners} ref={ref}>
      <svg viewBox="0 0 20 20" width="13">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
      </svg>
    </StyledDragButton>
  );
};
