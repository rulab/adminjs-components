import React from "react";

declare function EditorShow({ property, record }: {
    property: any;
    record: any;
}): React.JSX.Element;

export const EditorShow: typeof EditorShow;
export default EditorShow;
