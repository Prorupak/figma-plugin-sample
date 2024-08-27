import "figma-plugin-types";

const width = 800;
const height = 560;

const main = () => {
  figma.showUI(__html__, {
    width: width,
    height,
  });
};

main();

figma.ui.onmessage = async (msg) => {
  if (msg.type === "fetch-initial-data") {
    figma.clientStorage.getAsync("figma_oauth_token").then((preview) => {
      figma.ui.postMessage({
        type: "auth-info",
        data: preview,
      });
    });
  }

  if (msg.type === "store-token") {
    console.log("stored", { msg });
    await figma.clientStorage.setAsync("figma_oauth_token", {
      token: msg.token,
      userId: msg.userId,
    });
  }

  if (msg.type === "retrieve-token") {
    console.log("retrieved", { msg });
    figma.clientStorage.getAsync("figma_oauth_token").then((data) => {
      console.log({ data });
      figma.ui.postMessage({ type: "token-retrieved", data });
    });
  }
};
