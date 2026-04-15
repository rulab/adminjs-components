import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  ButtonGroup,
  CheckBox,
  Icon,
  Loader,
  Placeholder,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@adminjs/design-system";
import { ApiClient } from "adminjs";
import {
  BasePropertyComponent,
  buildActionClickHandler,
  NoRecords,
  PropertyHeader,
  SelectedRecords,
  useActionResponseHandler,
  useModal,
  useTranslation,
} from "adminjs";
import type {
  ActionJSON,
  ActionResponse,
  RecordActionResponse,
  RecordJSON,
  ResourceJSON,
} from "adminjs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { actionsToButtonGroup } from "./actions-to-button-group.js";
import { mergeRecordResponse } from "./merge-record-response.js";

const display = (isTitle: boolean): string[] => [
  isTitle ? "table-cell" : "none",
  isTitle ? "table-cell" : "none",
  "table-cell",
  "table-cell",
];

const getResourceElementCss = (resourceId: string, suffix: string) =>
  [resourceId, suffix].join("-");

type SortableRecordsTableProps = {
  resource: ResourceJSON;
  records: Array<RecordJSON>;
  actionPerformed?: (response: ActionResponse) => unknown;
  sortBy?: string;
  direction?: "asc" | "desc";
  isLoading?: boolean;
  selectedRecords?: Array<RecordJSON>;
  onSelect?: (record: RecordJSON) => unknown;
  onSelectAll?: () => unknown;
  page: number;
  perPage: number;
  refreshList: () => void;
};

const getReorderActionName = (resource: ResourceJSON) =>
  (resource as { properties?: Record<string, { custom?: { reorderActionName?: string } }> })
    .properties?.__sortableListConfig?.custom?.reorderActionName ?? "sortableListReorder";

const SortableRecordRow: React.FC<{
  resource: ResourceJSON;
  record: RecordJSON;
  actionPerformed?: (response: ActionResponse) => unknown;
  isLoading?: boolean;
  onSelect?: (record: RecordJSON) => unknown;
  isSelected?: boolean;
}> = (props) => {
  const {
    resource,
    record: recordFromProps,
    actionPerformed,
    isLoading,
    onSelect,
    isSelected,
  } = props;
  const [record, setRecord] = useState<RecordJSON>(recordFromProps);
  const navigate = useNavigate();
  const location = useLocation();
  const translateFunctions = useTranslation();
  const modalFunctions = useModal();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(record.id) });

  const rowStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
  };

  const handleActionCallback = useCallback(
    (actionResponse: ActionResponse) => {
      if (actionResponse.record && !actionResponse.redirectUrl) {
        setRecord(
          mergeRecordResponse(record, actionResponse as RecordActionResponse),
        );
      } else if (actionPerformed) {
        actionPerformed(actionResponse);
      }
    },
    [actionPerformed, record],
  );

  const actionResponseHandler = useActionResponseHandler(handleActionCallback);

  useEffect(() => {
    setRecord(recordFromProps);
  }, [recordFromProps]);

  const { recordActions } = record;

  const show = record.recordActions.find(({ name }) => name === "show");
  const edit = record.recordActions.find(({ name }) => name === "edit");
  const action = show || edit;

  const handleClick = (event: React.MouseEvent): void => {
    const targetTagName = (event.target as HTMLElement).tagName.toLowerCase();
    if (
      action &&
      targetTagName !== "a" &&
      targetTagName !== "button" &&
      targetTagName !== "svg"
    ) {
      buildActionClickHandler({
        action,
        params: { resourceId: resource.id, recordId: record.id },
        actionResponseHandler,
        navigate,
        location,
        translateFunctions,
        modalFunctions,
      })(event);
    }
  };

  const actionParams = { resourceId: resource.id, recordId: record.id };

  const handleActionClick = (
    event: React.MouseEvent,
    sourceAction: ActionJSON,
  ): void | Promise<void> =>
    buildActionClickHandler({
      action: sourceAction,
      params: actionParams,
      actionResponseHandler,
      navigate,
      location,
      translateFunctions,
      modalFunctions,
    })(event);

  const buttons = [
    {
      icon: "MoreHorizontal" as const,
      variant: "light" as const,
      label: undefined,
      "data-testid": "actions-dropdown",
      buttons: actionsToButtonGroup({
        actions: recordActions,
        params: actionParams,
        handleClick: handleActionClick,
        translateFunctions,
        modalFunctions,
      }),
    },
  ];

  const contentTag = getResourceElementCss(resource.id, "table-row");

  return (
    <TableRow
      ref={setNodeRef}
      style={rowStyle}
      className={isSelected ? "selected" : "not-selected"}
      onClick={handleClick}
      data-id={record.id}
      data-css={contentTag}
    >
      <TableCell width={0}>
        {onSelect && record.bulkActions.length ? (
          <CheckBox
            onChange={() => onSelect(record)}
            checked={isSelected}
          />
        ) : null}
      </TableCell>
      <TableCell
        width={40}
        style={{ cursor: "grab", verticalAlign: "middle" }}
        {...attributes}
        {...listeners}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          <Icon icon="Menu" color="grey60" />
        </Box>
      </TableCell>
      {resource.listProperties.map((property) => {
        const cellTag = `${resource.id}-${property.name}-table-cell`;
        return (
          <TableCell
            style={{ cursor: "pointer" }}
            key={property.propertyPath}
            data-property-name={property.propertyPath}
            display={display(property.isTitle)}
            data-css={cellTag}
          >
            {isLoading ? (
              <Placeholder style={{ height: 14 }} />
            ) : (
              <BasePropertyComponent
                key={property.propertyPath}
                where="list"
                property={property}
                resource={resource}
                record={record}
              />
            )}
          </TableCell>
        );
      })}
      <TableCell key="options" className="options">
        {recordActions.length ? <ButtonGroup buttons={buttons} /> : null}
      </TableCell>
    </TableRow>
  );
};

export const SortableRecordsTable: React.FC<SortableRecordsTableProps> = (
  props,
) => {
  const {
    resource,
    records,
    actionPerformed,
    sortBy,
    direction,
    isLoading,
    onSelect,
    selectedRecords,
    onSelectAll,
    page,
    perPage,
    refreshList,
  } = props;

  const reorderActionName = getReorderActionName(resource);
  const api = useMemo(() => new ApiClient(), []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const itemIds = useMemo(
    () => records.map((r) => String(r.id)),
    [records],
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = itemIds.indexOf(String(active.id));
    const newIndex = itemIds.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) {
      return;
    }
    const orderedRecordIds = arrayMove(
      records.map((r) => r.id),
      oldIndex,
      newIndex,
    );
    try {
      await api.resourceAction({
        resourceId: resource.id,
        actionName: reorderActionName,
        data: {
          orderedRecordIds,
          page,
          perPage,
        },
      });
      refreshList();
    } catch {
      refreshList();
    }
  };

  if (!records.length) {
    if (isLoading) {
      return <Loader />;
    }
    return <NoRecords resource={resource} />;
  }

  const selectedAll =
    selectedRecords &&
    !!records.find((record) =>
      selectedRecords.find((selected) => selected.id === record.id),
    );

  const recordsHaveBulkAction = !!records.find(
    (record) => record.bulkActions.length,
  );

  const contentTag = getResourceElementCss(resource.id, "table");
  const selectedTag = getResourceElementCss(resource.id, "table-selected-records");
  const bodyTag = getResourceElementCss(resource.id, "table-body");

  const titleProperty = resource.titleProperty;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Table data-css={contentTag}>
        <SelectedRecords
          resource={resource}
          selectedRecords={selectedRecords}
          data-css={selectedTag}
        />
        <TableHead data-css={getResourceElementCss(titleProperty.resourceId, "table-head")}>
          <TableRow data-css={`${titleProperty.resourceId}-table-head-row`}>
            <TableCell
              data-css={`${titleProperty.resourceId}-checkbox-table-cell`}
            >
              {onSelectAll && recordsHaveBulkAction ? (
                <CheckBox
                  style={{ marginLeft: 5 }}
                  onChange={() => onSelectAll()}
                  checked={selectedAll}
                />
              ) : null}
            </TableCell>
            <TableCell width={40} />
            {resource.listProperties.map((property) => (
              <PropertyHeader
                display={display(property.isTitle)}
                key={property.propertyPath}
                titleProperty={titleProperty}
                property={property}
                sortBy={sortBy}
                direction={direction}
              />
            ))}
            <TableCell key="actions" style={{ width: 80 }} />
          </TableRow>
        </TableHead>
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <TableBody data-css={bodyTag}>
            {records.map((record) => (
              <SortableRecordRow
                record={record}
                resource={resource}
                key={record.id}
                actionPerformed={actionPerformed}
                isLoading={isLoading}
                onSelect={onSelect}
                isSelected={
                  !!selectedRecords?.find((selected) => selected.id === record.id)
                }
              />
            ))}
          </TableBody>
        </SortableContext>
      </Table>
    </DndContext>
  );
};

export default SortableRecordsTable;
