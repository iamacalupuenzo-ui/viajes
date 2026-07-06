import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsabilityTrackerService } from '../../../../core/services/usability-tracker.service';
import {
  RESULT_LABELS,
  TaskResultClass,
  TaskRun,
  SessionRecord,
} from '../../models/usability.model';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil-page.component.html',
  styleUrl: './perfil-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfilPageComponent {
  readonly tracker = inject(UsabilityTrackerService);
  readonly resultLabels = RESULT_LABELS;
  readonly resultKeys = Object.keys(RESULT_LABELS) as TaskResultClass[];

  // Form de participante
  alias = signal('');
  perfil = signal('Operador nuevo');
  notas = signal('');

  expandedSession = signal<string | null>(null);

  readonly canStart = computed(() => this.alias().trim().length > 0);

  readonly completedTasks = computed<Map<string, TaskRun>>(() => {
    const s = this.tracker.session();
    return new Map((s?.runs ?? []).map(r => [r.taskId, r]));
  });

  startSession(): void {
    this.tracker.startSession({
      alias: this.alias().trim(),
      perfil: this.perfil(),
      notas: this.notas().trim(),
    });
  }

  endSession(): void {
    this.tracker.endSession();
    this.alias.set('');
    this.notas.set('');
  }

  toggleExpand(id: string): void {
    this.expandedSession.update(cur => (cur === id ? null : id));
  }

  runFor(session: SessionRecord, taskId: string): TaskRun | undefined {
    return session.runs.find(r => r.taskId === taskId);
  }

  classChip(cls: TaskResultClass | null): string {
    return cls ? `chip--${cls}` : '';
  }

  onOverride(sessionId: string, taskId: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value as TaskResultClass;
    this.tracker.overrideClassification(sessionId, taskId, value);
  }

  fmtDuration(ms: number | null): string {
    if (ms === null) return '—';
    const s = Math.round(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  }

  fmtDate(iso: string): string {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
}
