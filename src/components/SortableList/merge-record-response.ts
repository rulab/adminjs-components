import type { RecordActionResponse, RecordJSON } from "adminjs";

/** Same behavior as adminjs merge-record-response (local copy to avoid deep imports). */
export const mergeRecordResponse = (
  record: RecordJSON,
  response: RecordActionResponse,
): RecordJSON =>
  ({
    ...(response.record || record),
    errors: response.record.errors,
    populated: {
      ...record.populated,
      ...response.record.populated,
    },
    params: {
      ...record.params,
      ...response.record.params,
    },
  }) as RecordJSON;
