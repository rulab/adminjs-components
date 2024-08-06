import { styled } from "@adminjs/design-system/styled-components";
import { Box, Input } from "@adminjs/design-system";

export const StyledWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-bottom: 45px;
`;

export const StyledCustomInput = styled(Input)`
  width: 100%;
  margin-right: 10px;
`;

export const StyledInputWrapper = styled(Box)`
  display: flex;
`;

export const StyledListWrapper = styled(Box)`
  margin-bottom: 15px;
`;

export const StringListShowLabel = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
  text-transform: capitalize;
  line-height: 16px;
  color: rgb(137, 138, 154);
`;

export const StringListShowWrapper = styled(Box)`
  margin-bottom: 35px;
`;

export const ListItem = styled.li`
  margin-bottom: 5px;
`;
