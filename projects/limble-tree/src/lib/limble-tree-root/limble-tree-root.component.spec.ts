import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimbleTreeRootComponent } from './limble-tree-root.component';

describe('LimbleTreeRootComponent', () => {
  let component: LimbleTreeRootComponent;
  let fixture: ComponentFixture<LimbleTreeRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimbleTreeRootComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimbleTreeRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
