import React, { ChangeEvent } from 'react';
import type { PropsWithChildren } from 'react';
interface SortableItemPropsType {
    id: string;
    onDelete: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
}
export declare function SortableItem({ children, id, onDelete, }: PropsWithChildren<SortableItemPropsType>): React.JSX.Element;
export {};
