import { Injectable } from '@angular/core';
import { SpeechSynthesizerService } from '../services/speech-synthesizer.service';
import { ActionStrategy } from './action.strategy';
import { FillFormStrategy } from './fillform.strategy';

@Injectable({
  providedIn: 'root'
})
export class ActionContext {
  private currentStrategy?: ActionStrategy;

  constructor(
    private fillFormStrategy: FillFormStrategy,
    private speechSynthesizer: SpeechSynthesizerService
  ) {}

  processMessage(message: string, language: string): void {
    const msg = message.toLowerCase();
    const hasChangedStrategy = this.hasChangedStrategy(msg, language);

    let isFinishSignal = false;
    if (!hasChangedStrategy) {
      isFinishSignal = this.isFinishSignal(msg, language);
    }

    if (!hasChangedStrategy && !isFinishSignal) {
      this.runAction(message, language);
    }
  }
  runAction(input: string, language: string): void {
    if (this.currentStrategy) {
      this.currentStrategy.runAction(input, language);
    }
  }

  setStrategy(strategy: ActionStrategy | undefined): void {
    this.currentStrategy = strategy;
  }

  private hasChangedStrategy(message: string, language: string): boolean {
    let strategy: ActionStrategy | undefined;
    if (message === this.fillFormStrategy.getStartSignal(language)) {
      strategy = this.fillFormStrategy;
    }

    if (strategy) {
      this.setStrategy(strategy);
      this.speechSynthesizer.speak(
        strategy.getInitialResponse(language),
        language
      );
      return true;
    }

    return false;
  }
  private isFinishSignal(message: string, language: string): boolean {
    if (message === this.fillFormStrategy.getEndSignal(language)) {
      if (this.currentStrategy) {
        this.speechSynthesizer.speak(
          this.currentStrategy.getFinishResponse(language),
          language
        );
      }
      this.setStrategy(undefined);
      return true;
    }

    return false;
  }
}
