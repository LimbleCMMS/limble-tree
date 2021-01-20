import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeItemAltComponent } from './tree-item-alt.component';

describe('TreeItemAltComponent', () => {
  let component: TreeItemAltComponent;
  let fixture: ComponentFixture<TreeItemAltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeItemAltComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeItemAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
