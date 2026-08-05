import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { AgentSubmission } from '../interface/agent-submission.interface';

@Injectable({
  providedIn: 'root'
})
export class AgentFormService {
  private readonly http = inject(HttpClient, { optional: true });

  // Firestore Collection Name
  readonly collectionName = 'commerce-agents';
  private readonly firestoreRestUrl = `http://localhost:8080/v1/projects/myagentcommerce-01/databases/(default)/documents/${this.collectionName}`;

  // RxJS Subjects for Submission State Streams
  private readonly submittingSubject = new BehaviorSubject<boolean>(false);
  private readonly successSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  // Public RxJS Observables
  readonly isSubmitting$: Observable<boolean> = this.submittingSubject.asObservable();
  readonly submissionSuccess$: Observable<boolean> = this.successSubject.asObservable();
  readonly submissionError$: Observable<string | null> = this.errorSubject.asObservable();

  /**
   * Submits an AgentSubmission payload to Firestore 'commerce-agents' collection using RxJS streams.
   */
  submitAgent(submission: AgentSubmission): Observable<AgentSubmission> {
    this.submittingSubject.next(true);
    this.errorSubject.next(null);
    this.successSubject.next(false);

    const fullPayload: AgentSubmission = {
      ...submission,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Formats plain JS object into Firestore REST typed fields structure
    const restPayload = this.formatFirestoreFields(fullPayload as unknown as Record<string, unknown>);

    if (this.http) {
      return this.http.post(this.firestoreRestUrl, restPayload).pipe(
        map(() => fullPayload),
        tap(() => {
          this.submittingSubject.next(false);
          this.successSubject.next(true);
          setTimeout(() => this.successSubject.next(false), 5000);
        }),
        catchError((err) => {
          console.warn(`Firestore Emulator REST endpoint (${this.firestoreRestUrl}) fallback to mock stream:`, err);
          return this.simulateMockStream(fullPayload);
        })
      );
    }

    return this.simulateMockStream(fullPayload);
  }

  private simulateMockStream(payload: AgentSubmission): Observable<AgentSubmission> {
    return of(payload).pipe(
      delay(800),
      tap(() => {
        this.submittingSubject.next(false);
        this.successSubject.next(true);
        setTimeout(() => this.successSubject.next(false), 5000);
      })
    );
  }

  private formatFirestoreFields(data: Record<string, unknown>): { fields: Record<string, unknown> } {
    const fields: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        fields[key] = { stringValue: value };
      } else if (typeof value === 'number') {
        fields[key] = { doubleValue: value };
      } else if (typeof value === 'boolean') {
        fields[key] = { booleanValue: value };
      } else if (Array.isArray(value)) {
        fields[key] = {
          arrayValue: {
            values: value.map(item => (typeof item === 'string' ? { stringValue: item } : { stringValue: String(item) }))
          }
        };
      } else if (value && typeof value === 'object') {
        fields[key] = { mapValue: { fields: this.formatFirestoreFields(value as Record<string, unknown>).fields } };
      }
    }

    return { fields };
  }

  resetState(): void {
    this.submittingSubject.next(false);
    this.successSubject.next(false);
    this.errorSubject.next(null);
  }
}
