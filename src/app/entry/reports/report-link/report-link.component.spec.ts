import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLinkComponent } from './report-link.component';

describe('ReportLinkComponent', () => {
  let component: ReportLinkComponent;
  let fixture: ComponentFixture<ReportLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
