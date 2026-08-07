import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { AgentPillarsService } from './agent-pillars.service';

describe('AgentPillarsService', () => {
  let service: AgentPillarsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AgentPillarsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AgentPillarsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch fraud-n-identity collection and parse fields', async () => {
    const mockResponse = {
      documents: [
        {
          name: 'projects/myagentcommerce-01/databases/(default)/documents/fraud-n-identity/doc1',
          fields: {
            name: { stringValue: 'Fraud Shield' },
            riskLevel: { integerValue: 1 },
            active: { booleanValue: true }
          }
        }
      ]
    };

    const promise = firstValueFrom(service.getFraudAndIdentity());

    const req = httpMock.expectOne((r) => r.url.includes('/fraud-n-identity'));
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    const data = await promise;
    expect(data.length).toBe(1);
    expect(data[0]).toEqual({
      name: 'Fraud Shield',
      riskLevel: 1,
      active: true
    });
  });

  it('should fetch inventory-n-shipping collection', async () => {
    const promise = firstValueFrom(service.getInventoryAndShipping());

    const req = httpMock.expectOne((r) => r.url.includes('/inventory-n-shipping'));
    expect(req.request.method).toBe('GET');
    req.flush({ documents: [] });

    const data = await promise;
    expect(data).toEqual([]);
  });

  it('should fetch promotions collection', async () => {
    const promise = firstValueFrom(service.getPromotions());

    const req = httpMock.expectOne((r) => r.url.includes('/promotions'));
    expect(req.request.method).toBe('GET');
    req.flush({ documents: [] });

    const data = await promise;
    expect(data).toEqual([]);
  });

  it('should fetch protocols collection', async () => {
    const promise = firstValueFrom(service.getProtocols());

    const req = httpMock.expectOne((r) => r.url.includes('/protocols'));
    expect(req.request.method).toBe('GET');
    req.flush({ documents: [] });

    const data = await promise;
    expect(data).toEqual([]);
  });

  it('should fetch returns collection', async () => {
    const promise = firstValueFrom(service.getReturns());

    const req = httpMock.expectOne((r) => r.url.includes('/returns'));
    expect(req.request.method).toBe('GET');
    req.flush({ documents: [] });

    const data = await promise;
    expect(data).toEqual([]);
  });

  it('should fetch securities collection', async () => {
    const promise = firstValueFrom(service.getSecurities());

    const req = httpMock.expectOne((r) => r.url.includes('/securities'));
    expect(req.request.method).toBe('GET');
    req.flush({ documents: [] });

    const data = await promise;
    expect(data).toEqual([]);
  });
});
