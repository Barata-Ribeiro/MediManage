import PublicController from '@/actions/App/Http/Controllers/General/PublicController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { articles as articlesRoute } from '@/routes';
import { Form, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

export default function ArticleFilterForm() {
    const [startingValue, setStartingValue] = useState<Date | undefined>(undefined);
    const [endValue, setEndValue] = useState<Date | undefined>(undefined);

    const currentQuery = new URLSearchParams(globalThis.location.search);
    const searchQuery = currentQuery.get('search') ?? '';
    const startingDateQuery = currentQuery.get('start_date_creation') ?? '';
    const endDateQuery = currentQuery.get('end_date_creation') ?? '';

    const parseValidDate = (s: string) => {
        const d = new Date(s);
        return Number.isNaN(d.getTime()) ? undefined : d;
    };

    if (startingDateQuery && !startingValue) {
        const parsed = parseValidDate(startingDateQuery);
        if (parsed) setStartingValue(parsed);
    }

    if (endDateQuery && !endValue) {
        const parsed = parseValidDate(endDateQuery);
        if (parsed) setEndValue(parsed);
    }

    return (
        <Form
            {...PublicController.articles.form()}
            transform={(data) => ({
                ...data,
                start_date_creation: startingValue ? format(startingValue, 'yyyy/MM/dd') : undefined,
                end_date_creation: endValue ? format(endValue, 'yyyy/MM/dd') : undefined,
            })}
            options={{ preserveScroll: true }}
            className="grid max-w-md inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
        >
            {({ errors }) => (
                <>
                    <Field>
                        <FieldLabel htmlFor="search">Search Articles</FieldLabel>
                        <Input
                            id="search"
                            type="search"
                            name="search"
                            placeholder="Search articles..."
                            aria-invalid={Boolean(errors.search)}
                            aria-errormessage={errors.search ? 'error-search' : undefined}
                            defaultValue={searchQuery}
                        />

                        <InputError id="error-search" message={errors.search} className="mt-2" />
                    </Field>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="start_date_creation">Starting Date</FieldLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'pl-3 text-left font-normal',
                                            !startingValue && 'text-muted-foreground',
                                        )}
                                    >
                                        {startingValue ? (
                                            format(startingValue, 'PPP')
                                        ) : (
                                            <span>Choose starting date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startingValue}
                                        onSelect={setStartingValue}
                                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                        captionLayout="dropdown"
                                    />
                                </PopoverContent>
                            </Popover>
                            <InputError
                                id="error-start_date_creation"
                                message={errors.start_date_creation}
                                className="mt-2"
                            />
                        </Field>

                        <Field className="grid gap-2">
                            <FieldLabel htmlFor="end_date_creation">End Date</FieldLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'pl-3 text-left font-normal',
                                            !endValue && 'text-muted-foreground',
                                        )}
                                    >
                                        {endValue ? format(endValue, 'PPP') : <span>Choose end date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endValue}
                                        onSelect={setEndValue}
                                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                        captionLayout="dropdown"
                                    />
                                </PopoverContent>
                            </Popover>
                            <InputError
                                id="error-end_date_creation"
                                message={errors.end_date_creation}
                                className="mt-2"
                            />
                        </Field>

                        <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
                            <Button type="submit">Filter Articles</Button>
                            <Button variant="ghost" asChild>
                                <Link href={articlesRoute()} prefetch>
                                    Reset Filters
                                </Link>
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Form>
    );
}
