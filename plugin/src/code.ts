import "figma-plugin-types";

const width = 400;
const height = 500;
let timer: number | ReturnType<typeof setTimeout>;

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
    await figma.clientStorage.setAsync("figma_oauth_token", {
      token: msg.token,
      userId: msg.userId,
    });
  }

  if (msg.type === "retrieve-token") {
    figma.clientStorage.getAsync("figma_oauth_token").then((data) => {
      figma.ui.postMessage({ type: "token-retrieved", data });
    });
  }

  if (msg.query !== undefined) {
    if (timer) {
      clearTimeout(timer);
    }
    if (msg.query) {
      searchFor(msg.query);
    }
  } else if (msg.show) {
    const node = figma.getNodeById(msg.show);
    if (node?.type === "DOCUMENT" || node?.type === "PAGE") {
      // DOCUMENTs and PAGEs can't be put into the selection.
      return;
    }
    figma.currentPage.selection = [node as SceneNode];
    figma.viewport.scrollAndZoomIntoView([node as SceneNode]);
  } else if (msg.quit) {
    figma.closePlugin();
  }
};

function* walkTree(node: any): any {
  yield node;
  const children = node.children;
  if (children) {
    for (const child of children) {
      yield* walkTree(child);
    }
  }
}

function searchFor(query: string) {
  query = query.toLowerCase();
  const walker = walkTree(figma.currentPage);

  function processOnce() {
    const results = [];
    let count = 0;
    let done = true;
    let res;
    while (!(res = walker.next()).done) {
      const node = res.value;
      if (node.type === "TEXT") {
        const characters = node.characters.toLowerCase();
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
