export enum SpeechEvent {
  Start,
  End,
  FinalContent,
  InterimContent
}
export enum SpeechError {
  NoSpeech = 'no-speech',
  AudioCapture = 'audio-capture',
  NotAllowed = 'not-allowed',
  Unknown = 'unknown'
}