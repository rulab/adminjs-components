import React, {
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  SyntheticEvent,
  FC,
} from "react";
import { ThemeProvider } from "styled-components";
import { EditPropertyProps } from "adminjs";
import { theme, Button, Input, Label } from "@adminjs/design-system";

import {
  StyledWrapper,
  StyledCustomInput,
  StyledListWrapper,
  StyledInputWrapper,
} from "./styles.js";

import { SortableList } from "./SortableList/SortableList.js";
import { separator } from "./constants.js";

type ListDataTypes = {
  id: string;
  value: string;
};

type StringListTypes = Omit<EditPropertyProps, "where" | "resource">;

interface StringListShowPropsType extends StringListTypes {
  stringListSeparator?: string;
}

const StringList: FC<StringListShowPropsType> = ({
  record,
  onChange,
  property,
  stringListSeparator = separator,
}) => {
  const stringListValue =
    record.params?.[property.path] ?? property.props.value ?? "";

  const initialList = stringListValue
    ? prepareDataForList(stringListValue)
    : [];

  const [inputValue, setInputValue] = useState("");
  const [list, setList] = useState<ListDataTypes[]>(initialList);

  const serializedData = prepareDataForDatabase(list);

  useEffect(() => {
    onChange(property.path, serializedData);
  }, [serializedData]);

  return (
    <ThemeProvider theme={theme}>
      <Label htmlFor="custom">String List</Label>
      <StyledWrapper>
        <StyledListWrapper>
          <SortableList
            items={list}
            onChange={setList}
            renderItem={(item) => (
              <SortableList.Item id={item.id} onDelete={handleDeleteButton}>
                {item.value}
              </SortableList.Item>
            )}
          />
        </StyledListWrapper>
        <StyledInputWrapper>
          <Input
            id="stringList"
            name={property.path}
            value={serializedData}
            hidden
          />
          <StyledCustomInput
            id="custom"
            name="customInput"
            value={inputValue}
            onChange={handleInput}
            onKeyPress={handleEnterPress}
          />
          <Button variant="outlined" onClick={handleAddButton}>
            Add
          </Button>
        </StyledInputWrapper>
      </StyledWrapper>
    </ThemeProvider>
  );

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function handleEnterPress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleAddButton(e);
    }
  }

  function handleAddButton(e: SyntheticEvent<HTMLInputElement>) {
    e.preventDefault();

    if (Boolean(inputValue)) {
      setList([...list, createListObject(inputValue)]);

      setInputValue("");
    }
  }

  function handleDeleteButton(e: ChangeEvent<HTMLInputElement>, id: string) {
    e.preventDefault();
    const newData = list.filter((item: ListDataTypes) => item.id !== id);
    setList(newData);
  }

  function prepareDataForDatabase(list: ListDataTypes[]) {
    return list.map(({ value }) => value).join(stringListSeparator);
  }

  function prepareDataForList(str: string) {
    return str.split(stringListSeparator).map((item) => createListObject(item));
  }

  function createListObject(value: string) {
    return {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      value: value,
    };
  }
};

export default StringList;
