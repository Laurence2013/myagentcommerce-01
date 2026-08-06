import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommerceAgentsService } from '../../services/commerce-agents.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-protocol-capability',
  templateUrl: './protocol-capability.component.html',
  styleUrl: './protocol-capability.component.sass',
  host: {
    'class': 'protocol-capability-host'
  }
})
export class ProtocolCapabilityComponent {}
