import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';

interface CalendarDay {
  day: number | null;
  date: Date | null;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
}

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangePickerComponent {
  isOpen = input<boolean>(false);
  close = output<void>();
  apply = output<{ from: Date; to: Date }>();

  fromDate = signal<Date | null>(null);
  toDate = signal<Date | null>(null);
  currentMonth = signal(new Date());

  readonly weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  monthLabel = computed(() => {
    const d = this.currentMonth();
    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  });

  weeks = computed(() => this.buildCalendar(this.currentMonth(), this.fromDate(), this.toDate()));

  fromLabel = computed(() => this.formatShort(this.fromDate()));
  toLabel = computed(() => this.formatShort(this.toDate()));
  canApply = computed(() => !!this.fromDate() && !!this.toDate());

  onDayClick(day: CalendarDay): void {
    if (!day.date) return;
    const from = this.fromDate();
    const to = this.toDate();
    if (!from || (from && to)) {
      this.fromDate.set(day.date);
      this.toDate.set(null);
    } else {
      if (day.date < from) {
        this.fromDate.set(day.date);
      } else {
        this.toDate.set(day.date);
      }
    }
  }

  prevMonth(): void {
    const d = this.currentMonth();
    this.currentMonth.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this.currentMonth();
    this.currentMonth.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  onApply(): void {
    const from = this.fromDate();
    const to = this.toDate();
    if (from && to) this.apply.emit({ from, to });
  }

  private buildCalendar(month: Date, from: Date | null, to: Date | null): CalendarDay[][] {
    const year = month.getFullYear();
    const m = month.getMonth();
    const today = new Date();
    let dow = new Date(year, m, 1).getDay();
    dow = dow === 0 ? 6 : dow - 1;

    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const cells: (number | null)[] = [
      ...Array(dow).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    const toWeeks: CalendarDay[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      toWeeks.push(cells.slice(i, i + 7).map(d => {
        const date = d ? new Date(year, m, d) : null;
        const isStart = !!date && !!from && this.sameDay(date, from);
        const isEnd = !!date && !!to && this.sameDay(date, to);
        const isInRange = !!date && !!from && !!to && date > from && date < to;
        const isToday = !!date && this.sameDay(date, today);
        return { day: d, date, isStart, isEnd, isInRange, isToday };
      }));
    }
    return toWeeks;
  }

  private sameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  private formatShort(date: Date | null): string {
    if (!date) return '—';
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }
}
