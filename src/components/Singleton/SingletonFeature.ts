import type {
  ActionContext,
  ActionHandler,
  ActionRequest,
  BaseResource,
  FeatureType,
  ListActionResponse,
  ResourceOptions,
} from "adminjs";
import { Filter, ListAction, mergeResourceOptions } from "adminjs";

/** TypeORM's Resource exposes primary key name; other adapters often use `id`. */
const getPkSortField = (resource: BaseResource): string => {
  const r = resource as { idName?: () => string };
  if (typeof r.idName === "function") {
    return r.idName();
  }
  return "id";
};

const runDefaultListHandler = async (
  request: ActionRequest,
  response: unknown,
  context: ActionContext,
): Promise<ListActionResponse> =>
  await (ListAction.handler as ActionHandler<ListActionResponse>)(
    request,
    response,
    context,
  );

const TOO_MANY_RECORDS_NOTICE = {
  message:
    "Singleton mode requires exactly one record. Delete or merge the extra records so that only one remains for this resource to work correctly.",
  type: "error" as const,
};

/** Shown when another feature already registered `list.after` before Singleton merged (wrong order). */
const FEATURE_ORDER_ERROR_NOTICE = {
  message:
    "SingletonFeature is registered too late: another feature already added a `list.after` hook. Move SingletonFeature() earlier in the `features` array.",
  type: "error" as const,
};

const listAfterAlreadyRegistered = (prevOptions: ResourceOptions): boolean =>
  Boolean(prevOptions.actions?.list?.after);

/**
 * List responses with only `redirectUrl` omit `records`; other features (e.g. `@adminjs/upload`
 * `list.after`) expect an array and call `.map`. Include empty `records` and minimal `meta`.
 */
const listRedirectResponse = (
  resource: BaseResource,
  redirectUrl: string,
  total: number,
): ListActionResponse =>
  ({
    redirectUrl,
    records: [],
    meta: {
      page: 1,
      perPage: 10,
      direction: "asc",
      sortBy: getPkSortField(resource),
      total,
    },
  }) as ListActionResponse;

/**
 * `@adminjs/upload` registers `list.after` that does `records.map(...)`. AdminJS merges `after`
 * hooks in feature order, so this must run **before** upload's hook — place `SingletonFeature`
 * earlier in `features` than `uploadFeature`.
 */
const ensureListRecordsBeforeUploadHooks = async (
  response: ListActionResponse,
  _request: ActionRequest,
  context: ActionContext,
): Promise<ListActionResponse> => {
  const { resource } = context;
  const records = response.records ?? [];
  const meta =
    response.meta ??
    ({
      page: 1,
      perPage: 10,
      direction: "asc",
      sortBy: getPkSortField(resource),
      total: records.length,
    } as ListActionResponse["meta"]);
  return { ...response, records, meta };
};

const appendFeatureOrderNotice = async (
  response: ListActionResponse,
  _request: ActionRequest,
  _context: ActionContext,
): Promise<ListActionResponse> => ({
  ...response,
  notice: FEATURE_ORDER_ERROR_NOTICE,
});

/**
 * Ensures a resource behaves as a singleton: opening the list redirects to **new** when there are
 * no rows, to **edit** when there is exactly one row, or shows the default list with an error
 * notice when more than one row exists.
 *
 * Counts rows with an empty filter (all rows for the resource). If another feature also defines a
 * custom `list` handler, register `SingletonFeature` **after** it so this handler runs last.
 *
 * Register **before** `@adminjs/upload` (and similar) so `list.after` hooks run as
 * `[ensureListRecordsBeforeUploadHooks, fillPaths, …]`.
 *
 * If `list.after` is already present when this feature merges (features applied earlier in the
 * array registered it), singleton behaviour is **disabled**; the default list handler still runs
 * and a notice is appended via `list.after` recommending the correct feature order.
 */
export const SingletonFeature = (): FeatureType => {
  return (_admin, prevOptions: ResourceOptions = {}) => {
    if (listAfterAlreadyRegistered(prevOptions)) {
      const orderErrorPatch: ResourceOptions = {
        actions: {
          list: {
            after: appendFeatureOrderNotice,
          },
        },
      };
      return mergeResourceOptions(prevOptions, orderErrorPatch);
    }

    const patch: ResourceOptions = {
      actions: {
        list: {
          after: ensureListRecordsBeforeUploadHooks,
          handler: async (request, response, context: ActionContext) => {
            const { resource, h } = context;
            const resourceId = resource.id();
            const emptyFilter = await new Filter({}, resource).populate(context);
            const total = await resource.count(emptyFilter, context);

            if (total === 0) {
              return listRedirectResponse(resource, h.newUrl(resourceId), 0);
            }

            if (total === 1) {
              const rows = await resource.find(
                emptyFilter,
                {
                  limit: 1,
                  offset: 0,
                  sort: {
                    sortBy: getPkSortField(resource),
                    direction: "asc",
                  },
                },
                context,
              );
              const row = rows[0];
              if (!row) {
                return listRedirectResponse(resource, h.newUrl(resourceId), 0);
              }
              return listRedirectResponse(
                resource,
                h.recordActionUrl({
                  resourceId,
                  recordId: row.id(),
                  actionName: "edit",
                }),
                1,
              );
            }

            const listResponse = await runDefaultListHandler(
              request,
              response,
              context,
            );

            return {
              ...listResponse,
              notice: TOO_MANY_RECORDS_NOTICE,
            };
          },
        },
      },
    };

    return mergeResourceOptions(prevOptions, patch);
  };
};

export default SingletonFeature;
