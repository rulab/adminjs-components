import { Box } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";

export const Label = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
  color: rgb(137, 138, 154);
`;

export const EditorWrapper = styled(Box)`
  padding: 12px;
  border: 1px solid rgb(187, 195, 203);
`;

export const StyledEditor = styled.div`
  .cdx-block,
  .ce-header {
    padding-left: 58px;
  }

  .cdx-list {
    padding-left: 85px;
  }

  .ce-block__content {
    width: 100%;
    max-width: none;
  }

  .ce-toolbar__content {
    max-width: none;
    left: 0;
  }

  .ce-toolbar__actions {
    left: 0;
  }

  h1.ce-header {
    font-size: 22px;
    font-weight: bold;
  }

  h2.ce-header {
    font-size: 20px;
    font-weight: bold;
  }

  h3.ce-header {
    font-size: 18px;
    font-weight: bold;
  }

  h4.ce-header {
    font-size: 16px;
    font-weight: bold;
  }

  h5.ce-header {
    font-size: 15px;
    font-weight: bold;
  }

  h6.ce-header {
    font-size: 14px;
    font-weight: bold;
  }
`;
