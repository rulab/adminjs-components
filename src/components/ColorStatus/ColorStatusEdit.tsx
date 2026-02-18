import React, { FC, useState, useEffect } from "react";

import { EditPropertyProps } from "adminjs";
import Select, { MultiValue, SingleValue, StylesConfig } from "react-select";
import chroma from "chroma-js";

import { ColorStatusWrapper, Label } from "./styles.js";

import type { AvailableValueType } from "./types.js";

type ColorStatusTypes = Omit<EditPropertyProps, "where" | "resource">;
type SelectAvailableValueType = Omit<AvailableValueType, "value"> & {
  value: string | null;
};

const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const colorStyles: StylesConfig<SelectAvailableValueType> = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isSelected
        ? data.color
        : isFocused
          ? color.alpha(0.1).css()
          : undefined,
      color: isSelected
        ? chroma.contrast(color, "white") > 2
          ? "white"
          : "black"
        : data.color,

      ":active": {
        ...styles[":active"],
        backgroundColor: isSelected ? data.color : color.alpha(0.3).css(),
      },
    };
  },
  input: (styles) => ({ ...styles, ...dot() }),
  placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};

export const ColorStatusEdit: FC<ColorStatusTypes> = ({
  property,
  record,
  onChange,
}) => {
  const availableValues = property.availableValues as SelectAvailableValueType[];
  const nullable = Boolean(
    (property as unknown as { custom?: { nullable?: boolean } }).custom?.nullable,
  );
  const isNewRecord = !record.id;
  const currentValue = record.params[property.path];

  const currentOption = availableValues.find(
    (item) => item.value === currentValue,
  ) as SelectAvailableValueType;
  const initialOption = currentOption ?? (!nullable && isNewRecord ? availableValues[0] : null);

  const [selectOption, setCurrentOption] = useState<
    SingleValue<SelectAvailableValueType>
  >(initialOption);

  const handleSelectChange = (
    option: SingleValue<SelectAvailableValueType> | MultiValue<SelectAvailableValueType>,
  ) => {
    setCurrentOption(option as SingleValue<SelectAvailableValueType>);
  };

  useEffect(() => {
    onChange(property.path, selectOption?.value);
  }, [selectOption]);

  return (
    <ColorStatusWrapper>
      <Label>{property.label ?? property.path}</Label>
      <Select
        className="basic-single"
        classNamePrefix="select"
        value={selectOption}
        onChange={handleSelectChange}
        isClearable={nullable}
        name="color"
        options={availableValues}
        styles={colorStyles}
      />
    </ColorStatusWrapper>
  );
};

export default ColorStatusEdit;
