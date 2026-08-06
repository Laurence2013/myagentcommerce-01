import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommerceAgentsService } from '../../services/commerce-agents.service';


@Component({
  selector: 'app-commerce-agents',
  templateUrl: './commerce-agents.component.html',
  styleUrl: './commerce-agents.component.sass',
  host: {
    'class': 'commerce-agents-host'
  }
})
export class CommerceAgentsComponent {}
