import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommerceAgentsComponent } from '../commerce-agents/commerce-agents.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommerceAgentsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass',
  host: {
    'class': 'home-host'
  }
})
export class HomeComponent {}

