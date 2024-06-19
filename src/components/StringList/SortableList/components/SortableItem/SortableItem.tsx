import React, { createContext, useMemo, ChangeEvent } from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { Button, Icon } from '@adminjs/design-system';

import { DragHandle } from './DragHandle.js';
import { StyledListItem } from './styles.js';
import type { DragContext } from './types.js';

interface SortableItemPropsType {
  id: string;
  onDelete: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
}

const SortableItemContext = createContext<DragContext>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export function SortableItem({
  children,
  id,
  onDelete,
}: PropsWithChildren<SortableItemPropsType>) {
  const { attributes, isDragging, listeners, setNodeRef, setActivatorNodeRef } =
    useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef],
  );

  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <StyledListItem ref={setNodeRef} style={style}>
        <div>
          <DragHandle context={SortableItemContext} />
          {children}
        </div>
        <Button
          variant="outlined"
          color="danger"
          size="icon"
          onClick={(e: ChangeEvent<HTMLInputElement>) => onDelete(e, id)}
        >
          <Icon icon="X" color="red" />
        </Button>
      </StyledListItem>
    </SortableItemContext.Provider>
  );
}
