import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetSelectedUser, User, WDict } from '../ngxs.state.user';
import { SpeechSynthesizerService } from '../services/speech-synthesizer.service';
import { ActionStrategy } from './action.strategy';

@Injectable({
  providedIn: 'root'
})
export class FillFormStrategy extends ActionStrategy {
  constructor(
    private speechSynthesizer: SpeechSynthesizerService,
    private store: Store
  ) {
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
    this.makeEntry(input);
    //fill the form object and patch it into ngxs action
    this.speechSynthesizer.speak(
      `${this.mapActionDone.get(language)}: ${input}`,
      language
    );
  }
  wdict: WDict[] = [];
  splitDict(statement: string, words: string[]) {
    for (var wd in words) {
      let index = statement.indexOf(words[wd]);
      let wordLastIndex = statement.lastIndexOf(words[wd]);
      this.wdict.push({
        propertyName: words[wd],
        startIndex: index,
        value: '',
        endIndex: wordLastIndex
      });
    }
    console.log('Dictionary is :', this.wdict);
    for (let dc: number = 0; dc < this.wdict.length; dc++) {
      if (this.wdict[dc + 1]) {
        this.wdict[dc].value = statement.slice(
          this.wdict[dc].startIndex,
          this.wdict[dc + 1].startIndex
        );
      } else {
        this.wdict[dc].value = statement.slice(
          this.wdict[dc].startIndex,
          statement.length
        );
      }
      this.wdict[dc].value = this.wdict[dc].value
        .replace(this.wdict[dc].propertyName, '')
        .trim();
      console.log('split data ftn: are:', this.wdict[dc]);
    }
  }

  makeEntry(text: string) {
    let user = { name: 'waqar', city: 'mardan' } as User;
    let array = Object.keys(user);

    //let text = 'name waqar city  NEW YORK ';
    this.splitDict(text, array as string[]);
    let newObj: User = { id: 0, name: 'ddd', city: '' };
    for (var wd in this.wdict) {
      //console.log('new obj value is: ' ,newObj[this.wdict[wd].propertyName] );
      console.log(
        'property name and value',
        this.wdict[wd].propertyName,
        this.wdict[wd].value
      );
      //if (newObj[this.wdict[wd].propertyName])
      //{
      newObj[this.wdict[wd].propertyName] = this.wdict[wd].value;
      //}
    }
    console.log(newObj);
    this.store.dispatch(new SetSelectedUser(newObj));
  }
}
