import { afterEach, describe, expect, test, vi } from "vitest";

import { playAudio, stopAudio, stopAudioGroup, stopAllAudio } from "@/lib/utils";

class MockAudio {
  static instances: MockAudio[] = [];

  currentTime = 0;
  loop = false;
  playbackRate = 1;
  volume = 1;
  addEventListener = vi.fn();
  pause = vi.fn();
  play = vi.fn().mockResolvedValue(undefined);
  src: string;

  constructor(src: string) {
    this.src = src;
    MockAudio.instances.push(this);
  }
}

describe("audio utilities", () => {
  afterEach(() => {
    stopAllAudio();
    MockAudio.instances = [];
    vi.unstubAllGlobals();
  });

  test("stops an existing group before replacing it with a new sound", () => {
    vi.stubGlobal("Audio", MockAudio);

    const first = playAudio("first.mp3", { group: "effects" });
    const second = playAudio("second.mp3", { group: "effects", stopGroupBeforePlay: true });

    expect(first).toBe(MockAudio.instances[0]);
    expect(second).toBe(MockAudio.instances[1]);
    expect(MockAudio.instances[0]?.pause).toHaveBeenCalledOnce();
    expect(MockAudio.instances[0]?.currentTime).toBe(0);
    expect(MockAudio.instances[1]?.play).toHaveBeenCalledOnce();
  });

  test("configures left-ear panning for binaural placement sounds", () => {
    const stereoPanner = { pan: { value: 0 }, connect: vi.fn() };
    const mediaSource = { connect: vi.fn() };
    const audioContext = {
      createMediaElementSource: vi.fn(() => mediaSource),
      createStereoPanner: vi.fn(() => stereoPanner),
      destination: {}
    };

    vi.stubGlobal("Audio", MockAudio);
    vi.stubGlobal("AudioContext", vi.fn(function MockAudioContext() {
      return audioContext;
    }));

    const audio = playAudio("putting-object.mp3", { id: "tray", pan: -1 });

    expect(audio).toBe(MockAudio.instances[0]);
    expect(audioContext.createMediaElementSource).toHaveBeenCalledWith(audio);
    expect(mediaSource.connect).toHaveBeenCalledWith(stereoPanner);
    expect(stereoPanner.pan.value).toBe(-1);
    expect(stereoPanner.connect).toHaveBeenCalledWith(audioContext.destination);
  });

  test("reuses an active sound when restart is disabled", () => {
    vi.stubGlobal("Audio", MockAudio);

    const first = playAudio("ambience.mp3", { id: "ambience", loop: true, restart: false });
    const second = playAudio("ambience.mp3", { id: "ambience", loop: true, restart: false });

    expect(second).toBe(first);
    expect(MockAudio.instances).toHaveLength(1);
  });

  test("can stop one sound or an entire group", () => {
    vi.stubGlobal("Audio", MockAudio);

    playAudio("ambience.mp3", { id: "ambience", group: "background", loop: true });
    playAudio("door.mp3", { id: "door", group: "effects" });

    stopAudio("door");
    expect(MockAudio.instances[1]?.pause).toHaveBeenCalledOnce();
    expect(MockAudio.instances[0]?.pause).not.toHaveBeenCalled();

    stopAudioGroup("background");
    expect(MockAudio.instances[0]?.pause).toHaveBeenCalledOnce();
  });
});
