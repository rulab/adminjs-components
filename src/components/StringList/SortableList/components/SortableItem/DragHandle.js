import React, { useContext } from "react";
import { StyledDragButton } from "./styles.js";
export const DragHandle = ({ context }) => {
    const { attributes, listeners, ref } = useContext(context);
    return (React.createElement(StyledDragButton, { ...attributes, ...listeners, ref: ref },
        React.createElement("svg", { viewBox: "0 0 20 20", width: "13" },
            React.createElement("path", { d: "M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" }))));
};
