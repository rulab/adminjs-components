import edjsHTML from "editorjs-html";

type TableBlockType = {
  type: "table";
  data: {
    content: string[][];
    withHeadings: boolean;
  };
};

type AudioPlayerBlockType = {
  type: "audioPlayer";
  data: {
    src: string;
  };
};

type VideoBlockType = {
  type: "video";
  data: {
    url: string;
    caption?: string;
    autoplay?: boolean;
    controls?: boolean;
    muted?: boolean;
  };
};

const tableParser = (block: TableBlockType) => {
  const rows = block.data.content.map((row, index) => {
    const tableHtml = [];
    if (block.data.withHeadings && index === 0) {
      tableHtml.push(`<tr>${row.map((cell) => `<th>${cell}</th>`)}</tr>`);
    } else {
      tableHtml.push(`<tr>${row.map((cell) => `<td>${cell}</td>`)}</tr>`);
    }

    return tableHtml;
  });

  if (block.data.withHeadings) {
    const heading = rows[0] as string[];
    const [, ...content] = rows;

    return `<table><thead>${heading.join("")}</thead><tbody>${content.join("")}</tbody></table>`;
  } else {
    return `<table><tbody>${rows.join("")}</tbody></table>`;
  }
};

const audioPlayerParser = (block: AudioPlayerBlockType) => {
  return `<audio controls src="${block.data.src}"></audio>`;
};

const videoParser = (block: VideoBlockType) => {
  const controls = block.data.controls === false ? "" : " controls";
  const autoplay = block.data.autoplay ? " autoplay" : "";
  const muted = block.data.muted ? " muted" : "";
  const caption = block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : "";

  return `<figure><video src="${block.data.url}"${controls}${autoplay}${muted}></video>${caption}</figure>`;
};

export const parseHtml = (jsonData: string) => {
  const edjsParser = edjsHTML({
    table: tableParser,
    audioPlayer: audioPlayerParser,
    video: videoParser,
  });

  try {
    const data = edjsParser.parse(JSON.parse(jsonData));
    return String(data).replace(/>,</g, "><");
  } catch (e) {
    console.log("error", e);
  }
};
