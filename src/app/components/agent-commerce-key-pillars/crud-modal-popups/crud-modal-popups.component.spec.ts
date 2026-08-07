import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudModalPopupsComponent } from './crud-modal-popups.component';

describe('CrudModalPopupsComponent', () => {
  let component: CrudModalPopupsComponent;
  let fixture: ComponentFixture<CrudModalPopupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudModalPopupsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CrudModalPopupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
