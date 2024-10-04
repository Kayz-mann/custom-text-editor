/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App.css";
import React, {
  useRef,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from "react";
import JoditEditor, { IJoditEditorProps } from "jodit-react";
import "./App.css";
import MenuOptions from "./MenuOptions";
import Modal from "./Modal";

interface DraftEditorProps {
  onChange?: (content: string) => void;
  value: string;
  placeholder?: string;
  onBlur?: (content: string) => void;
  config?: Partial<IJoditEditorProps["config"]>;
}

const DraftEditor: React.FC<DraftEditorProps> = React.memo(
  ({
    onChange,
    value,
    placeholder = "Enter content",
    onBlur,
    config: userConfig,
    ...rest
  }) => {
    const [isTitleFocused, setIsTitleFocused] = useState(false);
    const [title, setTitle] = useState("");
    const editor = useRef<any | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalFormType, setModalFormType] = useState<
      "video" | "image" | "link" | null
    >(null);
    const [wordCount, setWordCount] = useState(0);

    const debouncedOnChange = useCallback(
      (newContent: string) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          onChange?.(newContent);
        }, 200);
      },
      [onChange]
    );

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const config = useMemo(() => {
      return {
        toolbarAdaptive: false,
        showXPathInStatusbar: false,
        uploader: {
          insertImageAsBase64URI: true,
        },
        showCharsCounter: false,
        showWordsCounter: false,
        buttons: [
          {
            name: "paragraph",
            list: {
              h1: "Heading 1",
              h2: "Heading 2",
              h3: "Heading 3",
              p: "Paragraph",
            },
          },
          "|",
          "bold",
          "italic",
          "underline",
          "|",
          "left",
          "center",
          "right",
          "justify",
        ],
        editorCssClass: "draft-edits",
        placeholder,
        toolbarInline: true,
        toolbar: title.trim().length > 0 || value.trim().length > 0,
        ...userConfig,
      } as IJoditEditorProps["config"];
    }, [title, value, placeholder, userConfig]);

    const handleBlur = useCallback(
      (newContent: string) => {
        onBlur?.(newContent);
      },
      [onBlur]
    );

    const handleChange = useCallback(
      (newContent: string) => {
        debouncedOnChange(newContent);

        // Calculate word count
        const words = newContent.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
      },
      [debouncedOnChange]
    );

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    };

    const handleTitleFocus = () => {
      setIsTitleFocused(true);
    };

    const handleTitleBlur = () => {
      setIsTitleFocused(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        (editor.current as any).focus();
      }
      if (e.key === "Tab") {
        e.preventDefault();
        (editor.current as any).focus();
      }
    };

    const toggleMenu = () => {
      setIsMenuOpen((prev) => !prev);
    };

    const handleInsertImage = () => {
      setModalFormType("image");
      setIsModalOpen(true);
      setIsMenuOpen(false);
    };

    const handleInsertVideo = () => {
      setModalFormType("video");
      setIsModalOpen(true);
      setIsMenuOpen(false);
    };

    const handleInsertSocialLink = () => {
      setModalFormType("link");
      setIsModalOpen(true);
      setIsMenuOpen(false);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setModalFormType(null);
    };

    const handleEmbed = (data: any) => {
      const editorInstance = editor.current?.jodit;
      if (!editorInstance) {
        console.error("Editor instance not found");
        return;
      }

      let embedHtml = "";

      switch (data.type) {
        case "video":
          if (data.videoProvider === "youtube") {
            const videoId = data.url.split("v=")[1];
            embedHtml = `<div class="video-embed"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
          } else if (data.videoProvider === "vimeo") {
            const videoId = data.url.split("/").pop();
            embedHtml = `<div class="video-embed"><iframe src="https://player.vimeo.com/video/${videoId}" width="640" height="360" frameborder="0" allowfullscreen></iframe></div>`;
          }
          break;
        case "image":
          embedHtml = `<img src="${data.url}" alt="Embedded image" style="max-width: 100%; border-radius: 8px;" />`;
          break;
        case "link":
          if (data.iframeCode) {
            embedHtml = `<div class="social-embed">${data.iframeCode}</div>`;
          } else {
            embedHtml = `<a href="${data.url}" target="_blank" rel="noopener noreferrer">${data.socialMedia} Embedded Link</a>`;
          }
          break;
        default:
          console.error("Unsupported embed type:", data.type);
          return;
      }

      if (embedHtml) {
        editorInstance.insertHTML(embedHtml);
        editorInstance.setEditorValue(editorInstance.getEditorValue() + " ");
        console.log("Content embedded:", embedHtml);
      } else {
        console.error("Failed to generate embed HTML");
      }
    };

    return (
      <div className="editor-outer-container">
        <input
          type="text"
          placeholder="Add a title"
          className={`title-input ${isTitleFocused ? "focused" : ""}`}
          value={title}
          onChange={handleTitleChange}
          onFocus={handleTitleFocus}
          onBlur={handleTitleBlur}
          onKeyDown={handleKeyDown}
          aria-label="Title input"
        />
        <div style={{ marginTop: "10px" }} />
        <div style={{ position: "relative" }}>
          <JoditEditor
            ref={editor}
            value={value}
            config={config}
            onBlur={handleBlur}
            onChange={handleChange}
            {...rest}
          />
          <button
            className="circle-button"
            onClick={toggleMenu}
            aria-label="Insert options"
          >
            +
          </button>
          {isMenuOpen && (
            <MenuOptions
              onInsertImage={handleInsertImage}
              onInsertVideo={handleInsertVideo}
              onInsertSocialLink={handleInsertSocialLink}
            />
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEmbed={handleEmbed}
          formType={modalFormType}
        />

        {/* Footer with word count */}
        <div className="word-counter">{wordCount}/1000</div>
      </div>
    );
  }
);

DraftEditor.displayName = "DraftEditor";

export default DraftEditor;
