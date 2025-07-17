import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import PlaceNodeViewComponent from "../components/place-nodes-component";

export interface PlaceAutocompleteOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    placeAutocomplete: {
      insertPlace: () => ReturnType;
    };
  }
}

export const PlaceAutocomplete = Node.create<PlaceAutocompleteOptions>({
  name: "placeAutocomplete",
  group: "block",
  content: "block*",
  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      place: {
        default: null,
      },
      showDetails: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="place-autocomplete"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "place-autocomplete",
        class: "place-node-container",
      }),
      0, // This allows content inside the node
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PlaceNodeViewComponent);
  },

  addCommands() {
    return {
      insertPlace:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              place: null,
              showDetails: false,
            },
          });
        },
    };
  },
});
