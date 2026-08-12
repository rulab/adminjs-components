# adminjs-components

<a id="top"></a>

Prebuilt AdminJS components and features for common UI needs: colored status
badges, slug and UUID generation, Editor.js content (images and file attachments),
sortable string lists, drag-and-drop list ordering, singleton resources, tabs
layout, record preview, and QR codes for templated URLs.

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

- [Singleton](#singleton) — register **first** when used with other features
- [ColorStatus](#colorstatus)
- [Slug](#slug)
- [UUID](#uuid)
- [Editor](#editor)
- [StringList](#stringlist)
- [SortableList](#sortablelist)
- [Tabs](#tabs)
- [Preview](#preview)
- [QrCode](#qrcode)
- [Localization](#localization)

### Singleton

Makes a resource behave as a **singleton**: opening the **list** redirects to
**new** when there are no rows, to **edit** when there is exactly one row, or
shows the normal list with an error notice when more than one row exists.

Notices use i18n keys `messages.singletonTooManyRecords` and
`messages.singletonFeatureOrderError` (English defaults via `options.defaultValue`).

**Feature order:** add `SingletonFeature()` **first** in the resource `features`
array when you combine it with other features. AdminJS merges `list.after`
hooks in registration order; if another feature has already registered
`list.after` before Singleton applies, singleton behaviour is turned off and you
get a notice asking you to move Singleton earlier. That matters especially for
`@adminjs/upload`, which adds a `list.after` that expects `records` to exist —
Singleton must merge **before** upload so the hook chain stays correct.

**Exception:** if another feature defines a **custom `list` handler**, register
`SingletonFeature` **after** that feature so the custom handler still runs as
intended (see inline comments in the source for details).

```ts
import { SingletonFeature } from "@rulab/adminjs-components";

features: [
  SingletonFeature(),
  // …other features (e.g. EditorFeature with @adminjs/upload, TabsFeature)
];
```

[Back to top](#top)

### ColorStatus

Renders a colored badge in edit/list/show based on a list of available values.
By default (`nullable: false`) the first option is auto-selected in new records.
Set `nullable: true` to allow an empty value.

```ts
import { ColorStatusFeature } from "@rulab/adminjs-components";

features: [
  ColorStatusFeature({
    key: "status",
    nullable: false, // optional, default false
    availableValues: [
      { value: "draft", label: "Draft", color: "#64748b" },
      { value: "review", label: "In review", color: "#f59e0b" },
      { value: "published", label: "Published", color: "#16a34a" },
    ],
  }),
]
```

[Back to top](#top)

### Slug

Generates a slug from another field and stores it in the target property.
Use `button` to override the generate button label in edit view.
Without `button`, the label uses AdminJS i18n key `buttons.generateSlug`
(default: `"Generate Slug"`).

```ts
import { SlugFeature } from "@rulab/adminjs-components";

features: [
  SlugFeature({
    key: "slug",
    source: "title",
    button: "Create slug", // optional
  }),
]
```

[Back to top](#top)

### UUID

Adds a UUID field with a generate button in edit view.
Use `button` to override the label; otherwise i18n key `buttons.generateUuid`
(default: `"Generate UUID"`).

```ts
import { UuidFeature } from "@rulab/adminjs-components";

features: [
  UuidFeature({
    key: "uuid",
    button: "Generate ID", // optional
  }),
]
```

[Back to top](#top)

### Editor

Editor.js field for rich content. With `uploadProvider` (`@adminjs/upload`), the
editor enables **image** upload (`@editorjs/image`) and **file attachments**
(`@editorjs/attaches` — downloadable files with an editable title). Built-in
audio and video blocks are always available.

The attaches tool button uses `buttons.attachFile` (default: `"Attach file"`).
Upload action notices: `messages.editorNoFileProvided`,
`messages.editorUploadFailed`.

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
    uploadProvider, // optional — enables Image + Attach file tools
  }),
]
```

[Back to top](#top)

### StringList

Sortable list stored as a single string (pipe-separated by default).
Use `separator` to override the delimiter used for **storing** values.

In the **list** view values are always shown joined with `", "`. If the
resulting string is longer than `listMaxLength` (default `80`), it is truncated
with a clickable `...` spoiler; when expanded, a clickable `<` collapses it
again. Spoiler `aria-label`s use `messages.stringListExpand` /
`messages.stringListCollapse`.

```ts
import { StringListFeature } from "@rulab/adminjs-components";

features: [
  StringListFeature({
    key: "facts",
    separator: "|", // optional, default "|"
    listMaxLength: 80, // optional, default 80 — list-view spoiler threshold
  }),
]
```

[Back to top](#top)

### SortableList

Replaces the default **list** view with a drag-and-drop table so you can reorder
records. New positions are saved to a numeric property on each record (default
`sort`) via a hidden resource action. The resource is sorted by that field by
default unless you already set `sort` in resource options.

Reorder notices: `messages.sortableListNothingToReorder`,
`messages.sortableListOrderUpdated`.

```ts
import { SortableListFeature } from "@rulab/adminjs-components";

features: [
  SortableListFeature({
    sortField: "sort", // optional, default "sort" — must exist on your model
    reorderActionName: "sortableListReorder", // optional, default shown
    direction: "ASC", // optional: "ASC" | "DESC" — how order maps to numbers per page
  }),
];
```

[Back to top](#top)

### Tabs

Groups edit/show fields into tabs based on property `props.tab` or
`custom.tab`. Fields without a tab go to a common group.
`commonTabLabel` is optional and defaults to `"Common"`.

```ts
import { TabsFeature } from "@rulab/adminjs-components";

features: [
  TabsFeature({
    commonTabLabel: "General", // optional, default "Common"
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

[Back to top](#top)

### Preview

Adds a record action that renders an iframe preview. The `url` can include
template variables like `$id` or `$slug`.

UI strings: `messages.previewUrlNotConfigured`, `messages.preview`,
`buttons.back`, `buttons.openInNewTab`.

```ts
import { PreviewFeature } from "@rulab/adminjs-components";

features: [
  PreviewFeature({
    url: "https://example.com/posts/$id",
    actionName: "preview", // optional
  }),
]
```

[Back to top](#top)

### QrCode

Property on **edit** / **show** that builds a QR code from a URL template
(`$id`, `$uuid`, `$slug`, … — same `$field` syntax as Preview).

The generation flag is stored in the property named by `key` (empty = not
generated, ISO timestamp = generated). Use a **different `key` per feature** if
you need several QR codes on one resource. The QR image itself is not stored in
the database; it is rendered on the client from the resolved URL.

- **Edit:** if not generated — message + **Generate**; if generated — QR image +
  **Download** (with icon). Save the record after Generate so the flag persists.
- **Show:** view-only (message or QR image, no buttons).

Your entity must have a nullable string column matching `key`.

UI strings use AdminJS i18n — see [Localization](#localization) for keys
(`qrCodeNotGenerated`, `generateQrCode`, `downloadQrCode`, …).

```ts
import { QrCodeFeature } from "@rulab/adminjs-components";

features: [
  QrCodeFeature({
    key: "homeQr",
    url: "https://example.com/page/$id/$slug",
  }),
]
```

[Back to top](#top)

## Localization

User-facing strings in this package use AdminJS
`translateMessage` / `translateButton` (and notices pass camelCase keys with
`options.defaultValue`). Override globally or per resource:

```ts
locale: {
  translations: {
    en: {
      messages: {
        // QrCode
        qrCodeNotGenerated: "QR code has not been generated yet.",
        qrCodeEmptyUrl:
          "Cannot generate QR code: the URL template resolved to an empty string. Check that referenced fields have values.",
        qrCodeGenerateFailed: "Failed to generate QR code.",
        // Preview
        previewUrlNotConfigured: "Preview URL is not configured.",
        preview: "Preview",
        // StringList list spoiler
        stringListExpand: "Expand",
        stringListCollapse: "Collapse",
        // Singleton
        singletonTooManyRecords:
          "Singleton mode requires exactly one record. Delete or merge the extra records so that only one remains for this resource to work correctly.",
        singletonFeatureOrderError:
          "SingletonFeature is registered too late: another feature already added a `list.after` hook. Move SingletonFeature() earlier in the `features` array.",
        // SortableList
        sortableListNothingToReorder: "Nothing to reorder.",
        sortableListOrderUpdated: "Order updated.",
        // Editor upload action
        editorNoFileProvided: "No file provided.",
        editorUploadFailed: "Upload failed.",
      },
      buttons: {
        generateQrCode: "Generate",
        downloadQrCode: "Download",
        generateSlug: "Generate Slug",
        generateUuid: "Generate UUID",
        attachFile: "Attach file",
        back: "< Back",
        openInNewTab: "Open in new tab",
      },
    },
  },
}
```

Resource-scoped keys also work, e.g.
`resources.{resourceId}.messages.qrCodeNotGenerated`,
`resources.{resourceId}.buttons.generateQrCode`.

[Back to top](#top)

## Utilities

- `setComponentLoader(loader)` and `getComponentLoader()` to reuse a single
  AdminJS `ComponentLoader`.
- `parseHtml(html)` helper to transform stored Editor.js output into HTML.