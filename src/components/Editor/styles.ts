import { Box } from "@adminjs/design-system";
import { styled } from "@adminjs/design-system/styled-components";

export const StyledLabel = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
  text-transform: capitalize;
`;

export const StyledShowLabel = styled(StyledLabel)`
  color: rgb(137, 138, 154);
  font-weight: 300;
`;

export const StyledEditorWrapper = styled(Box)`
  padding: 12px;
  margin-bottom: 24px;
  border: 1px solid rgb(187, 195, 203);
`;

export const StyledEditorViewWrapper = styled(Box)`
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

  table,
  audio {
    margin: 16px 0;
  }

  table,
  th,
  td {
    border: 1px solid;
  }

  th {
    font-weight: bold;
  }

  th,
  td {
    padding: 4px;
  }

  blockquote {
    display: block;
    padding: 5px 8px;
    width: fit-content;
    border-radius: 4px;
    background-color: #e6e6e6;
  }
`;

export const StyledEditorShowWrapper = styled(StyledEditorViewWrapper)`
  margin-bottom: 24px;
`;

export const StyledEditor = styled.div`
  audio,
  .cdx-block,
  .ce-header {
    padding-left: 58px;
  }

  input {
    margin-left: 58px;
    width: auto;
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
