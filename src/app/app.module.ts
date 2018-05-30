import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NewComponent } from './components/new/new.component';
import { ServeComponent } from './components/serve/serve.component';
import { GenerateComponent } from './components/generate/generate.component';

@NgModule({
  declarations: [
    AppComponent,
    ServeComponent,
    NewComponent,
    GenerateComponent
  ],
  imports: [
    FormsModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
