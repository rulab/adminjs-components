import React, { FC, MouseEvent, useState } from "react";
import type { ShowPropertyProps } from "adminjs";
import { useTranslation } from "adminjs";
import { Box, Text } from "@adminjs/design-system";

import { StyledListSpoilerToggle } from "./styles.js";

const DEFAULT_SEPARATOR = "|";
const DEFAULT_LIST_MAX_LENGTH = 80;
const DISPLAY_JOINER = ", ";

type StringListListProps = ShowPropertyProps & {
  stringListSeparator?: string;
  listMaxLength?: number;
};

export const StringListList: FC<StringListListProps> = ({
  property,
  record,
  stringListSeparator = DEFAULT_SEPARATOR,
  listMaxLength = DEFAULT_LIST_MAX_LENGTH,
}) => {
  const { translateMessage } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const separatorValue =
    (property.props?.stringListSeparator as string | undefined) ??
    stringListSeparator;
  const maxLength =
    (property.props?.listMaxLength as number | undefined) ??
    (property as { custom?: { listMaxLength?: number } }).custom
      ?.listMaxLength ??
    listMaxLength;

  const raw = record?.params?.[property.path];
  if (!raw || typeof raw !== "string") {
    return null;
  }

  const displayText = raw
    .split(separatorValue)
    .map((item) => item.trim())
    .filter(Boolean)
    .join(DISPLAY_JOINER);

  if (!displayText) {
    return null;
  }

  const needsSpoiler = displayText.length > maxLength;
  const collapsedText = needsSpoiler
    ? displayText.slice(0, maxLength)
    : displayText;

  const stopRowClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const toggle = (event: MouseEvent) => {
    stopRowClick(event);
    setExpanded((prev) => !prev);
  };

  if (!needsSpoiler) {
    return <Text>{displayText}</Text>;
  }

  const expandLabel = translateMessage("stringListExpand", property.resourceId, {
    defaultValue: "Expand",
  });
  const collapseLabel = translateMessage(
    "stringListCollapse",
    property.resourceId,
    { defaultValue: "Collapse" },
  );

  return (
    <Box
      as="span"
      display="inline"
      onClick={stopRowClick}
      onMouseDown={stopRowClick}
    >
      <Text as="span">{expanded ? displayText : collapsedText}</Text>
      <StyledListSpoilerToggle
        type="button"
        onClick={toggle}
        aria-expanded={expanded}
        aria-label={expanded ? collapseLabel : expandLabel}
      >
        {expanded ? "<" : "..."}
      </StyledListSpoilerToggle>
    </Box>
  );
};

export default StringListList;
