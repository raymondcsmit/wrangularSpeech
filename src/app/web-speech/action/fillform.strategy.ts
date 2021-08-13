import { Injectable } from '@angular/core';
import { SpeechSynthesizerService } from '../services/speech-synthesizer.service';
import { ActionStrategy } from './action.strategy';

@Injectable({
  providedIn: 'root'
})
export class FillFormStrategy extends ActionStrategy {
  constructor(private speechSynthesizer: SpeechSynthesizerService) {
    super();
    this.mapStartSignal.set('en-US', 'perform change title');
    this.mapStartSignal.set('es-ES', 'iniciar cambio de título');
    this.mapStartSignal.set('ur-PK', 'ٹائٹل چینج کرو');

    this.mapEndSignal.set('en-US', 'finish change title');
    this.mapEndSignal.set('es-ES', 'finalizar cambio de título');
    this.mapEndSignal.set('ur-PK', 'ٹائٹل چینج ہوگیا');

    this.mapInitResponse.set('en-US', 'Please, tell me the new title');
    this.mapInitResponse.set('es-ES', 'Por favor, mencione el nuevo título');
    this.mapInitResponse.set('ur-PK', 'نیا ٹائٹل بتاؤ');

    this.mapActionDone.set('en-US', 'Changing title of the Application to');
    this.mapActionDone.set('es-ES', 'Cambiando el título de la Aplicación a');
    this.mapActionDone.set('ur-PK', 'پیج کے ٹائٹل کو چینج کر رہا ہوں');
  }

  runAction(input: string, language: string): void {
    //fill the form object and patch it into ngxs action
    this.speechSynthesizer.speak(
      `${this.mapActionDone.get(language)}: ${input}`,
      language
    );
  }
}
