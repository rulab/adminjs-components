import React, { createContext, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Button, Icon } from '@adminjs/design-system';
import { DragHandle } from './DragHandle.js';
import { StyledListItem } from './styles.js';
const SortableItemContext = createContext({
    attributes: {},
    listeners: undefined,
    ref() { },
});
export function SortableItem({ children, id, onDelete, }) {
    const { attributes, isDragging, listeners, setNodeRef, setActivatorNodeRef } = useSortable({ id });
    const context = useMemo(() => ({
        attributes,
        listeners,
        ref: setActivatorNodeRef,
    }), [attributes, listeners, setActivatorNodeRef]);
    const style = {
        opacity: isDragging ? 0.4 : undefined,
    };
    return (React.createElement(SortableItemContext.Provider, { value: context },
        React.createElement(StyledListItem, { ref: setNodeRef, style: style },
            React.createElement("div", null,
                React.createElement(DragHandle, { context: SortableItemContext }),
                children),
            React.createElement(Button, { variant: "outlined", color: "danger", size: "icon", onClick: (e) => onDelete(e, id) },
                React.createElement(Icon, { icon: "X", color: "red" })))));
}
