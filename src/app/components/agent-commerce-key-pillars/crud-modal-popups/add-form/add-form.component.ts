import { Component, computed, effect, input, output, signal, untracked } from '@angular/core';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrl: './add-form.component.sass',
  host: {
    'class': 'add-form-host'
  }
})
export class AddFormComponent {
  public readonly item = input<Record<string, unknown> | null>(null);
  public readonly mode = input<string>('');
  public readonly pillarName = input<string>('');
  public readonly formChange = output<Record<string, unknown>>();
  public readonly formName = signal<string>('');
  public readonly formValues = signal<string>('');
  public constructor() {
    effect(() => {
      const raw = this.item();
      untracked(() => {
        if (raw) {
          this.formName.set(String(raw['name'] || ''));
          const vals = raw['values'] || raw['layers'];
          if (Array.isArray(vals)) {
            this.formValues.set(vals.join(', '));
          } else {
            this.formValues.set(vals ? String(vals) : '');
          }
        } else {
          this.formName.set('');
          this.formValues.set('');
        }
      });
    });
  }
  public getItemIdUpper(): string {
    const val = (this.item() as Record<string, unknown> | null)?.['id'];
		console.log(val);
    return typeof val === 'string' ? val.toUpperCase() : '';
  }
  public onNameInput(event: Event): void {
    this.formName.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }
  public onValuesInput(event: Event): void {
    this.formValues.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }
  public getFormValue(): Record<string, unknown> {
    const splitArr = (val: string): string[] => val.split(',').map((s) => s.trim()).filter(Boolean);
    const fieldKey = this.formName().trim();
    const val: Record<string, unknown> = {};

    if (fieldKey) {
      val[fieldKey] = splitArr(this.formValues());
		}
    return val;
  }
  private emitChange(): void {
    this.formChange.emit(this.getFormValue());
  }
}
