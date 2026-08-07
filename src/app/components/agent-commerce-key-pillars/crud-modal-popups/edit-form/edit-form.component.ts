import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { CrudModalMode } from '../../../../interfaces/crud-modals';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.sass',
  host: {
    'class': 'edit-form-host'
  }
})
export class EditFormComponent {}
