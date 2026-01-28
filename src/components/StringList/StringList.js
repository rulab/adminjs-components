import { Button, Input, theme } from "@adminjs/design-system";
import React, { useEffect, useState, } from "react";
import { ThemeProvider } from "styled-components";
import { StyledCustomInput, StyledInputWrapper, StyledLabel, StyledListWrapper, StyledWrapper, } from "./styles.js";
import { SortableList } from "./SortableList/SortableList.js";
import { separator } from "./constants.js";
export const StringList = ({ record, onChange, property, stringListSeparator = separator, }) => {
    const stringListValue = record.params?.[property.path] ?? property.props.value ?? "";
    const initialList = stringListValue
        ? prepareDataForList(stringListValue)
        : [];
    const [inputValue, setInputValue] = useState("");
    const [list, setList] = useState(initialList);
    const serializedData = prepareDataForDatabase(list);
    useEffect(() => {
        onChange(property.path, serializedData);
    }, [serializedData]);
    return (React.createElement(ThemeProvider, { theme: theme },
        React.createElement(StyledLabel, { htmlFor: "custom" }, property.label ?? property.path),
        React.createElement(StyledWrapper, null,
            React.createElement(StyledListWrapper, { $hasItems: list.length > 0 },
                React.createElement(SortableList, { items: list, onChange: setList, renderItem: (item) => (React.createElement(SortableList.Item, { id: item.id, onDelete: handleDeleteButton }, item.value)) })),
            React.createElement(StyledInputWrapper, null,
                React.createElement(Input, { id: "stringList", name: property.path, value: serializedData, hidden: true, readOnly: true }),
                React.createElement(StyledCustomInput, { id: "custom", name: "customInput", value: inputValue, onChange: handleInput, onKeyPress: handleEnterPress }),
                React.createElement(Button, { variant: "outlined", onClick: handleAddButton }, "Add")))));
    function handleInput(e) {
        setInputValue(e.target.value);
    }
    function handleEnterPress(e) {
        if (e.key === "Enter") {
            handleAddButton(e);
        }
    }
    function handleAddButton(e) {
        e.preventDefault();
        if (Boolean(inputValue)) {
            setList([...list, createListObject(inputValue)]);
            setInputValue("");
        }
    }
    function handleDeleteButton(e, id) {
        e.preventDefault();
        const newData = list.filter((item) => item.id !== id);
        setList(newData);
    }
    function prepareDataForDatabase(list) {
        return list.map(({ value }) => value).join(stringListSeparator);
    }
    function prepareDataForList(str) {
        return str.split(stringListSeparator).map((item) => createListObject(item));
    }
    function createListObject(value) {
        return {
            id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            value: value,
        };
    }
};
export default StringList;
