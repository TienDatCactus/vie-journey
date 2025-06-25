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
      placeId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-place-id"),
        renderHTML: (attributes) => {
          if (!attributes.placeId) return {};
          return { "data-place-id": attributes.placeId };
        },
      },
      showDetails: {
        default: false,
        parseHTML: (element) =>
          element.getAttribute("data-show-details") === "true",
        renderHTML: (attributes) => ({
          "data-show-details": attributes.showDetails ? "true" : "false",
        }),
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
      }),
      0,
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
              place: null, // Start with no place selected
              showDetails: false,
            },
            content: [
              {
                type: "paragraph",
              },
            ],
          });
        },
    };
  },
});
