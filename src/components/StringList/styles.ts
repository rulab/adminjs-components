import { Box, Input } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";

export const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-bottom: 45px;
`;

export const CustomInput = styled(Input)`
  width: 100%;
  margin-right: 10px;
`;

export const InputWrapper = styled(Box)`
  display: flex;
`;

export const ListWrapper = styled(Box)`
  margin-bottom: 15px;
`;

export const Label = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
  text-transform: capitalize;
`;

export const ShowLabel = styled(Label)`
  line-height: 16px;
  color: rgb(137, 138, 154);
  font-weight: 300;
`;

export const ShowWrapper = styled(Box)`
  margin-bottom: 35px;
`;

export const ListItem = styled.li`
  margin-bottom: 5px;
`;
