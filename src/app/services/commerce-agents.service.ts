import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FirestoreListResponse } from '../interfaces/services/firestore-response.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommerceAgentsService {
  private readonly http = inject(HttpClient, { optional: true });

  public readonly collectionName = 'commerce-agents';

  private get firestoreRestUrl(): string {
    const host = environment.useEmulators
      ? `http://${environment.emulators.firestore.host}:${environment.emulators.firestore.port}`
      : 'https://firestore.googleapis.com';

    const projectId = environment.firebase.projectId || 'myagentcommerce-01';

    return `${host}/v1/projects/${projectId}/databases/(default)/documents/${this.collectionName}`;
  }

  private readonly selectedCriteriaSubject = new BehaviorSubject<string>('ProtocolCapability');
  public readonly selectedCriteria$: Observable<string> = this.selectedCriteriaSubject.asObservable();

  public selectCriteria(criteria: string): void { this.selectedCriteriaSubject.next(criteria); }

  public get_a_document(criteria: string): Observable<Record<string, unknown>[]> {
    if (!this.http) {
      console.warn('CommerceAgentsService: HttpClient is not provided.');
      return of([]);
    }
    const url = this.firestoreRestUrl;

    return this.http.get<FirestoreListResponse>(url).pipe(
      map((response) => {
        const docs = response.documents || [];
        const parsedDocs = docs.map((doc) => this.parseFirestoreFields(doc.fields || {}));

        return this.filterDocsByCriteria(parsedDocs, criteria);
      }),
      catchError((error) => {
        console.warn(`CommerceAgentsService: Error fetching from Firestore REST endpoint (${url}):`, error);
        return of([]);
      })
    );
  }
  public getCommerceAgents(): Observable<Record<string, unknown>[]> {
    if (!this.http) {
      console.warn('CommerceAgentsService: HttpClient is not provided.');
      return of([]);
    }
    const url = this.firestoreRestUrl;

    return this.http.get<FirestoreListResponse>(url).pipe(
      map((response) => {
        const docs = response.documents || [];
        return docs.map((doc) => this.parseFirestoreFields(doc.fields || {}));
      }),
      catchError((error) => {
        console.warn(`CommerceAgentsService: Error fetching from Firestore REST endpoint (${url}):`, error);
        return of([]);
      })
    );
  }
  private filterDocsByCriteria(docs: Record<string, unknown>[], criteria: string): Record<string, unknown>[] {
    if (!criteria || criteria === 'all') return docs;

    return docs.filter((doc) => {
      switch (criteria) {
        case 'ProtocolCapability':
          return !!(doc['parentEcosystem'] || (doc['specifications'] as Record<string, unknown>)?.[
            'crossProtocolCompat'
          ]);
        case 'SecurityGovernance':
          return !!(doc['verificationStatus'] || (doc['specifications'] as Record<string, unknown>)?.[
            'authenticationType'
          ]);
        case 'TaxonomyClassification':
          return !!(doc['marketSide'] || doc['functionalClass'] || doc['category']);
        case 'MerchantSpecs':
          return !!((doc['targetEnvironment'] as Record<string, unknown>)?.[
            'platform'
          ] || doc['pricingModel']);
        default:
          return true;
      }
    });
  }
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
