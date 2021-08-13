import { Injectable } from '@angular/core';
import { SpeechSynthesizerService } from '../services/speech-synthesizer.service';
import { ActionStrategy } from './action.strategy';

@Injectable({
  providedIn: 'root'
})
export class FillFormStrategy extends ActionStrategy {
  constructor(private speechSynthesizer: SpeechSynthesizerService) {
    super();
    this.mapStartSignal.set('en-US', 'Fill Form');
    this.mapStartSignal.set('es-ES', 'iniciar cambio de título');
    this.mapStartSignal.set('ur-PK', 'کام کرو');

    this.mapEndSignal.set('en-US', 'finish form');
    this.mapEndSignal.set('es-ES', 'finalizar cambio de título');
    this.mapEndSignal.set('ur-PK', 'کام ہو گیا');

    this.mapInitResponse.set('en-US', 'Please, tell me the data');
    this.mapInitResponse.set('es-ES', 'Por favor, mencione el nuevo título');
    this.mapInitResponse.set('ur-PK', 'کام بتاؤ');

    this.mapActionDone.set('en-US', 'Filling the form to');
    this.mapActionDone.set('es-ES', 'Cambiando el título de la Aplicación a');
    this.mapActionDone.set('ur-PK', 'کر رہا ہوں');
  }

  runAction(input: string, language: string): void {
    console.log('this is form data : ', input);
    //fill the form object and patch it into ngxs action
    this.speechSynthesizer.speak(
      `${this.mapActionDone.get(language)}: ${input}`,
      language
    );
  }
}
