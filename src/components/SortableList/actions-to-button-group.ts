import type { ButtonGroupProps, ButtonInGroupProps } from "@adminjs/design-system";
import { actionHref, buildActionTestId } from "adminjs";
import type { ActionJSON } from "adminjs";

/**
 * Mirrors adminjs's internal actionsToButtonGroup (not re-exported from the package entry).
 * @see adminjs/lib/frontend/components/app/action-header/actions-to-button-group.js
 */
export type ActionsToButtonGroupOptions = {
  actions: Array<ActionJSON>;
  params: { resourceId: string; recordId?: string };
  handleClick: ButtonInGroupProps["onClick"];
  translateFunctions: {
    translateAction: (label: string, resourceId: string) => string;
  };
  modalFunctions?: unknown;
};

export const actionsToButtonGroup = (
  options: ActionsToButtonGroupOptions,
): ButtonGroupProps["buttons"] => {
  const { actions, params, handleClick, translateFunctions } = options;
  const { translateAction } = translateFunctions;
  const { resourceId } = params;

  const buttons = actions.map((action) => {
    const href = actionHref(action, params);
    return {
      icon: action.icon,
      label: translateAction(action.label, resourceId),
      variant: action.variant,
      source: action,
      href: href || undefined,
      onClick: href ? handleClick : undefined,
      "data-testid": buildActionTestId(action),
      buttons: [] as NonNullable<ButtonGroupProps["buttons"]>,
      "data-css": `${action.resourceId}-${action.name}-button`,
    };
  });

  const buttonsMap = buttons.reduce<Record<string, any>>((memo, button) => {
    const action = button.source;
    if (action.parent) {
      const parent =
        memo[action.parent] ||
        buttons.find((btn) => btn.source.name === action.parent) || {
          label: action.parent,
        };
      parent.buttons = parent.buttons || [];
      parent.buttons.push(button);
      return {
        ...memo,
        [action.parent]: parent,
      };
    }
    return {
      ...memo,
      [button.source.name]: button,
    };
  }, {});

  return Object.values(buttonsMap) as ButtonGroupProps["buttons"];
};
