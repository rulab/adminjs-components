export type TabProperty = {
  props?: { tab?: string };
  custom?: { tab?: string };
};

export type TabEntry<TProperty = TabProperty> = {
  id: string;
  label: string;
  properties: TProperty[];
};

export const DEFAULT_COMMON_TAB_LABEL = "Common";
export const TABS_COMMON_LABEL_PROPERTY = "__tabsCommonLabel";

/**
 * Build a stable DOM id for a tab label.
 * Keeps unicode letters (e.g. Cyrillic) so distinct labels never collide.
 */
export const buildTabId = (label: string): string => {
  const slug = label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}\-_]/gu, "");

  if (slug) {
    return `tab-${slug}`;
  }

  // Symbols-only labels: keep a deterministic non-empty id.
  const encoded = encodeURIComponent(label.trim().toLowerCase()).replace(/%/g, "");
  return `tab-${encoded || "untitled"}`;
};

export const groupProperties = <TProperty extends TabProperty>(
  properties: TProperty[],
  commonLabel: string,
): TabEntry<TProperty>[] => {
  const commonProps: TProperty[] = [];
  const tabs = new Map<string, TProperty[]>();

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

  const entries: TabEntry<TProperty>[] = [
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

export const resolveCommonTabLabel = (
  resource: { properties?: Record<string, { custom?: { value?: unknown } }> },
  fallback: string = DEFAULT_COMMON_TAB_LABEL,
): string => {
  const value = resource.properties?.[TABS_COMMON_LABEL_PROPERTY]?.custom?.value;
  return typeof value === "string" && value.length > 0 ? value : fallback;
};
