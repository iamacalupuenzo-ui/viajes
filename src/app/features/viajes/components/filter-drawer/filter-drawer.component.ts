import { Component, ChangeDetectionStrategy, input, output, signal, computed, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPeriod, FilterConfig, FilterUnit } from '../../models/filter.model';
import { UNITS_MOCK } from '../../data/units.mock';
import { DateRangePickerComponent } from '../date-range-picker/date-range-picker.component';

@Component({
  selector: 'app-filter-drawer',
  standalone: true,
  imports: [FormsModule, DateRangePickerComponent],
  templateUrl: './filter-drawer.component.html',
  styleUrl: './filter-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDrawerComponent implements OnChanges {
  isOpen       = input<boolean>(false);
  showPeriod   = input<boolean>(true);
  initialPeriod = input<FilterPeriod>('todo');
  close = output<void>();
  apply = output<FilterConfig>();

  readonly periods: { key: FilterPeriod; label: string; icon?: boolean }[] = [
    { key: 'todo', label: 'Todo' },
    { key: 'semana', label: 'Semana' },
    { key: 'mes', label: 'Mes' },
    { key: 'personalizado', label: 'Personalizado', icon: true },
  ];

  readonly allUnits: FilterUnit[] = UNITS_MOCK;

  searchQuery = signal('');
  selectedPeriod = signal<FilterPeriod>('todo');
  selectedIds = signal<Set<string>>(new Set(UNITS_MOCK.map(u => u.id)));
  showDatePicker = signal(false);
  fromDate = signal<Date | null>(null);
  toDate = signal<Date | null>(null);

  filteredUnits = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return q
      ? this.allUnits.filter(u =>
          u.placa.toLowerCase().includes(q) ||
          u.modelo.toLowerCase().includes(q) ||
          u.codigoMotor.includes(q))
      : this.allUnits;
  });

  allSelected = computed(() => this.allUnits.every(u => this.selectedIds().has(u.id)));
  selectedCount = computed(() => this.selectedIds().size);
  canApply = computed(() => this.selectedIds().size > 0);

  isSelected(id: string): boolean { return this.selectedIds().has(id); }

  onSearchChange(value: string): void { this.searchQuery.set(value); }

  selectPeriod(period: FilterPeriod): void {
    this.selectedPeriod.set(period);
    if (period === 'personalizado') this.showDatePicker.set(true);
  }

  toggleAll(): void {
    this.selectedIds.set(
      this.allSelected() ? new Set() : new Set(this.allUnits.map(u => u.id))
    );
  }

  toggleUnit(id: string): void {
    const next = new Set(this.selectedIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.selectedIds.set(next);
  }

  onDateApply(range: { from: Date; to: Date }): void {
    this.fromDate.set(range.from);
    this.toDate.set(range.to);
    this.showDatePicker.set(false);
  }

  onApply(): void {
    this.apply.emit({
      period: this.selectedPeriod(),
      unitIds: Array.from(this.selectedIds()),
      fromDate: this.fromDate() ?? undefined,
      toDate: this.toDate() ?? undefined,
    });
    this.close.emit();
  }

  ngOnChanges(): void {
    if (this.isOpen()) {
      this.selectedIds.set(new Set(UNITS_MOCK.map(u => u.id)));
      this.searchQuery.set('');
      this.selectedPeriod.set(this.initialPeriod());
      this.showDatePicker.set(false);
    }
  }
}
