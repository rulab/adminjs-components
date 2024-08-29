// @ts-ignore
import { styled } from "@adminjs/design-system/styled-components";
// @ts-ignore
import { Box, Button, Input } from "@adminjs/design-system";

export const InputWrapper = styled(Box)`
  display: flex;
  margin-bottom: 40px;
`;

export const CustomInput = styled(Input)`
  width: 100%;
  margin-right: 10px;
`;

export const GenerateButton = styled(Button)`
  white-space: nowrap;
`;

export const Label = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
  text-transform: capitalize;
`;
