import type { DraggableSyntheticListeners } from '@dnd-kit/core';

export interface DragContext {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}
