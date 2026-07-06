import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { UsabilityTrackerService } from '../../../core/services/usability-tracker.service';

@Component({
  selector: 'app-test-hud',
  standalone: true,
  templateUrl: './test-hud.component.html',
  styleUrl: './test-hud.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestHudComponent {
  readonly tracker = inject(UsabilityTrackerService);

  readonly progreso = computed(() => {
    const task = this.tracker.activeTask();
    if (!task) return '';
    return `${this.tracker.hitosAlcanzados().size}/${task.hitos.length}`;
  });

  fmt(ms: number): string {
    const s = Math.round(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  }
}
