import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { formatWeekdayName } from 'react-day-picker';

interface AppointmentCalendarPickerProps {
    occupiedSlots: Date[];
    setFinalDate: Dispatch<SetStateAction<string | undefined>>;
}

function extractHHMM(timePart: string | undefined): string {
    return (timePart ?? '').slice(0, 5);
}

export default function AppointmentCalendarPicker({
    occupiedSlots,
    setFinalDate,
}: Readonly<AppointmentCalendarPickerProps>) {
    const today = new Date();
    const [date, setDate] = useState<Date | undefined>(today);
    const [selectedTime, setSelectedTime] = useState<string | undefined>('08:00');

    const timeSlots = Array.from({ length: 10 }, (_, i) => {
        const hour = 8 + i;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    const dateMap = occupiedSlots.reduce<Map<string, Set<string>>>((map, slot) => {
        const raw = slot instanceof Date ? format(slot, 'yyyy-MM-dd HH:mm') : String(slot);
        const [datePart, timePart] = raw.split(' ');
        if (!datePart) return map;
        const hhmm = extractHHMM(timePart);
        if (!hhmm) return map;
        const times = map.get(datePart) ?? new Set<string>();
        times.add(hhmm);
        map.set(datePart, times);
        return map;
    }, new Map());

    const disabledDateStrings = new Set(
        Array.from(dateMap.entries())
            .filter(([, times]) => timeSlots.every((t) => times.has(t)))
            .map(([dateStr]) => dateStr),
    );

    const disabledDays = (d: Date) => {
        today.setHours(0, 0, 0, 0);
        const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        if (dateOnly.getTime() < today.getTime()) return true;
        const key = format(dateOnly, 'yyyy-MM-dd');
        return disabledDateStrings.has(key);
    };

    const disabledTimes = date ? (dateMap.get(format(date, 'yyyy-MM-dd')) ?? new Set<string>()) : new Set<string>();

    return (
        <Card className="w-fit gap-0 p-0">
            <CardContent className="relative p-0 md:pr-48">
                <div className="p-6">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selected) => {
                            setDate(selected);
                            setFinalDate(
                                format(String(selected), 'yyyy-MM-dd') + (selectedTime ? ` ${selectedTime}` : ''),
                            );
                        }}
                        defaultMonth={date}
                        disabled={disabledDays}
                        showOutsideDays={false}
                        modifiers={{
                            disabledDays: disabledDays,
                        }}
                        modifiersClassNames={{
                            disabledDays: '[&>button]:line-through opacity-100',
                        }}
                        className="bg-transparent p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
                        formatters={{
                            formatWeekdayName: (date) => formatWeekdayName(date),
                        }}
                    />
                </div>
                <div className="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l">
                    <div className="grid gap-2">
                        {timeSlots.map((time) => (
                            <Button
                                type="button"
                                key={time}
                                variant={selectedTime === time ? 'default' : 'outline'}
                                onClick={() => {
                                    setSelectedTime(time);
                                    if (date) setFinalDate(format(date, 'yyyy-MM-dd') + ` ${time}`);
                                }}
                                className="w-full shadow-none"
                                disabled={disabledTimes.has(time)}
                            >
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 border-t px-6 py-5! md:flex-row">
                <p className="max-w-md flex-1 text-sm">
                    {date && selectedTime ? (
                        <>
                            The appointment will be scheduled for{' '}
                            <span className="font-semibold">{format(date, 'PPPPP')}</span> at{' '}
                            <span className="font-semibold">{selectedTime}</span>.
                        </>
                    ) : (
                        'Select a date and time for the appointment.'
                    )}
                </p>

                <Button type="submit" disabled={!date || !selectedTime} className="w-full md:ml-auto md:w-auto">
                    Confirm Appointment
                </Button>
            </CardFooter>
        </Card>
    );
}
