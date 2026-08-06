import { Component, OnInit, inject, signal } from '@angular/core';
import { CommerceAgentsService } from '../../services/commerce-agents.service';

@Component({
  selector: 'app-commerce-agents',
  templateUrl: './commerce-agents.component.html',
  styleUrl: './commerce-agents.component.sass',
  host: {
    'class': 'commerce-agents-host'
  }
})
export class CommerceAgentsComponent implements OnInit {
  private readonly commerceAgentsService = inject(CommerceAgentsService);

  readonly agents = signal<Record<string, unknown>[]>([]);

  ngOnInit(): void {
    this.test00();
  }

  test00(): void {
    console.log('CommerceAgentsComponent.test00() executed - querying commerce-agents collection...');
    this.commerceAgentsService.getCommerceAgents().subscribe({
      next: (data) => {
        console.log('Commerce Agents Collection Result:', data);
        this.agents.set(data);
      },
      error: (err) => {
        console.error('Error fetching commerce-agents collection in test00():', err);
      }
    });
  }
}
