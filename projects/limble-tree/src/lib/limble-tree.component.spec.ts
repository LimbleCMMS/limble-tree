import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LimbleTreeComponent } from "./limble-tree.component";

describe("LimbleTreeComponent", () => {
   let component: LimbleTreeComponent;
   let fixture: ComponentFixture<LimbleTreeComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [LimbleTreeComponent]
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(LimbleTreeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it("should create", () => {
      expect(component).toBeTruthy();
   });
});
