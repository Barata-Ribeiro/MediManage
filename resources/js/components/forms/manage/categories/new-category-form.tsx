import categoryController from '@/actions/App/Http/Controllers/Article/CategoryController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form } from '@inertiajs/react';

export default function NewCategoryForm() {
    return (
        <Form
            {...categoryController.store.form()}
            options={{ preserveScroll: true }}
            className="space-y-6 inert:pointer-events-none inert:opacity-50"
            disableWhileProcessing
        >
            {({ errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="e.g. Technology"
                            aria-invalid={Boolean(errors.name)}
                            required
                            aria-required
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description (optional)</Label>

                        <Textarea
                            id="description"
                            className="mt-1 block w-full"
                            name="description"
                            placeholder="Brief description for the category..."
                            maxLength={255}
                            aria-invalid={Boolean(errors.description)}
                            onInput={(e) => {
                                const ta = e.currentTarget as HTMLTextAreaElement;
                                const counter = ta.parentElement?.querySelector(
                                    '[data-char-counter]',
                                ) as HTMLElement | null;
                                if (counter) counter.textContent = `${ta.value.length}/255`;
                            }}
                        />

                        <div className="flex justify-end text-sm text-muted-foreground">
                            <span data-char-counter>0/255</span>
                        </div>

                        <InputError className="mt-2" message={errors.description} />
                    </div>

                    <Button type="submit">Create</Button>
                </>
            )}
        </Form>
    );
}
