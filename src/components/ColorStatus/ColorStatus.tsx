import React, { ChangeEvent, FC, useState, useEffect } from "react";

import { EditPropertyProps } from "adminjs";
import Select, { MultiValue, SingleValue, StylesConfig } from "react-select";
import chroma from "chroma-js";

import { ColorStatusWrapper, Label } from "./styles";

type CustomSlugTypes = Omit<EditPropertyProps, "where" | "resource">;

type ColorOption = {
  value: string;
  label: string;
  color: string;
};

interface ColorStatusPropsType extends CustomSlugTypes {
  options: ColorOption[];
}

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

const colorStyles: StylesConfig<ColorOption> = {
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

const ColorStatus: FC<ColorStatusPropsType> = ({
  property,
  record,
  onChange,
  options,
}) => {
  const currentOption = options.find(
    (item) => item.value === record.params.colorStatus,
  );
  const [selectOption, setCurrentOption] = useState<
    SingleValue<ColorOption> | undefined
  >(currentOption);

  const handleSelectChange = (
    option: SingleValue<ColorOption> | MultiValue<ColorOption>,
  ) => {
    setCurrentOption(option as SingleValue<ColorOption>);
  };

  useEffect(() => {
    onChange(property.path, selectOption?.value);
  }, [selectOption]);

  return (
    <ColorStatusWrapper>
      <Label>Color Status</Label>
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={selectOption ?? options[0]}
        onChange={handleSelectChange}
        isClearable={true}
        name="color"
        options={options}
        styles={colorStyles}
      />
    </ColorStatusWrapper>
  );
};

export default ColorStatus;
