# adminjs-components

Prebuilt AdminJS components and features for common UI needs: colored status
badges, slug generation, Editor.js content, sortable string lists, tabs layout,
and record preview.

## Install

```bash
pnpm add @rulab/adminjs-components
# or
npm install @rulab/adminjs-components
```

## Quick start

```ts
import AdminJS from "adminjs";
import { ComponentLoader } from "adminjs";
import { setComponentLoader, ColorStatusFeature } from "@rulab/adminjs-components";

const componentLoader = new ComponentLoader();
setComponentLoader(componentLoader);

const admin = new AdminJS({
  componentLoader,
  resources: [
    {
      resource: YourResource,
      features: [
        ColorStatusFeature({
          key: "status",
          availableValues: [
            { value: "draft", label: "Draft", color: "#64748b" },
            { value: "published", label: "Published", color: "#16a34a" },
          ],
        }),
      ],
    },
  ],
});
```

You can also pass `componentLoader` into every feature instead of calling
`setComponentLoader`.

## Components and features

### ColorStatus

Renders a colored badge in edit/list/show based on a list of available values.

```ts
import { ColorStatusFeature } from "@rulab/adminjs-components";

features: [
  ColorStatusFeature({
    key: "status",
    availableValues: [
      { value: "draft", label: "Draft", color: "#64748b" },
      { value: "review", label: "In review", color: "#f59e0b" },
      { value: "published", label: "Published", color: "#16a34a" },
    ],
  }),
]
```

### Slug

Generates a slug from another field and stores it in the target property.

```ts
import { SlugFeature } from "@rulab/adminjs-components";

features: [
  SlugFeature({
    key: "slug",
    source: "title",
  }),
]
```

### Editor

Editor.js field for rich content. Supports optional image upload via
`@adminjs/upload` provider.

```ts
import { EditorFeature } from "@rulab/adminjs-components";
import { BaseProvider } from "@adminjs/upload";

const uploadProvider = new BaseProvider({
  bucket: "my-bucket",
  baseUrl: "https://cdn.example.com",
});

features: [
  EditorFeature({
    key: "content",
    uploadProvider, // optional
  }),
]
```

### StringList

Sortable list stored as a single string (comma-separated by default).

```ts
import { StringListFeature } from "@rulab/adminjs-components";

features: [
  StringListFeature({
    key: "facts",
  }),
]
```

### Tabs

Groups edit/show fields into tabs based on property `props.tab` or
`custom.tab`. Fields without a tab go to a common group.

```ts
import { TabsFeature } from "@rulab/adminjs-components";

features: [
  TabsFeature({
    commonTabLabel: "Common",
  }),
]

// resource options example
properties: {
  title: { props: { tab: "Main" } },
  description: { props: { tab: "Main" } },
  seoTitle: { props: { tab: "SEO" } },
  seoDescription: { props: { tab: "SEO" } },
},
```

### Preview

Adds a record action that renders an iframe preview. The `url` can include
template variables like `$id` or `$slug`.

```ts
import { PreviewFeature } from "@rulab/adminjs-components";

features: [
  PreviewFeature({
    url: "https://example.com/posts/$id",
    actionName: "preview", // optional
  }),
]
```

## Utilities

- `setComponentLoader(loader)` and `getComponentLoader()` to reuse a single
  AdminJS `ComponentLoader`.
- `parseHtml(html)` helper to transform stored Editor.js output into HTML.