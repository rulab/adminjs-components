import { DrawerContent, Tab, Tabs } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActionHeader,
  BasePropertyComponent,
  LayoutElementRenderer,
} from "adminjs";
const StyledTabsContent = styled.div`
  padding-top: ${({ theme }) => theme.space.xl};
`;
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
export const TabsShow = (props) => {
  const { resource, record, action } = props;
  const commonLabel = resource?.options?.properties?.__tabsCommonLabel?.custom?.value ?? DEFAULT_COMMON_LABEL;
  const tabs = useMemo(() => groupProperties(resource.showProperties, commonLabel), [resource.showProperties, commonLabel]);
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
  return (React.createElement(DrawerContent, null,
    action?.showInDrawer ? React.createElement(ActionHeader, { ...props }) : null,
    action.layout ? (action.layout.map((layoutElement, i) => (React.createElement(LayoutElementRenderer, { key: i, layoutElement: layoutElement, ...props, where: "show" })))) : (React.createElement(Tabs, { currentTab: currentTab, onChange: setCurrentTab, contentComponent: StyledTabsContent }, tabs.map((tab) => (React.createElement(Tab, { key: tab.id, id: tab.id, label: tab.label }, tab.properties.map((property) => (React.createElement(BasePropertyComponent, { key: property.propertyPath, where: "show", property: property, resource: resource, record: record }))))))))));
};
export default TabsShow;
