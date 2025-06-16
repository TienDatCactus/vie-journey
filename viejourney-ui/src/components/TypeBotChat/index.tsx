import { useEffect } from "react";

declare global {
  interface Window {
    Typebot?: any;
  }
}

const TypebotChat = () => {
  useEffect(() => {
    const loadTypebot = async () => {
      if (!window.Typebot) {
        const script = document.createElement("script");
        script.type = "module";
        script.innerHTML = `
          import Typebot from "https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js";
          window.Typebot = Typebot;
          Typebot.initBubble({
            typebot: "customer-support-s6c2nk8",
            theme: {
              button: { backgroundColor: "#6bd69b" },
              chatWindow: {
                backgroundColor:
                  "https://s3.typebot.io/public/workspaces/cmbp8851g002hl404bpmnzy65/typebots/vwx5n9ofwtducb8wes6c2nk8/background?v=1749486923237",
              },
            },
          });
        `;
        document.body.appendChild(script);
      }
    };

    loadTypebot();
  }, []);

  return null;
};

export default TypebotChat;
