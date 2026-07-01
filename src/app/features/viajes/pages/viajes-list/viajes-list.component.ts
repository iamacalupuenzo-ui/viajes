import { Component, ChangeDetectionStrategy, computed, signal, inject } from '@angular/core';
import { VIAJES_MOCK } from '../../data/viajes.mock';
import { Viaje, ViajeGroup } from '../../models/viaje.model';
import { ViajeCardComponent } from '../../components/viaje-card/viaje-card.component';
import { SelectionActionsComponent } from '../../components/selection-actions/selection-actions.component';
import { FilterStateService } from '../../../../core/services/filter-state.service';

@Component({
  selector: 'app-viajes-list',
  standalone: true,
  imports: [ViajeCardComponent, SelectionActionsComponent],
  templateUrl: './viajes-list.component.html',
  styleUrl: './viajes-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViajesListComponent {
  readonly filterState = inject(FilterStateService);
  readonly groups: ViajeGroup[] = this.buildGroups(VIAJES_MOCK);

  selectedIds = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedIds().size);
  hasSelection = computed(() => this.selectedIds().size > 0);

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  onToggle(id: string): void {
    const next = new Set(this.selectedIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.selectedIds.set(next);
  }

  onLimpiar(): void { this.selectedIds.set(new Set()); }

  onVerRecorrido(): void {
    console.log('Ver recorrido:', Array.from(this.selectedIds()));
  }

  private buildGroups(viajes: Viaje[]): ViajeGroup[] {
    const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const map = new Map<string, Viaje[]>();
    for (const v of viajes) {
      const d = v.fechaViaje;
      const label = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(v);
    }
    return Array.from(map.entries()).map(([label, viajes]) => ({ label, viajes }));
  }
}
