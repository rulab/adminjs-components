import React from "react";
import type { ReactNode } from "react";
import { SortableItem } from "./components/index.js";
import type { UniqueIdentifier } from "@dnd-kit/core";
interface BaseItem {
    id: UniqueIdentifier;
    value: string;
}
interface Props<T extends BaseItem> {
    items: T[];
    onChange(items: T[]): void;
    renderItem(item: T): ReactNode;
}
export declare function SortableList<T extends BaseItem>({ items, onChange, renderItem, }: Props<T>): React.JSX.Element;
export declare namespace SortableList {
    var Item: typeof SortableItem;
}
export {};
