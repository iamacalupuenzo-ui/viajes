import { Component, ChangeDetectionStrategy, input, output, signal, computed, OnChanges } from '@angular/core';

interface CalendarDay {
  day: number | null;
  date: Date | null;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [],
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangePickerComponent implements OnChanges {
  isOpen       = input<boolean>(false);
  initialFrom  = input<Date | null>(null);
  initialTo    = input<Date | null>(null);
  submitLabel  = input<string>('Aplicar filtros');
  maxRangeDays = input<number>(0); // 0 = sin límite

  close = output<void>();
  apply = output<{ from: Date; to: Date }>();

  fromDate     = signal<Date | null>(null);
  toDate       = signal<Date | null>(null);
  currentMonth = signal(new Date());

  dragOffset = signal(0);
  private dragStartY = 0;
  private isDragging = false;

  readonly weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  ngOnChanges(): void {
    if (this.isOpen()) {
      const from = this.initialFrom();
      const to   = this.initialTo();
      this.fromDate.set(from);
      this.toDate.set(to);
      this.currentMonth.set(from ?? new Date());
    }
  }

  monthLabel = computed(() => {
    const d = this.currentMonth();
    const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  });

  weeks    = computed(() => this.buildCalendar(this.currentMonth(), this.fromDate(), this.toDate()));
  fromLabel = computed(() => this.formatShort(this.fromDate()));
  toLabel   = computed(() => this.formatShort(this.toDate()));
  canApply  = computed(() => !!this.fromDate() && !!this.toDate());

  readonly limitLabel = computed(() => {
    const max = this.maxRangeDays();
    return max > 0 ? `Máx. ${max} días` : null;
  });

  sheetStyle = computed(() => {
    const offset = this.dragOffset();
    if (offset <= 0) return '';
    return `transform: translateY(${offset}px); transition: none;`;
  });

  onDragStart(event: PointerEvent): void {
    this.isDragging = true;
    this.dragStartY = event.clientY;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  onDragMove(event: PointerEvent): void {
    if (!this.isDragging) return;
    const delta = event.clientY - this.dragStartY;
    this.dragOffset.set(Math.max(0, delta));
  }

  onDragEnd(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.dragOffset() > 120) {
      this.dragOffset.set(0);
      this.close.emit();
    } else {
      this.dragOffset.set(0);
    }
  }

  onDayClick(day: CalendarDay): void {
    if (!day.date || day.isDisabled) return;
    const from = this.fromDate();
    const to   = this.toDate();

    if (!from || (from && to)) {
      // Inicio nuevo rango
      this.fromDate.set(day.date);
      this.toDate.set(null);
    } else {
      if (day.date < from) {
        // Clicked before start → reset start
        this.fromDate.set(day.date);
        this.toDate.set(null);
      } else {
        // Clicked after start → set end, clamped to maxRangeDays
        const max = this.maxRangeDays();
        if (max > 0) {
          const maxTo = new Date(from);
          maxTo.setDate(from.getDate() + max - 1);
          this.toDate.set(day.date > maxTo ? maxTo : day.date);
        } else {
          this.toDate.set(day.date);
        }
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
    const to   = this.toDate();
    if (from && to) this.apply.emit({ from, to });
  }

  private buildCalendar(month: Date, from: Date | null, to: Date | null): CalendarDay[][] {
    const year = month.getFullYear();
    const m    = month.getMonth();
    const today = new Date();
    const max   = this.maxRangeDays();

    // Calcular fecha límite cuando solo está definido el inicio
    let limitDate: Date | null = null;
    if (from && !to && max > 0) {
      limitDate = new Date(from);
      limitDate.setDate(from.getDate() + max - 1);
    }

    let dow = new Date(year, m, 1).getDay();
    dow = dow === 0 ? 6 : dow - 1;

    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const cells: (number | null)[] = [
      ...Array(dow).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7).map(d => {
        const date = d ? new Date(year, m, d) : null;
        const isDisabled = !!date && !!limitDate && date > limitDate;
        return {
          day: d,
          date,
          isStart:   !!date && !!from && this.sameDay(date, from),
          isEnd:     !!date && !!to   && this.sameDay(date, to),
          isInRange: !!date && !!from && !!to && date > from && date < to,
          isToday:   !!date && this.sameDay(date, today),
          isDisabled,
        };
      }));
    }
    return weeks;
  }

  private sameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth()    === b.getMonth()    &&
           a.getDate()     === b.getDate();
  }

  private formatShort(date: Date | null): string {
    if (!date) return '—';
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }
}
