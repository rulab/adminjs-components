import { DrawerContent, Tab, Tabs } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";
import React, { FC, useEffect, useMemo, useState } from "react";

import {
  ActionHeader,
  ActionProps,
  BasePropertyComponent,
  LayoutElementRenderer,
} from "adminjs";

import {
  DEFAULT_COMMON_TAB_LABEL,
  groupProperties,
  resolveCommonTabLabel,
} from "./tabs-utils.js";

const StyledTabsContent = styled.div`
  padding-top: ${({ theme }: { theme: any }) => theme.space.xl};
`;

export const TabsShow: FC<ActionProps> = (props) => {
  const { resource, record, action } = props;
  const commonLabel = resolveCommonTabLabel(resource, DEFAULT_COMMON_TAB_LABEL);

  const tabs = useMemo(
    () => groupProperties(resource.showProperties, commonLabel),
    [resource.showProperties, commonLabel],
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
    <DrawerContent>
      {action?.showInDrawer ? <ActionHeader {...props} /> : null}
      {action.layout ? (
        action.layout.map((layoutElement, i) => (
          <LayoutElementRenderer
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            layoutElement={layoutElement}
            {...props}
            where="show"
          />
        ))
      ) : (
        <Tabs currentTab={currentTab} onChange={setCurrentTab} contentComponent={StyledTabsContent}>
          {tabs.map((tab) => (
            <Tab key={tab.id} id={tab.id} label={tab.label}>
              {tab.properties.map((property) => (
                <BasePropertyComponent
                  key={property.propertyPath}
                  where="show"
                  property={property}
                  resource={resource}
                  record={record}
                />
              ))}
            </Tab>
          ))}
        </Tabs>
      )}
    </DrawerContent>
  );
};

export default TabsShow;
