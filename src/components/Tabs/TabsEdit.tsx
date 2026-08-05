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

import {
  DEFAULT_COMMON_TAB_LABEL,
  groupProperties,
  resolveCommonTabLabel,
} from "./tabs-utils.js";

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

  const commonLabel = resolveCommonTabLabel(resource, DEFAULT_COMMON_TAB_LABEL);

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
