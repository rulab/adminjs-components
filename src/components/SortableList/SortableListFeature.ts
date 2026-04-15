import type { ActionContext, ComponentLoader, FeatureType, ResourceOptions } from "adminjs";
import { mergeResourceOptions } from "adminjs";
import { bundleComponent } from "../../utils/bundle-component.js";

/** Default list ordering and rule for assigning numeric `sortField` values after drag-and-drop. */
export type SortableListSortDirection = "ASC" | "DESC";

export type SortableListOptions = {
  componentLoader?: ComponentLoader;
  /** Property path used for manual ordering (default: `sort`) */
  sortField?: string;
  /** Hidden resource action that persists new order (default: `sortableListReorder`) */
  reorderActionName?: string;
  /**
   * Default sort on the list and how positions map to stored numbers (1-based per page window).
   * `ASC`: first row → smallest value in the range; `DESC`: first row → largest.
   * @default 'ASC'
   */
  direction?: SortableListSortDirection;
};

const toResourceSortDirection = (
  direction: SortableListSortDirection,
): "asc" | "desc" => (direction === "DESC" ? "desc" : "asc");

const COMPONENT_DIR = "SortableList";

export const SortableListFeature = (config: SortableListOptions): FeatureType => {
  const sortField = config.sortField ?? "sort";
  const reorderActionName = config.reorderActionName ?? "sortableListReorder";
  const listDirection: SortableListSortDirection = config.direction ?? "ASC";
  const { componentLoader } = config;

  const listComponent = bundleComponent(
    componentLoader,
    COMPONENT_DIR,
    "SortableList.js",
  );

  return (admin, prevOptions: ResourceOptions = {}) => {
    const patch: ResourceOptions = {
      properties: {
        __sortableListConfig: {
          isVisible: false,
          custom: {
            sortField,
            reorderActionName,
            direction: listDirection,
          },
        },
      },
      actions: {
        list: {
          component: listComponent,
        },
        [reorderActionName]: {
          actionType: "resource",
          isVisible: false,
          handler: async (request, _response, context: ActionContext) => {
            const payload = request?.payload as {
              orderedRecordIds?: unknown;
              page?: unknown;
              perPage?: unknown;
            };
            const rawIds = payload?.orderedRecordIds;
            if (!Array.isArray(rawIds) || rawIds.length === 0) {
              return {
                notice: { message: "Nothing to reorder.", type: "error" },
              };
            }
            const page = Number(payload?.page) || 1;
            const perPage = Number(payload?.perPage) || 10;
            const base = (page - 1) * perPage;
            const n = rawIds.length;

            for (let i = 0; i < n; i++) {
              const id = rawIds[i];
              const record = await context.resource.findOne(String(id), context);
              if (!record) {
                continue;
              }
              const sortValue =
                listDirection === "DESC"
                  ? base + (n - i)
                  : base + i + 1;
              await record.update({ [sortField]: sortValue }, context);
            }

            return {
              notice: { message: "Order updated.", type: "success" },
            };
          },
        },
      },
    };

    if (!prevOptions.sort) {
      patch.sort = {
        sortBy: sortField,
        direction: toResourceSortDirection(listDirection),
      };
    }

    return mergeResourceOptions(prevOptions, patch);
  };
};

export default SortableListFeature;
