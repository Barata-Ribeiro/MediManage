import { validateUrl }                     from '@/components/editor/utils/url';
import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import * as React                          from 'react';
import { JSX }                             from 'react';

export function LinkPlugin(): JSX.Element {
    return <LexicalLinkPlugin validateUrl={validateUrl} />;
}
