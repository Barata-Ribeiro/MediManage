import { $createTweetNode, $isTweetNode, TweetNode } from '@/components/editor/nodes/embeds/tweet-node';
import { ElementTransformer }                        from '@lexical/markdown';

export const TWEET: ElementTransformer = {
  dependencies: [TweetNode],
  export: (node) => {
    if (!$isTweetNode(node)) {
      return null
    }

    return `<tweet id="${node.getId()}" />`
  },
  regExp: /<tweet id="([^"]+?)"\s?\/>\s?$/,
  replace: (textNode, _1, match) => {
    const [, id] = match
    const tweetNode = $createTweetNode(id)
    textNode.replace(tweetNode)
  },
  type: "element",
}
