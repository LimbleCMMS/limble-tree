import { ComponentFixture, TestBed } from "@angular/core/testing";

import { LimbleTreePlaceholderComponent } from "./limble-tree-placeholder.component";

describe("LimbleTreePlaceholderComponent", () => {
   let component: LimbleTreePlaceholderComponent;
   let fixture: ComponentFixture<LimbleTreePlaceholderComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         declarations: [LimbleTreePlaceholderComponent]
      }).compileComponents();
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(LimbleTreePlaceholderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it("should create", () => {
      expect(component).toBeTruthy();
   });
});
