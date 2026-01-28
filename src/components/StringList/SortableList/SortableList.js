import React, { Fragment, useMemo, useState } from "react";
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects, } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, } from "@dnd-kit/sortable";
import { SortableItem } from "./components/index.js";
import { StyledListWrapper } from "./styles.js";
const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.4",
            },
        },
    }),
};
export function SortableList({ items, onChange, renderItem, }) {
    const [active, setActive] = useState(null);
    const activeItem = useMemo(() => items.find((item) => item.id === active?.id), [active, items]);
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    }));
    return (React.createElement(DndContext, { sensors: sensors, onDragStart: ({ active }) => {
            setActive(active);
        }, onDragEnd: ({ active, over }) => {
            if (over && active.id !== over?.id) {
                const activeIndex = items.findIndex(({ id }) => id === active.id);
                const overIndex = items.findIndex(({ id }) => id === over.id);
                onChange(arrayMove(items, activeIndex, overIndex));
            }
            setActive(null);
        }, onDragCancel: () => {
            setActive(null);
        } },
        React.createElement(SortableContext, { items: items, strategy: verticalListSortingStrategy },
            React.createElement(StyledListWrapper, { role: "application" }, items.map((item, index) => (React.createElement(Fragment, { key: index }, renderItem(item)))))),
        React.createElement(DragOverlay, { dropAnimation: dropAnimationConfig }, activeItem ? renderItem(activeItem) : null)));
}
SortableList.Item = SortableItem;
