import { enableProdMode, importProvidersFrom } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app/app.component";
import { environment } from "./environments/environment";

if (environment.production) {
   enableProdMode();
}

bootstrapApplication(AppComponent, {
   providers: [importProvidersFrom([BrowserAnimationsModule])]
});
