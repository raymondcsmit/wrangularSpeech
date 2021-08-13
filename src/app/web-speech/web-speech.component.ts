import { Component, VERSION } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { merge, Observable, of, Subject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ActionContext } from './action/action.context';
import { AddUser, SetSelectedUser, UpdateUser, WDict } from './ngxs.state.user';
import { SpeechRecognizerService } from './services/speech-recognizer.service';
import { defaultLanguage, languages } from './speech.constants';
import { SpeechError, SpeechEvent } from './speech.enum';
import { SpeechNotification } from './speech.model';
import { User, UserState } from './user.ngxs.state';


@Component({
  selector: 'speech-component',
  templateUrl: './web-speech.component.html',
  styleUrls: [ './web-speech.component.css' ]
})
export class WebSpeechComponent  {
  //#region speechCode
  name = 'Angular ' + VERSION.major;
  languages: string[] = languages;
  currentLanguage: string = defaultLanguage;
  totalTranscript?: string;

  transcript$?: Observable<string>;
  listening$?: Observable<boolean>;
  errorMessage$?: Observable<string>;
  defaultError$ = new Subject<string | undefined>();

  start(): void {
    if (this.speechRecognizer.isListening) {
      this.stop();
      return;
    }

    this.defaultError$.next(undefined);
    this.speechRecognizer.start();
  }

  stop(): void {
    this.speechRecognizer.stop();
  }

  selectLanguage(language: string): void {
    if (this.speechRecognizer.isListening) {
      this.stop();
    }
    this.currentLanguage = language;
    this.speechRecognizer.setLanguage(this.currentLanguage);
  }

  private initRecognition(): void {
    this.transcript$ = this.speechRecognizer.onResult().pipe(
      tap((notification) => {
        this.processNotification(notification);
      }),
      map((notification) => notification.content || '')
    );

    this.listening$ = merge(
      this.speechRecognizer.onStart(),
      this.speechRecognizer.onEnd()
    ).pipe(map((notification:SpeechNotification<string>) => notification.event === SpeechEvent.Start));

    this.errorMessage$ = merge(
      this.speechRecognizer.onError(),
      this.defaultError$
    ).pipe(
      map((data) => {
        if (data === undefined) {
          return '';
        }
        if (typeof data === 'string') {
          return data;
        }
        let message;
        switch (data.error) {
          case SpeechError.NotAllowed:
            message = `Cannot run the demo.
            Your browser is not authorized to access your microphone.
            Verify that your browser has access to your microphone and try again.`;
            break;
          case SpeechError.NoSpeech:
            message = `No speech has been detected. Please try again.`;
            break;
          case SpeechError.AudioCapture:
            message = `Microphone is not available. Plese verify the connection of your microphone and try again.`;
            break;
          default:
            message = '';
            break;
        }
        return message;
      })
    );
  }

  private  processNotification(notification: SpeechNotification<string>): void {
    if (notification.event === SpeechEvent.FinalContent) {
      const message = notification.content?.trim() || '';
     this.actionContext.processMessage(message, this.currentLanguage);
     // // this.actionContext.runAction(message, this.currentLanguage);
      this.totalTranscript = this.totalTranscript
        ? `${this.totalTranscript}\n${message}`
        : notification.content;
    }
  }
  //#endregion speechCode

  //#region cmmon CODE
  constructor(
    private speechRecognizer: SpeechRecognizerService,
    private actionContext: ActionContext,
    private fb: FormBuilder, private store: Store
  ) {
    this.createForm();
  }
  ngOnInit(): void {
    const webSpeechReady = this.speechRecognizer.initialize(this.currentLanguage);
    if (webSpeechReady) {
      this.initRecognition();
    }else {
      this.errorMessage$ = of('Your Browser is not supported. Please try Google Chrome.');
    }

    this.formSubscription.add(
      this.selectedUser.subscribe(user => {
        if (user) {
          this.userForm.patchValue({
            id: user.id,
            name: user.name,
            city: user.city
          });
          this.editUser = true;
        } else {
          this.editUser = false;
        }
      })
    );
  }
  //#endregion common Code

  //#region form code
  @Select(UserState.getSelectedUser) selectedUser: Observable<User>;
  @Select(UserState.getUserList) users: Observable<User[]>;
  userForm: FormGroup;
  editUser = false;
  wdict: WDict[] = [];
  private formSubscription: Subscription = new Subscription();

  createForm() {
    this.userForm = this.fb.group({
      id: [''],
      name: [''],
      city: ['']
    });
  }
  onSubmit() {
    if (this.editUser) {
      this.store.dispatch(
        new UpdateUser(this.userForm.value, this.userForm.value.id)
      );
      this.clearForm();
    } else {
      this.store.dispatch(new AddUser(this.userForm.value));
      this.clearForm();
    }
  }

  clearForm() {
    this.userForm.reset();
    this.store.dispatch(new SetSelectedUser(null));
  }
  //#endregion form code
}
