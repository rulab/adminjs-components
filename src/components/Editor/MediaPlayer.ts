// @ts-ignore
import AudioPlayer from "editorjs-audio-player";

const getFileExtension = (url: string): string => {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split("/").pop() ?? "";
    return filename.includes(".") ? filename.split(".").pop()?.toLowerCase() ?? "" : "";
  } catch {
    const cleanUrl = url.split("?")[0]?.split("#")[0] ?? "";
    const filename = cleanUrl.split("/").pop() ?? "";
    return filename.includes(".") ? filename.split(".").pop()?.toLowerCase() ?? "" : "";
  }
};

const VIDEO_EXTENSIONS = new Set([
  "mp4",
  "m4v",
  "webm",
  "ogv",
  "ogg",
  "mov",
  "m3u8",
  "3gp",
  "3g2",
]);

const isNativeVideoFile = (url: string): boolean =>
  VIDEO_EXTENSIONS.has(getFileExtension(url));

export class MediaPlayer extends (AudioPlayer as any) {
  private inputEl?: HTMLInputElement | null;

  static get toolbox() {
    const baseToolbox = (AudioPlayer as any).toolbox ?? {};
    return {
      ...baseToolbox,
      title: "Media Player",
    };
  }

  private applyWrapperSizing(tag: "audio" | "video") {
    const wrapper = this.nodes?.wrapper as HTMLElement | undefined;
    if (!wrapper) {
      return;
    }

    if (tag === "video") {
      wrapper.style.height = "auto";
      wrapper.style.minHeight = "7rem";
      wrapper.style.justifyContent = "flex-start";
      wrapper.style.gap = "8px";
      return;
    }

    wrapper.style.height = "";
    wrapper.style.minHeight = "";
    wrapper.style.justifyContent = "";
    wrapper.style.gap = "";
  }

  private applyMediaSizing(media: HTMLMediaElement, tag: "audio" | "video") {
    if (tag === "video") {
      media.style.maxHeight = "100px";
      media.style.height = "auto";
      media.style.width = "auto";
      media.style.maxWidth = "100%";
      media.style.display = "block";
      return;
    }

    media.style.maxHeight = "";
    media.style.height = "";
    media.style.width = "";
    media.style.maxWidth = "";
    media.style.display = "";
  }

  private replaceMediaTag(targetTag: "audio" | "video") {
    const currentMedia = this.nodes?.audio as HTMLMediaElement | undefined;
    if (!currentMedia) {
      return;
    }

    if (currentMedia.tagName.toLowerCase() === targetTag) {
      this.applyWrapperSizing(targetTag);
      this.applyMediaSizing(currentMedia, targetTag);
      return;
    }

    const newMedia = document.createElement(targetTag);
    const src = currentMedia.getAttribute("src");
    newMedia.setAttribute("controls", "controls");
    if (src) {
      newMedia.setAttribute("src", src);
    }
    this.applyWrapperSizing(targetTag);
    this.applyMediaSizing(newMedia, targetTag);
    currentMedia.replaceWith(newMedia);
    this.nodes.audio = newMedia;
  }

  private syncMediaByInputValue = () => {
    const value = this.inputEl?.value ?? "";
    this.replaceMediaTag(isNativeVideoFile(value) ? "video" : "audio");
  };

  render() {
    const wrapper = super.render() as HTMLElement;
    this.inputEl = wrapper.querySelector('input[name="audioUrl"]');
    if (this.inputEl) {
      this.inputEl.placeholder = "Enter your url of media file";
    }

    this.syncMediaByInputValue();
    this.inputEl?.addEventListener("change", this.syncMediaByInputValue);

    return wrapper;
  }

  save(blockContent: HTMLElement) {
    const media = blockContent.querySelector("audio, video") as HTMLMediaElement | null;
    return {
      src: media?.src ?? "",
    };
  }
}

