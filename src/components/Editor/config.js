import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
// @ts-ignore
import AudioPlayer from "editorjs-audio-player";
export const EDITOR_TOOLS = {
    paragraph: {
        class: Paragraph,
        inlineToolbar: true,
    },
    list: {
        class: List,
        inlineToolbar: true,
    },
    header: {
        class: Header,
        config: {
            placeholder: "Enter a header",
            levels: [2, 3, 4],
            defaultLevel: 2,
        },
    },
    table: {
        class: Table,
        inlineToolbar: true,
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
    },
    audioPlayer: AudioPlayer,
};
