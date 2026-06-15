type BrowserSpeechRecognition = {
	lang: string;
	continuous: boolean;
	interimResults: boolean;
	onresult: ((event: any) => void) | null;
	onerror: ((event: any) => void) | null;
	onend: (() => void) | null;
	start: () => void;
	stop: () => void;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

type ManagedAudio = {
	audio: HTMLAudioElement;
	group?: string;
	context?: AudioContext;
	source?: MediaElementAudioSourceNode;
	panner?: StereoPannerNode;
};

type PlayAudioOptions = {
	id?: string;
	group?: string;
	loop?: boolean;
	volume?: number;
	playbackRate?: number;
	pan?: number;
	restart?: boolean;
	stopGroupBeforePlay?: boolean;
};

declare global {
	interface ResponsiveVoiceAPI {
		speak: (text: string, voice?: string, params?: Record<string, unknown>) => void;
		cancel?: () => void;
	}

	interface Window {
		SpeechRecognition?: BrowserSpeechRecognitionConstructor;
		webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
		responsiveVoice?: ResponsiveVoiceAPI;
	}
}

const activeAudio = new Map<string, ManagedAudio>();
let anonymousAudioIndex = 0;

const stopAllVoice = () => {
	window.responsiveVoice?.cancel?.();
};

export const playAudio = (src: string, options: PlayAudioOptions = {}): HTMLAudioElement | null => {
	if (typeof Audio === "undefined") {
		return null;
	}

	if (options.group && options.stopGroupBeforePlay) {
		stopAudioGroup(options.group);
	}

	if (options.id && options.restart === false) {
		const existing = activeAudio.get(options.id);
		if (existing) {
			return existing.audio;
		}
	}

	if (options.id && options.restart !== false) {
		stopAudio(options.id);
	}

	const id = options.id ?? `audio-${anonymousAudioIndex++}`;
	const audio = new Audio(src);
	audio.loop = options.loop ?? false;
	audio.volume = clampAudioValue(options.volume ?? 1);
	audio.playbackRate = options.playbackRate ?? 1;

	const managed: ManagedAudio = { audio, group: options.group };
	connectPanner(managed, options.pan);
	activeAudio.set(id, managed);

	audio.addEventListener("ended", () => {
		activeAudio.delete(id);
	});

	void audio.play().catch(() => undefined);

	return audio;
};

export const stopAudio = (id: string) => {
	const managed = activeAudio.get(id);
	if (!managed) {
		return;
	}

	stopManagedAudio(managed);
	activeAudio.delete(id);
};

export const stopAudioGroup = (group: string) => {
	Array.from(activeAudio.entries()).forEach(([id, managed]) => {
		if (managed.group !== group) {
			return;
		}

		stopManagedAudio(managed);
		activeAudio.delete(id);
	});
};

export const stopAllAudio = () => {
	Array.from(activeAudio.entries()).forEach(([id, managed]) => {
		stopManagedAudio(managed);
		activeAudio.delete(id);
	});
};

export const speak = async (text: string, isPraise = false, lang = 'vi'): Promise<void> => {
	if (!window.responsiveVoice) {
		console.warn('responsiveVoice is not loaded yet.');
		return;
	}

	const voice = 'Vietnamese Female';
	// stopAllVoice();
	window.responsiveVoice.speak(text, voice, { rate: 0.95, pitch: 1, volume: 1 });
};

function stopManagedAudio(managed: ManagedAudio) {
	managed.audio.pause();
	managed.audio.currentTime = 0;
	void managed.context?.close?.().catch(() => undefined);
}

function connectPanner(managed: ManagedAudio, pan: number | undefined) {
	if (pan === undefined || typeof AudioContext === "undefined") {
		return;
	}

	const context = new AudioContext();
	const source = context.createMediaElementSource(managed.audio);
	const panner = context.createStereoPanner();

	panner.pan.value = Math.max(-1, Math.min(1, pan));
	source.connect(panner);
	panner.connect(context.destination);

	managed.context = context;
	managed.source = source;
	managed.panner = panner;
}

function clampAudioValue(value: number) {
	return Math.min(1, Math.max(0, value));
}
