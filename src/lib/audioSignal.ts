// Shared audio analyzer instance
export class SignalAudio {
  private static instance: SignalAudio;
  public analyser: AnalyserNode | null = null;
  public context: AudioContext | null = null;

  private constructor() {}

  public static getInstance(): SignalAudio {
    if (!SignalAudio.instance) {
      SignalAudio.instance = new SignalAudio();
    }
    return SignalAudio.instance;
  }

  public init(ctx: AudioContext) {
    this.context = ctx;
    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 256;
  }
}

export const signalAudio = SignalAudio.getInstance();
