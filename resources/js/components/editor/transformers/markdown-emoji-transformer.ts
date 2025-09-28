import emojiList                from '@/components/editor/utils/emoji-list';
import { TextMatchTransformer } from '@lexical/markdown';
import { $createTextNode }      from 'lexical';

export const EMOJI: TextMatchTransformer = {
  dependencies: [],
  export: () => null,
  importRegExp: /:([a-z0-9_]+):/,
  regExp: /:([a-z0-9_]+):/,
  replace: (textNode, [, name]) => {
    const emoji = emojiList.find((e) => e.aliases.includes(name))?.emoji
    if (emoji) {
      textNode.replace($createTextNode(emoji))
    }
  },
  trigger: ":",
  type: "text-match",
}
