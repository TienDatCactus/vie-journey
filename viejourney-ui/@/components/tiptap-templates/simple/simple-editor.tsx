import { Editor, EditorContent, EditorContext, useEditor } from "@tiptap/react";
import * as React from "react";

// --- Tiptap Core Extensions ---
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

// --- Custom Extensions ---
import { Link } from "../../..//components/tiptap-extension/link-extension";
import { Selection } from "../../..//components/tiptap-extension/selection-extension";
import { TrailingNode } from "../../..//components/tiptap-extension/trailing-node-extension";

// --- UI Primitives ---
import { Button } from "../../..//components/tiptap-ui-primitive/button";
import { Spacer } from "../../..//components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "../../..//components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import "../../..//components/tiptap-node/code-block-node/code-block-node.scss";
import "../../..//components/tiptap-node/image-node/image-node.scss";
import { ImageUploadNode } from "../../..//components/tiptap-node/image-upload-node/image-upload-node-extension";
import "../../..//components/tiptap-node/list-node/list-node.scss";
import "../../..//components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { BlockQuoteButton } from "../../..//components/tiptap-ui/blockquote-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent,
} from "../../..//components/tiptap-ui/color-highlight-popover";
import { HeadingDropdownMenu } from "../../..//components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "../../..//components/tiptap-ui/image-upload-button";
import {
  LinkButton,
  LinkContent,
  LinkPopover,
} from "../../..//components/tiptap-ui/link-popover";
import { ListDropdownMenu } from "../../..//components/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "../../..//components/tiptap-ui/mark-button";
import { TextAlignButton } from "../../..//components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "../../..//components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "../../..//components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "../../..//components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "../../..//components/tiptap-icons/link-icon";

// --- Hooks ---
import { useCursorVisibility } from "../../..//hooks/use-cursor-visibility";
import { useWindowSize } from "../../..//hooks/use-window-size";
import { useMobile } from "../../../hooks/use-mobile";

// --- Components ---
import { PlaceAutocomplete } from "../../..//components/tiptap-customs/nodes/place-nodes";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "../../..//lib/tiptap-utils";

// --- Styles ---
import "../../..//components/tiptap-templates/simple/simple-editor.scss";

import { Place } from "@mui/icons-material";
import { ThemeToggle } from "./theme-toggle";
import { processBlogContent } from "../../../../src/utils/handlers/utils";

const MainToolbarContent = ({
  editor,
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  editor: Editor | null;
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  const insertPlaceNode = () => {
    editor?.chain().focus().insertContent({ type: "placeAutocomplete" }).run();
  };
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <Button onClick={insertPlaceNode}>
          <Place className="tiptap-button-icon" />
          <span>Add places</span>
        </Button>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
        <BlockQuoteButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

// Update the interface to return processed content
export function SimpleEditor({
  onContentChange,
  content,
}: {
  onContentChange?: (data: { cleanHtml: string; places: any[] }) => void;
  content?: string;
  loading?: boolean;
}) {
  const isMobile = useMobile();
  const windowSize = useWindowSize();
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main");
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      TrailingNode,
      Link.configure({ openOnClick: false }),
      PlaceAutocomplete,
    ],
    onUpdate({ editor }) {
      // Extract places and clean HTML from editor
      const processedContent = processBlogContent(editor);
      onContentChange?.(processedContent);
    },
    onCreate({ editor }) {
      // Process initial content
      setTimeout(() => {
        const processedContent = processBlogContent(editor);
        onContentChange?.(processedContent);
      }, 100);
    },
    content: content || "<p></p>",
  });

  const bodyRect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  return (
    <EditorContext.Provider value={{ editor }}>
      <Toolbar
        className="rounded-t-md  shadow-md"
        ref={toolbarRef}
        style={
          isMobile
            ? {
                bottom: `calc(100% - ${windowSize.height - bodyRect.y}px)`,
              }
            : {}
        }
      >
        {mobileView === "main" ? (
          <MainToolbarContent
            editor={editor}
            onHighlighterClick={() => setMobileView("highlighter")}
            onLinkClick={() => setMobileView("link")}
            isMobile={isMobile}
          />
        ) : (
          <MobileToolbarContent
            type={mobileView === "highlighter" ? "highlighter" : "link"}
            onBack={() => setMobileView("main")}
          />
        )}
      </Toolbar>

      <div className="content-wrapper border border-dashed border-neutral-600 border-t-0 max-h-200 h-150 overflow-y-scroll rounded-b-md">
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </div>
    </EditorContext.Provider>
  );
}
