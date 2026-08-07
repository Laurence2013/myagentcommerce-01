import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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

  /**
   * Constructs the Firestore REST URL targeting either local emulator or production REST endpoint.
   */
  private getFirestoreRestUrl(collectionName: string): string {
    const host = environment.useEmulators
      ? `http://${environment.emulators.firestore.host}:${environment.emulators.firestore.port}`
      : 'https://firestore.googleapis.com';

    const projectId = environment.firebase.projectId || 'myagentcommerce-01';

    return `${host}/v1/projects/${projectId}/databases/(default)/documents/${collectionName}`;
  }

  /**
   * Generic RxJS HTTP stream handler to fetch any Firestore collection.
   */
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

  /**
   * Gets documents from 'fraud-n-identity' collection.
   */
  public getFraudAndIdentity<T = FraudDetectionItem>(): Observable<T[]> {
    return this.getPillarCollection<T>('fraud-n-identity');
  }

  /**
   * Gets documents from 'inventory-n-shipping' collection.
   */
  public getInventoryAndShipping<T = InventoryAndShippingItem>(): Observable<T[]> {
    return this.getPillarCollection<T>('inventory-n-shipping');
  }

  /**
   * Gets documents from 'promotions' collection.
   */
  public getPromotions<T = PromotionItem>(): Observable<T[]> {
    return this.getPillarCollection<T>('promotions');
  }

  /**
   * Gets documents from 'protocols' collection.
   */
  public getProtocols<T = ProtocolItem>(): Observable<T[]> {
    return this.getPillarCollection<T>('protocols');
  }

  /**
   * Gets documents from 'returns' collection.
   */
  public getReturns<T = ReturnItem>(): Observable<T[]> {
    return this.getPillarCollection<T>('returns');
  }

  /**
   * Gets documents from 'securities' collection.
   */
  public getSecurities<T = SecurityItem>(): Observable<T[]> {
    return this.getPillarCollection<T>('securities');
  }

  /**
   * Helper function to convert Firestore REST API typed values into JS primitive values/objects.
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

// Export alias for convenient import under AgentPillars
export { AgentPillarsService as AgentPillars };
