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

type AttachesBlockType = {
  type: "attaches";
  data: {
    title?: string;
    file: {
      url: string;
      name?: string;
      size?: number;
      extension?: string;
    };
  };
};

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const escapeAttr = (text: string): string =>
  String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

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

const attachesParser = (block: AttachesBlockType) => {
  const { file, title } = block.data;
  const href = file?.url ?? "";
  const linkText = title?.trim() || file?.name || "Download";
  const meta =
    file?.size != null
      ? ` <span class="editor-attaches-meta">(${escapeHtml(String(file.size))} bytes)</span>`
      : "";
  return `<p class="editor-attaches"><a href="${escapeAttr(href)}" download>${escapeHtml(linkText)}</a>${meta}</p>`;
};

export const parseHtml = (jsonData: string) => {
  const edjsParser = edjsHTML({
    table: tableParser,
    audioPlayer: audioPlayerParser,
    video: videoParser,
    attaches: attachesParser,
  });

  try {
    const data = edjsParser.parse(JSON.parse(jsonData));
    return String(data).replace(/>,</g, "><");
  } catch (e) {
    console.log("error", e);
  }
};
