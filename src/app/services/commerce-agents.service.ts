import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface FirestoreDocument {
  name?: string;
  fields?: Record<string, unknown>;
  createTime?: string;
  updateTime?: string;
}

export interface FirestoreListResponse {
  documents?: FirestoreDocument[];
  nextPageToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommerceAgentsService {
  private readonly http = inject(HttpClient, { optional: true });

  readonly collectionName = 'commerce-agents';
  private readonly firestoreRestUrl = `http://localhost:8080/v1/projects/myagentcommerce-01/databases/(default)/documents/${this.collectionName}`;

  /**
   * Fetches all documents in 'commerce-agents' collection from Firestore emulator REST endpoint.
   */
  getCommerceAgents(): Observable<Record<string, unknown>[]> {
    if (!this.http) {
      console.warn('CommerceAgentsService: HttpClient is not provided.');
      return of([]);
    }

    return this.http.get<FirestoreListResponse>(this.firestoreRestUrl).pipe(
      map((response) => {
        const docs = response.documents || [];
        return docs.map((doc) => this.parseFirestoreFields(doc.fields || {}));
      }),
      catchError((error) => {
        console.warn(`CommerceAgentsService: Error fetching from Firestore emulator REST endpoint (${this.firestoreRestUrl}):`, error);
        return of([]);
      })
    );
  }

  /**
   * Helper to parse Firestore REST typed field objects into plain JavaScript values.
   */
  private parseFirestoreFields(fields: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, valueObj] of Object.entries(fields)) {
      if (!valueObj || typeof valueObj !== 'object') continue;
      const val = valueObj as Record<string, unknown>;

      if ('stringValue' in val) {
        result[key] = val['stringValue'];
      } else if ('doubleValue' in val) {
        result[key] = Number(val['doubleValue']);
      } else if ('integerValue' in val) {
        result[key] = Number(val['integerValue']);
      } else if ('booleanValue' in val) {
        result[key] = Boolean(val['booleanValue']);
      } else if ('mapValue' in val) {
        const mapFields = (val['mapValue'] as { fields?: Record<string, unknown> })?.fields || {};
        result[key] = this.parseFirestoreFields(mapFields);
      } else if ('arrayValue' in val) {
        const arrayValues = (val['arrayValue'] as { values?: Record<string, unknown>[] })?.values || [];
        result[key] = arrayValues.map((item) => {
          if ('stringValue' in item) return item['stringValue'];
          if ('doubleValue' in item) return Number(item['doubleValue']);
          if ('integerValue' in item) return Number(item['integerValue']);
          if ('booleanValue' in item) return Boolean(item['booleanValue']);
          return item;
        });
      }
    }

    return result;
  }
}
