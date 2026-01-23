import { Box, Input } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";

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

export const StyledListWrapper = styled(Box)<{ $hasItems?: boolean }>`
  margin-bottom: ${({ $hasItems }: { $hasItems?: boolean }) => ($hasItems ? "15px" : "4px")};
  min-height: 0;
`;

export const StyledLabel = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
  text-transform: capitalize;
`;

export const StyledShowLabel = styled(StyledLabel)`
  line-height: 16px;
  color: rgb(137, 138, 154);
  font-weight: 300;
`;

export const StyledShowWrapper = styled(Box)`
  margin-bottom: 35px;
`;

export const StyledListItem = styled.li`
  margin-bottom: 5px;
`;
