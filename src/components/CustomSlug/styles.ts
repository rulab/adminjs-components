// @ts-ignore
import { styled } from "@adminjs/design-system/styled-components";
// @ts-ignore
import { Box, Button, Input } from "@adminjs/design-system";

export const StyledInputWrapper = styled(Box)`
  display: flex;
  margin-bottom: 40px;
`;

export const StyledCustomInput = styled(Input)`
  width: 100%;
  margin-right: 10px;
`;

export const StyledGenerateButton = styled(Button)`
  white-space: nowrap;
`;

export const StyledLabel = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
  text-transform: capitalize;
`;
