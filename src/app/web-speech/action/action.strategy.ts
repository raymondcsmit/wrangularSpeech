export abstract class ActionStrategy {
  protected mapStartSignal: Map<string, string> = new Map<string, string>();
  protected mapEndSignal: Map<string, string> = new Map<string, string>();

  protected mapInitResponse: Map<string, string> = new Map<string, string>();
  protected mapFinishResponse: Map<string, string> = new Map<string, string>();
  protected mapActionDone: Map<string, string> = new Map<string, string>();

  constructor() {
    this.mapFinishResponse.set('en-US', 'Your action has been completed.');   
    this.mapFinishResponse.set('ur-PK', '.تمہارا کام ہو گیا ہے');
  }

  getStartSignal(language: string): string {
    return this.mapStartSignal.get(language) || '';
  }

  getEndSignal(language: string): string {
    return this.mapEndSignal.get(language) || '';
  }

  getInitialResponse(language: string): string {
    return this.mapInitResponse.get(language) || '';
  }
  getFinishResponse(language: string): string {
    return this.mapFinishResponse.get(language) || '';
  }

  abstract runAction(input: string, language: string): void;
}
