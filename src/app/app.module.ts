import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { WebSpeechComponent } from './web-speech/web-speech.component';
import { NgxsModule } from '@ngxs/store';
import { UserState } from './web-speech/ngxs.state.user';

@NgModule({
  imports:      [ BrowserModule, FormsModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([ UserState]) ],
  declarations: [ AppComponent, HelloComponent,WebSpeechComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
