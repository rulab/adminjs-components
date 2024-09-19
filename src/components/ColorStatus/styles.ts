import { styled } from "@adminjs/design-system/styled-components";

export const ColorStatusWrapper = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
`;

export const ShowLabel = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
  color: rgb(137, 138, 154);
`;

export const ColorStatusBadgeWrapper = styled.div`
  margin-bottom: 20px;
`;

export const ColorStatusBadge = styled.div`
  background-color: ${(props: any) => props.color};
  width: fit-content;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  color: white;
  white-space: nowrap;
`;
