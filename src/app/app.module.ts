import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NewComponent } from './components/new/new.component';
import { ServeComponent } from './components/serve/serve.component';
import { GenerateComponent } from './components/generate/generate.component';
import { CommandService } from './command.service';


@NgModule({
  declarations: [
    AppComponent,
    ServeComponent,
    NewComponent,
    GenerateComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule
  ],
  providers: [CommandService],
  bootstrap: [AppComponent]
})
export class AppModule { }
