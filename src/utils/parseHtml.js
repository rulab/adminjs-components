import edjsHTML from "editorjs-html";
const tableParser = (block) => {
    const rows = block.data.content.map((row, index) => {
        const tableHtml = [];
        if (block.data.withHeadings && index === 0) {
            tableHtml.push(`<tr>${row.map((cell) => `<th>${cell}</th>`)}</tr>`);
        }
        else {
            tableHtml.push(`<tr>${row.map((cell) => `<td>${cell}</td>`)}</tr>`);
        }
        return tableHtml;
    });
    if (block.data.withHeadings) {
        const heading = rows[0];
        const [, ...content] = rows;
        return `<table><thead>${heading.join("")}</thead><tbody>${content.join("")}</tbody></table>`;
    }
    else {
        return `<table><tbody>${rows.join("")}</tbody></table>`;
    }
};
const audioPlayerParser = (block) => {
    return `<audio controls src={${block.data.src}} />`;
};
export const parseHtml = (jsonData) => {
    const edjsParser = edjsHTML({
        table: tableParser,
        audioPlayer: audioPlayerParser,
    });
    try {
        const data = edjsParser.parse(JSON.parse(jsonData));
        return String(data).replace(/>,</g, "><");
    }
    catch (e) {
        console.log("error", e);
    }
};
