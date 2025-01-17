import * as React from 'react';
import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DatePicker({ selected, onChange, placeholderText }: { selected: Date | null, onChange: (date: Date | null) => void, placeholderText: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
    <PopoverTrigger asChild>
        <button className="border rounded px-2 py-1 flex items-center space-x-2">
          <CalendarIcon />
          <span>{selected ? selected.toDateString() : placeholderText}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className='bg-white text-black'>
        <DayPicker
          selected={selected!}
          onDayClick={(day) => {
            onChange(day);
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}