import articleController from '@/actions/App/Http/Controllers/Article/ArticleController';
import { Editor } from '@/components/blocks/editor-x/editor';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { lexicalToHtml } from '@/lib/lexical-to-html';
import { Form } from '@inertiajs/react';
import { SerializedEditorState } from 'lexical';
import { useState } from 'react';

export const initialValue = {
    root: {
        children: [
            {
                children: [],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
            },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
    },
} as unknown as SerializedEditorState;

export default function NewArticleForm() {
    const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue);

    return (
        <Form
            {...articleController.store.form()}
            options={{
                preserveScroll: true,
            }}
            className="space-y-6 inert:pointer-events-none inert:opacity-50"
            transform={(data) => ({
                ...data,
                content_json: JSON.stringify(editorState),
                content_html: lexicalToHtml(editorState),
            })}
            disableWhileProcessing
        >
            {({ errors }) => (
                <>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="e.g. How to build a website"
                                required
                                aria-required
                                aria-invalid={Boolean(errors.title)}
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="subtitle">Sub Title</Label>
                            <Input
                                id="subtitle"
                                name="subtitle"
                                type="text"
                                placeholder="e.g. A step-by-step guide"
                                required
                                aria-required
                                aria-invalid={Boolean(errors.subtitle)}
                            />
                            <InputError message={errors.subtitle} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            name="excerpt"
                            placeholder="Write a short summary of the article..."
                            rows={3}
                            required
                            aria-required
                            aria-invalid={Boolean(errors.excerpt)}
                        />
                        <InputError message={errors.excerpt} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="thumbnail">Thumbnail URL</Label>
                        <Input
                            type="url"
                            id="thumbnail"
                            name="thumbnail"
                            className="mt-1 block w-full"
                            placeholder="e.g. https://example.com/thumbnail.jpg"
                            required
                            aria-required
                            aria-invalid={Boolean(errors.thumbnail)}
                        />
                        <InputError message={errors.thumbnail} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Editor
                            editorSerializedState={editorState}
                            onSerializedChange={(value) => setEditorState(value)}
                        />

                        <InputError message={errors.content_html ?? errors.content_json} className="mt-2" />
                    </div>

                    <Button type="submit">Create</Button>
                </>
            )}
        </Form>
    );
}
