import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
export declare const EDITOR_TOOLS: {
    paragraph: {
        class: any;
        inlineToolbar: boolean;
    };
    list: {
        class: any;
        inlineToolbar: boolean;
    };
    header: {
        class: any;
        config: {
            placeholder: string;
            levels: number[];
            defaultLevel: number;
        };
    };
    table: {
        class: typeof Table;
        inlineToolbar: boolean;
    };
    quote: {
        class: typeof Quote;
        inlineToolbar: boolean;
    };
    audioPlayer: any;
};
