import { Component, VERSION } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { defaultLanguage, languages } from './speech.constants';

@Component({
  selector: 'my-app',
  templateUrl: './web-speech.component.html',
  styleUrls: [ './web-speech.component.css' ]
})
export class WebSpeechComponent  {
  name = 'Angular ' + VERSION.major;
  languages: string[] = languages;
  currentLanguage: string = defaultLanguage;
  totalTranscript?: string;

  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  errorMessage$?: Observable<string>;
  defaultError$ = new Subject<string | undefined>();

  constructor(
    private speechRecognizer: SpeechRecognizerService,
    private actionContext: ActionContext
  ) {}
}
