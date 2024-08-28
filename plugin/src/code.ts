import "figma-plugin-types";

const width = 400;
const height = 500;
let timer: number | ReturnType<typeof setTimeout>;

const main = () => {
  figma.showUI(__html__, {
    width,
    height,
  });
};

main();

type MessageData =
  | { type: "fetch-initial-data" }
  | { type: "store-token"; token: string; userId: string }
  | { type: "retrieve-token" }
  | { type: "search-query"; query: string }
  | { type: "show"; show: string }
  | { type: "quit" };

// Helper type guard
const isStoreToken = (
  msg: MessageData
): msg is { type: "store-token"; token: string; userId: string } =>
  msg.type === "store-token";

const isSearchQuery = (
  msg: MessageData
): msg is { type: "search-query"; query: string } =>
  msg.type === "search-query";

const isShowMessage = (
  msg: MessageData
): msg is { type: "show"; show: string } => msg.type === "show";

figma.ui.onmessage = async (msg: MessageData) => {
  switch (msg.type) {
    case "fetch-initial-data":
      figma.clientStorage.getAsync("figma_oauth_token").then((preview) => {
        figma.ui.postMessage({ type: "auth-info", data: preview });
      });
      break;

    case "store-token":
      if (isStoreToken(msg)) {
        await figma.clientStorage.setAsync("figma_oauth_token", {
          token: msg.token,
          userId: msg.userId,
        });
      }
      break;

    case "retrieve-token":
      figma.clientStorage.getAsync("figma_oauth_token").then((data) => {
        figma.ui.postMessage({ type: "token-retrieved", data });
      });
      break;

    case "search-query":
      if (isSearchQuery(msg)) {
        if (timer) clearTimeout(timer);
        searchFor(msg.query);
      }
      break;

    case "show":
      if (isShowMessage(msg)) {
        const node = figma.getNodeById(msg.show);
        if (node?.type !== "DOCUMENT" && node?.type !== "PAGE") {
          figma.currentPage.selection = [node as SceneNode];
          figma.viewport.scrollAndZoomIntoView([node as SceneNode]);
        }
      }
      break;

    case "quit":
      figma.closePlugin();
      break;
  }
};

function* walkTree(node: BaseNode): Generator<BaseNode, void, unknown> {
  yield node;
  if ("children" in node) {
    for (const child of node.children) {
      yield * walkTree(child);
    }
  }
}

function searchFor(query: string) {
  query = query.toLowerCase();
  const walker = walkTree(figma.currentPage);

  function processOnce() {
    const results: string[] = [];
    let count = 0;
    let done = true;
    let res;
    while (!(res = walker.next()).done) {
      const node = res.value;
      if (node.type === "TEXT") {
        const characters = (node as TextNode).characters.toLowerCase();
        if (characters.includes(query)) {
          results.push(node.id);
        }
      }
      if (++count === 1000) {
        done = false;
        timer = setTimeout(processOnce, 20);
        break;
      }
    }

    figma.ui.postMessage({ query, results, done });
  }

  processOnce();
}
