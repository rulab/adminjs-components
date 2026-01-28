import { Box, Button, DrawerContent, DrawerFooter, Icon, Tab, Tabs } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActionHeader,
  BasePropertyComponent,
  LayoutElementRenderer,
  useRecord,
  useTranslation,
} from "adminjs";
const StyledTabButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.xl}`};
  cursor: pointer;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.grey60};
  user-select: none;
  ${({ theme }) => ({
    fontFamily: theme.font,
    fontSize: theme.fontSizes.md,
    lineHeight: theme.lineHeights.lg,
  })};
  ${({ active, theme }) => active
    ? `
    border-color: ${theme.colors.primary100};
    color: ${theme.colors.primary100};
  `
    : ""};
`;
const StyledTabsContent = styled.div`
  padding-top: ${({ theme }) => theme.space.xl};
`;
const TabButton = ({ onClick, active, tabId, role, children }) => (React.createElement(StyledTabButton, { type: "button", onClick: onClick, "data-tab-id": tabId, role: role, active: active }, children));
const DEFAULT_COMMON_LABEL = "Common";
const buildTabId = (label) => `tab-${label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "")}`;
const groupProperties = (properties, commonLabel) => {
  const commonProps = [];
  const tabs = new Map();
  properties.forEach((property) => {
    const tab = property?.props?.tab ?? property?.custom?.tab;
    if (tab) {
      if (!tabs.has(tab)) {
        tabs.set(tab, []);
      }
      tabs.get(tab)?.push(property);
    } else {
      commonProps.push(property);
    }
  });
  const entries = [{ id: "common", label: commonLabel, properties: commonProps }];
  tabs.forEach((props, label) => {
    entries.push({
      id: buildTabId(label),
      label,
      properties: props,
    });
  });
  return entries;
};
export const TabsEdit = (props) => {
  const { record: initialRecord, resource, action } = props;
  const { record, handleChange, submit: handleSubmit, loading, setRecord } = useRecord(initialRecord, resource.id);
  const { translateButton } = useTranslation();
  useEffect(() => {
    if (initialRecord) {
      setRecord(initialRecord);
    }
  }, [initialRecord]);
  const submit = (event) => {
    event.preventDefault();
    handleSubmit().then((response) => {
      if (response.data.redirectUrl) {
        window.location.assign(response.data.redirectUrl);
      }
    });
    return false;
  };
  const commonLabel = resource?.options?.properties?.__tabsCommonLabel?.custom?.value ?? DEFAULT_COMMON_LABEL;
  const tabs = useMemo(() => groupProperties(resource.editProperties, commonLabel), [resource.editProperties, commonLabel]);
  const [currentTab, setCurrentTab] = useState(() => {
    const commonHasProps = Boolean(tabs[0]?.properties?.length);
    return commonHasProps ? "common" : tabs[1]?.id ?? "common";
  });
  useEffect(() => {
    const validTab = tabs.find((tab) => tab.id === currentTab);
    if (!validTab) {
      const commonHasProps = Boolean(tabs[0]?.properties?.length);
      setCurrentTab(commonHasProps ? "common" : tabs[1]?.id ?? "common");
    }
  }, [tabs, currentTab]);
  return (React.createElement(Box, { as: "form", onSubmit: submit, flex: true, flexDirection: "column" },
    React.createElement(DrawerContent, null,
      action?.showInDrawer ? React.createElement(ActionHeader, { ...props }) : null,
      action.layout ? (action.layout.map((layoutElement, i) => (React.createElement(LayoutElementRenderer, { key: i, layoutElement: layoutElement, ...props, where: "edit", onChange: handleChange, record: record })))) : (React.createElement(Tabs, { currentTab: currentTab, onChange: setCurrentTab, buttonComponent: TabButton, contentComponent: StyledTabsContent }, tabs.map((tab) => (React.createElement(Tab, { key: tab.id, id: tab.id, label: tab.label }, tab.properties.map((property) => (React.createElement(BasePropertyComponent, { key: property.propertyPath, where: "edit", onChange: handleChange, property: property, resource: resource, record: record }))))))))),
    React.createElement(DrawerFooter, null,
      React.createElement(Button, { variant: "contained", type: "submit", "data-testid": "button-save", disabled: loading },
        loading ? React.createElement(Icon, { icon: "Loader", spin: true }) : null,
        translateButton("save", resource.id)))));
};
export default TabsEdit;
