import { SpeechError, SpeechEvent } from './speech.enum';

export interface AppWindow extends Window {
  // tslint:disable-next-line:no-any
  webkitSpeechRecognition: any;
}

export interface SpeechNotification<T> {
  event?: SpeechEvent;
  error?: SpeechError;
  content?: T;
}
