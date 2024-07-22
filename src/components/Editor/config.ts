import Header from "@editorjs/header";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";

export const EDITOR_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  list: List,
  header: Header,
};
