import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FirestoreListResponse } from '../../interfaces/services/firestore-response.interface';
import { environment } from '../../../environments/environment';

import {
  FraudDetectionItem,
  InventoryAndShippingItem,
  PromotionItem,
  ProtocolItem,
  ReturnItem,
  SecurityItem
} from '../../interfaces/agent-commerce-pillars';

export type PillarCollectionName =
  | 'fraud-n-identity'
  | 'inventory-n-shipping'
  | 'promotions'
  | 'protocols'
  | 'returns'
  | 'securities';

@Injectable({
  providedIn: 'root'
})
export class AgentPillarsService {
  private readonly http = inject(HttpClient, { optional: true });

	public getFraudAndIdentity<T = FraudDetectionItem>(): Observable<T[]> {
    return this.getPillarCollection<T>('fraud-n-identity');
  }
  public getInventoryAndShipping<T = InventoryAndShippingItem>(): Observable<T[]> {
    return this.getPillarCollection<T>('inventory-n-shipping');
  }
  public getPromotions<T = PromotionItem>(): Observable<T[]> {
    return this.getPillarCollection<T>('promotions');
  }
  public getProtocols<T = ProtocolItem>(): Observable<T[]> {
    return this.getPillarCollection<T>('protocols');
  }
  public getReturns<T = ReturnItem>(): Observable<T[]> {
    return this.getPillarCollection<T>('returns');
  }
  public getSecurities<T = SecurityItem>(): Observable<T[]> {
    return this.getPillarCollection<T>('securities');
  }
  public addProtocol(protocol: Record<string, unknown>): Observable<ProtocolItem> {
    return this.addPillarItem<ProtocolItem>('protocols', protocol);
  }
  public addPillarItem<T = Record<string, unknown>>(
    collectionName: PillarCollectionName | string,
    item: Record<string, unknown>
  ): Observable<T> {
    if (!this.http) {
      console.warn('AgentPillarsService: HttpClient is not provided.');
      return throwError(() => new Error('HttpClient is not provided'));
    }

    const url = this.getFirestoreRestUrl(collectionName);
    const body = this.formatFirestoreFields(item);

    return this.http.post<Record<string, unknown>>(url, body).pipe(
      map((response) => {
        const fields = (response['fields'] as Record<string, unknown>) || {};
        return this.parseFirestoreFields(fields) as T;
      }),
      catchError((error) => {
        console.warn(
          `AgentPillarsService: Error adding document to '${collectionName}' in Firestore emulator REST endpoint (${url}):`,
          error
        );
        return throwError(() => error);
      })
    );
  }
  private getFirestoreRestUrl(collectionName: string): string {
    const host = environment.useEmulators
      ? `http://${environment.emulators.firestore.host}:${environment.emulators.firestore.port}`
      : 'https://firestore.googleapis.com';

    const projectId = environment.firebase.projectId || 'myagentcommerce-01';

    return `${host}/v1/projects/${projectId}/databases/(default)/documents/${collectionName}`;
  }
	public getPillarCollection<T = Record<string, unknown>>(
    collectionName: PillarCollectionName | string
  ): Observable<T[]> {
    if (!this.http) {
      console.warn('AgentPillarsService: HttpClient is not provided.');
      return of([]);
    }

    const url = this.getFirestoreRestUrl(collectionName);

    return this.http.get<FirestoreListResponse>(url).pipe(
      map((response) => {
        const docs = response.documents || [];
        return docs.map((doc) => this.parseFirestoreFields(doc.fields || {}) as T);
      }),
      catchError((error) => {
        console.warn(`AgentPillarsService: Error fetching '${collectionName}' collection from Firestore emulator REST endpoint (${url}):`, error);
        return of([]);
      })
    );
  }
  private formatFirestoreFields(data: Record<string, unknown>): { fields: Record<string, unknown> } {
    const fields: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) continue;

      if (typeof value === 'string') {
        fields[key] = { stringValue: value };
      } else if (typeof value === 'number') {
        fields[key] = Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
      } else if (typeof value === 'boolean') {
        fields[key] = { booleanValue: value };
      } else if (Array.isArray(value)) {
        fields[key] = {
          arrayValue: {
            values: value.map((item) =>
              typeof item === 'string' ? { stringValue: item } : { stringValue: String(item) }
            )
          }
        };
      } else if (typeof value === 'object') {
        fields[key] = {
          mapValue: {
            fields: this.formatFirestoreFields(value as Record<string, unknown>).fields
          }
        };
      }
    }

    return { fields };
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
export { AgentPillarsService as AgentPillars };
