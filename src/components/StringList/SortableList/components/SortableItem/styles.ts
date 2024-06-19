import { styled } from '@adminjs/design-system/styled-components';

export const StyledListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px 20px 10px 15px;
  box-shadow:
    0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05),
    0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15);
  border-radius: 5px;
  list-style: none;
`;

export const DragButton = styled.button`
  padding: 3px;
  margin-right: 15px;
  cursor: move;
  background: none;
  border: none;
`;
