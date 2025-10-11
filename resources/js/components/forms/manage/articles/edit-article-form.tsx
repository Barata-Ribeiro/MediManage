import articleController from '@/actions/App/Http/Controllers/Article/ArticleController';
import { Editor } from '@/components/blocks/editor-x/editor';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom';
import {
    Tags,
    TagsContent,
    TagsEmpty,
    TagsGroup,
    TagsInput,
    TagsItem,
    TagsList,
    TagsTrigger,
    TagsValue,
} from '@/components/ui/shadcn-io/tags';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { htmlToLexical } from '@/lib/html-to-lexical';
import { lexicalToHtml } from '@/lib/lexical-to-html';
import { cn } from '@/lib/utils';
import { Article, Category } from '@/types/application/article';
import { Form } from '@inertiajs/react';
import { SerializedEditorState } from 'lexical';
import { CheckIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

interface EditArticleFormProps {
    article: Article;
    categories: Pick<Category, 'name'>[];
}

export default function EditArticleForm({ article, categories }: Readonly<EditArticleFormProps>) {
    const initialEditorState: SerializedEditorState = article.content_json
        ? (JSON.parse(article.content_json) as SerializedEditorState)
        : htmlToLexical(article.content_html);

    const [editorState, setEditorState] = useState<SerializedEditorState>(initialEditorState);

    const [isPublished, setIsPublished] = useState(article.is_published);
    const [tags, setTags] = useState(categories);
    const [selected, setSelected] = useState<string[]>(article.categories?.map((cat) => cat.name) ?? []);
    const [newTag, setNewTag] = useState<string>('');

    function handleRemove(value: string) {
        if (!selected.includes(value)) return;
        setSelected((prev) => prev.filter((v) => v !== value));
    }

    function handleSelect(value: string) {
        if (selected.includes(value)) {
            handleRemove(value);
            return;
        }
        setSelected((prev) => [...prev, value]);
    }

    function handleCreateTag() {
        setTags((prev) => [...prev, { name: newTag }]);
        setSelected((prev) => [...prev, newTag]);
        setNewTag('');
    }

    return (
        <Form
            {...articleController.update.form(article.id)}
            options={{ preserveScroll: true }}
            className="space-y-6 inert:pointer-events-none inert:opacity-50"
            transform={(data) => ({
                ...data,
                content_json: JSON.stringify(editorState),
                content_html: lexicalToHtml(editorState),
                is_published: isPublished,
                categories: selected,
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
                                defaultValue={article.title}
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
                                defaultValue={article.subtitle}
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
                            defaultValue={article.excerpt}
                            rows={5}
                            maxLength={500}
                            required
                            aria-required
                            aria-invalid={Boolean(errors.excerpt)}
                        />
                        <InputError message={errors.excerpt} className="mt-2" />
                    </div>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="thumbnail">Thumbnail URL</Label>
                            <Input
                                type="url"
                                id="thumbnail"
                                name="thumbnail"
                                className="mt-1 block w-full"
                                placeholder="e.g. https://example.com/thumbnail.jpg"
                                defaultValue={article.thumbnail}
                                required
                                aria-required
                                aria-invalid={Boolean(errors.thumbnail)}
                            />
                            <InputError message={errors.thumbnail} className="mt-2" />
                        </div>

                        <div className="flex justify-center">
                            <ImageZoom
                                zoomMargin={100}
                                backdropClassName={cn('relative [&_[data-rmiz-modal-overlay="visible"]]:bg-black/80')}
                            >
                                <img
                                    src={article.thumbnail}
                                    alt="Preview of the article thumbnail"
                                    className="h-auto max-w-full shadow-md"
                                    height={400}
                                    width={600}
                                />
                                <Badge
                                    variant="outline"
                                    className="absolute top-2 left-2 bg-input select-none"
                                    aria-hidden
                                >
                                    Preview
                                </Badge>
                            </ImageZoom>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Editor
                            editorSerializedState={editorState}
                            onSerializedChange={(value) => setEditorState(value)}
                        />

                        <InputError message={errors.content_html ?? errors.content_json} className="mt-2" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="categories">Categories</Label>
                            <Tags>
                                <TagsTrigger>
                                    {selected.map((tag) => (
                                        <TagsValue key={tag} onRemove={() => handleRemove(tag)}>
                                            {tags.find((t) => t.name === tag)?.name ?? tag}
                                        </TagsValue>
                                    ))}
                                </TagsTrigger>

                                <TagsContent>
                                    <TagsInput id="categories" onValueChange={setNewTag} placeholder="Search tag..." />
                                    <TagsList>
                                        <TagsEmpty>
                                            <button
                                                className="mx-auto flex cursor-pointer items-center gap-2"
                                                onClick={handleCreateTag}
                                                type="button"
                                            >
                                                <PlusIcon className="text-muted-foreground" size={14} />
                                                Create new tag: {newTag}
                                            </button>
                                        </TagsEmpty>
                                        <TagsGroup>
                                            {tags.map((tag) => (
                                                <TagsItem key={tag.name} onSelect={handleSelect} value={tag.name}>
                                                    {tag.name}
                                                    {selected.includes(tag.name) && (
                                                        <CheckIcon
                                                            aria-hidden
                                                            className="text-muted-foreground"
                                                            size={14}
                                                        />
                                                    )}
                                                </TagsItem>
                                            ))}
                                        </TagsGroup>
                                    </TagsList>
                                </TagsContent>
                            </Tags>
                            <InputError message={errors.categories} className="mt-2" />
                        </div>

                        <div className="flex flex-row items-center justify-between rounded-lg border bg-background p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label htmlFor="is_published">{isPublished ? 'Published' : 'Not Published'}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {isPublished
                                        ? 'The article is currently visible to the public.'
                                        : 'The article is currently hidden from the public.'}
                                </p>
                            </div>
                            <Switch
                                id="is_published"
                                name="is_published"
                                checked={isPublished}
                                onCheckedChange={setIsPublished}
                            />
                        </div>
                    </div>

                    <Button type="submit">Update</Button>
                </>
            )}
        </Form>
    );
}
