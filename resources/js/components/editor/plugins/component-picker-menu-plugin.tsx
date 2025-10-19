import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalTypeaheadMenuPlugin, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { TextNode } from 'lexical';
import { JSX, useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { useEditorModal } from '@/components/editor/editor-hooks/use-modal';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

import { ComponentPickerOption } from './picker/component-picker-option';

export function ComponentPickerMenuPlugin({
    baseOptions = [],
    dynamicOptionsFn,
}: Readonly<{
    baseOptions?: Array<ComponentPickerOption>;
    dynamicOptionsFn?: ({ queryString }: { queryString: string }) => Array<ComponentPickerOption>;
}>): JSX.Element {
    const [editor] = useLexicalComposerContext();
    const [modal, showModal] = useEditorModal();
    const [queryString, setQueryString] = useState<string | null>(null);

    const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
        minLength: 0,
    });

    const options = useMemo(() => {
        if (!queryString) {
            return baseOptions;
        }

        const regex = new RegExp(queryString, 'i');

        return [
            ...(dynamicOptionsFn?.({ queryString }) || []),
            ...baseOptions.filter(
                (option) => regex.test(option.title) || option.keywords.some((keyword) => regex.test(keyword)),
            ),
        ];
    }, [queryString, baseOptions, dynamicOptionsFn]);

    const onSelectOption = useCallback(
        (
            selectedOption: ComponentPickerOption,
            nodeToRemove: TextNode | null,
            closeMenu: () => void,
            matchingString: string,
        ) => {
            editor.update(() => {
                nodeToRemove?.remove();
                selectedOption.onSelect(matchingString, editor, showModal);
                closeMenu();
            });
        },
        [editor, showModal],
    );

    return (
        <>
            {modal}
            <LexicalTypeaheadMenuPlugin
                onQueryChange={setQueryString}
                onSelectOption={onSelectOption}
                triggerFn={checkForTriggerMatch}
                options={options}
                menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
                    return anchorElementRef.current && options.length
                        ? createPortal(
                              <div className="fixed z-10 w-[250px] rounded-md shadow-md">
                                  <Command
                                      onKeyDown={(e) => {
                                          if (e.key === 'ArrowUp') {
                                              e.preventDefault();
                                              setHighlightedIndex(
                                                  selectedIndex === null
                                                      ? options.length - 1
                                                      : (selectedIndex - 1 + options.length) % options.length,
                                              );
                                          } else if (e.key === 'ArrowDown') {
                                              e.preventDefault();
                                              setHighlightedIndex(
                                                  selectedIndex === null ? 0 : (selectedIndex + 1) % options.length,
                                              );
                                          }
                                      }}
                                  >
                                      <CommandList>
                                          <CommandGroup>
                                              {options.map((option, index) => (
                                                  <CommandItem
                                                      key={option.key}
                                                      value={option.title}
                                                      onSelect={() => {
                                                          selectOptionAndCleanUp(option);
                                                      }}
                                                      className={`flex items-center gap-2 ${
                                                          selectedIndex === index ? 'bg-accent' : '!bg-transparent'
                                                      }`}
                                                  >
                                                      {option.icon}
                                                      {option.title}
                                                  </CommandItem>
                                              ))}
                                          </CommandGroup>
                                      </CommandList>
                                  </Command>
                              </div>,
                              anchorElementRef.current,
                          )
                        : null;
                }}
            />
        </>
    );
}
