import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LimbleTreeBranchComponent } from "./limble-tree-branch.component";

describe("LimbleTreeComponent", () => {
   let component: LimbleTreeBranchComponent;
   let fixture: ComponentFixture<LimbleTreeBranchComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [LimbleTreeBranchComponent]
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(LimbleTreeBranchComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it("should create", () => {
      expect(component).toBeTruthy();
   });
});
