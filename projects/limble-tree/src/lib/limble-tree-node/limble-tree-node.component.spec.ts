import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LimbleTreeNodeComponent } from "./limble-tree-node.component";

describe("LimbleTreeNodeComponent", () => {
   let component: LimbleTreeNodeComponent;
   let fixture: ComponentFixture<LimbleTreeNodeComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [LimbleTreeNodeComponent]
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(LimbleTreeNodeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it("should create", () => {
      expect(component).toBeTruthy();
   });
});
