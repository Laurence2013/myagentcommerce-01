import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommerceAgentsComponent } from '../commerce-agents/commerce-agents.component';
import { ProtocolCapabilityComponent } from '../protocol-capability/protocol-capability.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommerceAgentsComponent, ProtocolCapabilityComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
  host: {
    'class': 'home-host'
  }
})
export class HomeComponent {}


