import edjsHTML from "editorjs-html";

export const parseHtml = (jsonData?: string) => {
  const edjsParser = edjsHTML();

  try {
    const data = edjsParser.parse(JSON.parse(String(jsonData)));
    return String(data).replace(/>,</g, "><");
  } catch (e) {
    return;
  }
};
