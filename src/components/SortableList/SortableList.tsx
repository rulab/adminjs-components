import { Box, Pagination, Text } from "@adminjs/design-system";
import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { useQueryParams, useRecords, useSelectedRecords } from "adminjs";
import type { ActionProps } from "adminjs";

import { SortableRecordsTable } from "./SortableRecordsTable.js";

const REFRESH_KEY = "refresh";

/** Custom `list` action: same as default list, with drag-and-drop reorder column. */
export const SortableList: React.FC<ActionProps> = ({ resource, setTag }) => {
  const {
    records,
    loading,
    direction,
    sortBy,
    page,
    total,
    fetchData,
    perPage,
  } = useRecords(resource.id);
  const {
    selectedRecords,
    handleSelect,
    handleSelectAll,
    setSelectedRecords,
  } = useSelectedRecords(records);
  const location = useLocation();
  const { storeParams } = useQueryParams();

  useEffect(() => {
    if (setTag) {
      setTag(total.toString());
    }
  }, [total, setTag]);

  useEffect(() => {
    setSelectedRecords([]);
  }, [resource.id, setSelectedRecords]);

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    if (search.get(REFRESH_KEY)) {
      setSelectedRecords([]);
    } else {
      const recordIds = search.get("recordIds")?.split?.(",") ?? [];
      setSelectedRecords(
        records.filter((r) => recordIds.includes(r.id.toString())),
      );
    }
  }, [location.search, records, setSelectedRecords]);

  const handleActionPerformed = (): void => {
    void fetchData();
  };

  const handlePaginationChange = (pageNumber: number): void => {
    storeParams({ page: pageNumber.toString() });
  };

  return (
    <Box variant="container">
      <SortableRecordsTable
        resource={resource}
        records={records}
        actionPerformed={handleActionPerformed}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        selectedRecords={selectedRecords}
        direction={direction}
        sortBy={sortBy}
        isLoading={loading}
        page={page}
        perPage={perPage}
        refreshList={() => {
          void fetchData();
        }}
      />
      <Text mt="xl" textAlign="center">
        <Pagination
          page={page}
          perPage={perPage}
          total={total}
          onChange={handlePaginationChange}
        />
      </Text>
    </Box>
  );
};

export default SortableList;
