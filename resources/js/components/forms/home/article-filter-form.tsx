import PublicController from '@/actions/App/Http/Controllers/General/PublicController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { articles as articlesRoute } from '@/routes';
import { Form, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

export default function ArticleFilterForm() {
    const [startingValue, onChangeStarting] = useState<Date | undefined>(undefined);
    const [endValue, onChangeEnd] = useState<Date | undefined>(undefined);

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
        if (parsed) onChangeStarting(parsed);
    }

    if (endDateQuery && !endValue) {
        const parsed = parseValidDate(endDateQuery);
        if (parsed) onChangeEnd(parsed);
    }

    return (
        <Form
            {...PublicController.articles.form()}
            disableWhileProcessing
            options={{ preserveScroll: true }}
            className="grid max-w-md inert:pointer-events-none inert:opacity-50 inert:grayscale-100"
        >
            {({ errors }) => (
                <>
                    {/*TODO: Add category filter*/}
                    <div className="grid gap-2">
                        <Label htmlFor="search">Search Articles</Label>
                        <Input
                            type="search"
                            id="search"
                            name="search"
                            placeholder="Search articles..."
                            aria-invalid={Boolean(errors.search)}
                            aria-errormessage={errors.search ? 'error-search' : undefined}
                            defaultValue={searchQuery}
                        />

                        <InputError id="error-search" message={errors.search} className="mt-2" />
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="start_date_creation">Starting Date</Label>
                            <input
                                id="start_date_creation"
                                type="hidden"
                                name="start_date_creation"
                                defaultValue={startingValue ? format(startingValue, 'yyyy-MM-dd') : undefined}
                                aria-invalid={Boolean(errors.start_date_creation)}
                                aria-errormessage={errors.start_date_creation ? 'error-start_date_creation' : undefined}
                                readOnly
                            />
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
                                        onSelect={onChangeStarting}
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
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="end_date_creation">End Date</Label>
                            <input
                                id="end_date_creation"
                                type="hidden"
                                name="end_date_creation"
                                defaultValue={endValue ? format(endValue, 'yyyy-MM-dd') : undefined}
                                aria-invalid={Boolean(errors.end_date_creation)}
                                aria-errormessage={errors.end_date_creation ? 'error-end_date_creation' : undefined}
                                readOnly
                            />
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
                                        onSelect={onChangeEnd}
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
                        </div>

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
