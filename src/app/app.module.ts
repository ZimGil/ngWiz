import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
//
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewComponent } from './home/components/new/new.component';
import { ServeComponent } from './home/components/serve/serve.component';
import { GenerateComponent } from './home/components/generate/generate.component';
import { CommandService } from './home/services/command/command.service';
import { PopupErrorComponent } from './home/components/popup-error/popup-error.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EmptyResponseBodyErrorInterceptor } from './interceptors/empty-response-body-error.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    ServeComponent,
    NewComponent,
    GenerateComponent,
    PopupErrorComponent,
    HomeComponent,
    PageNotFoundComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    CommandService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: EmptyResponseBodyErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
