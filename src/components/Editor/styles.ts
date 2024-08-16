import { Box } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";

export const Label = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
  color: rgb(137, 138, 154);
`;

export const EditorWrapper = styled(Box)`
  padding: 12px;
  margin-bottom: 24px;
  border: 1px solid rgb(187, 195, 203);
`;

export const EditorShowWrapper = styled(Box)`
  margin-bottom: 24px;

  h1,
  h2,
  h3 {
    margin-bottom: 5px;
    font-weight: bold;
  }

  h1 {
    font-size: 18px;
  }

  h2 {
    font-size: 16px;
  }

  h3 {
    font-size: 14px;
  }

  p {
    margin-bottom: 8px;
  }

  ol,
  ul {
    margin-left: 20px;
    margin-bottom: 8px;
  }

  ol {
    list-style: auto;
  }

  ul {
    list-style: inherit;
  }
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
