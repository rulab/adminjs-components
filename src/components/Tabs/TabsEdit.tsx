import { Box, Button, DrawerContent, DrawerFooter, Icon, Tab, Tabs } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";
import React, { FC, PropsWithChildren, useEffect, useMemo, useState } from "react";

import {
  ActionProps,
  BasePropertyComponent,
  LayoutElementRenderer,
  RecordJSON,
  useRecord,
  useTranslation,
  ActionHeader,
} from "adminjs";

type TabEntry = {
  id: string;
  label: string;
  properties: Array<any>;
};

const StyledTabButton = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: ${({ theme }: { theme: any }) => `${theme.space.sm} ${theme.space.xl}`};
  cursor: pointer;
  border-bottom: 2px solid ${({ theme }: { theme: any }) => theme.colors.border};
  color: ${({ theme }: { theme: any }) => theme.colors.grey60};
  user-select: none;
  ${({ theme }: { theme: any }) => ({
    fontFamily: theme.font,
    fontSize: theme.fontSizes.md,
    lineHeight: theme.lineHeights.lg,
  })};
  ${({ active, theme }: { active: boolean; theme: any }) =>
    active
      ? `
    border-color: ${theme.colors.primary100};
    color: ${theme.colors.primary100};
  `
      : ""}
`;

const StyledTabsContent = styled.div`
  padding-top: ${({ theme }: { theme: any }) => theme.space.xl};
`;

type TabButtonProps = PropsWithChildren<{
  onClick: () => void;
  active: boolean;
  tabId: string;
  role?: string;
}>;

const TabButton: React.FC<TabButtonProps> = ({ onClick, active, tabId, role, children }) => (
  <StyledTabButton
    type="button"
    onClick={onClick}
    data-tab-id={tabId}
    role={role}
    active={active}
  >
    {children}
  </StyledTabButton>
);

const DEFAULT_COMMON_LABEL = "Common";

const buildTabId = (label: string) =>
  `tab-${label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "")}`;

const groupProperties = (properties: Array<any>, commonLabel: string): TabEntry[] => {
  const commonProps: Array<any> = [];
  const tabs = new Map<string, Array<any>>();

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

  const entries: TabEntry[] = [
    { id: "common", label: commonLabel, properties: commonProps },
  ];

  tabs.forEach((props, label) => {
    entries.push({
      id: buildTabId(label),
      label,
      properties: props,
    });
  });

  return entries;
};

export const TabsEdit: FC<ActionProps> = (props) => {
  const { record: initialRecord, resource, action } = props;
  const {
    record,
    handleChange,
    submit: handleSubmit,
    loading,
    setRecord,
  } = useRecord(initialRecord, resource.id);
  const { translateButton } = useTranslation();

  useEffect(() => {
    if (initialRecord) {
      setRecord(initialRecord);
    }
  }, [initialRecord]);

  const submit = (event: React.FormEvent<HTMLFormElement>): boolean => {
    event.preventDefault();
    handleSubmit().then((response) => {
      if (response.data.redirectUrl) {
        window.location.assign(response.data.redirectUrl);
      }
    });
    return false;
  };

  const commonLabel =
    (resource as any)?.options?.properties?.__tabsCommonLabel?.custom?.value ??
    DEFAULT_COMMON_LABEL;

  const tabs = useMemo(
    () => groupProperties(resource.editProperties, commonLabel),
    [resource.editProperties, commonLabel],
  );

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

  return (
    <Box
      as="form"
      onSubmit={submit}
      flex
      flexDirection="column"
    >
      <DrawerContent>
        {action?.showInDrawer ? <ActionHeader {...props} /> : null}
        {action.layout ? (
          action.layout.map((layoutElement, i) => (
            <LayoutElementRenderer
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              layoutElement={layoutElement}
              {...props}
              where="edit"
              onChange={handleChange}
              record={record as RecordJSON}
            />
          ))
        ) : (
          <Tabs
            currentTab={currentTab}
            onChange={setCurrentTab}
            buttonComponent={TabButton}
            contentComponent={StyledTabsContent}
          >
            {tabs.map((tab) => (
              <Tab key={tab.id} id={tab.id} label={tab.label}>
                {tab.properties.map((property) => (
                  <BasePropertyComponent
                    key={property.propertyPath}
                    where="edit"
                    onChange={handleChange}
                    property={property}
                    resource={resource}
                    record={record as RecordJSON}
                  />
                ))}
              </Tab>
            ))}
          </Tabs>
        )}
      </DrawerContent>
      <DrawerFooter>
        <Button
          variant="contained"
          type="submit"
          data-testid="button-save"
          disabled={loading}
        >
          {loading ? <Icon icon="Loader" spin /> : null}
          {translateButton("save", resource.id)}
        </Button>
      </DrawerFooter>
    </Box>
  );
};

export default TabsEdit;
