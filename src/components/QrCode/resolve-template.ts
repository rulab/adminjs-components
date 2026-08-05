export const resolveTemplate = (
  template: string,
  params: Record<string, unknown>,
): string =>
  template.replace(/\$([A-Za-z0-9_]+)/g, (_, key: string) => {
    const value = params?.[key];
    return value === undefined || value === null ? "" : String(value);
  });
