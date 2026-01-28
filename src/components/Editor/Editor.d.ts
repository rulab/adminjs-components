import React from "react";

declare function Editor({ property, record, onChange, onChangeAdmin, editorId }: {
    property: any;
    record: any;
    onChange?: any;
    onChangeAdmin?: any;
    editorId?: any;
}): React.JSX.Element;

export const Editor: typeof Editor;
export default Editor;
