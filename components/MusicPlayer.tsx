"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Music, Volume2, VolumeX, Pause, Play } from "lucide-react";

// 用 Web Audio API 实时合成禅修氛围音 —— 零外部音频文件依赖，
// 永不失效（不像之前的外链 mp3 会 403）、零流量成本。
// 合成原理：多个低频正弦波叠加（模拟颂钵/古琴泛音）+ 缓慢颤音 + 偶发钟磬泛音，
// 循环不息，营造静心冥想氛围。

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  // 初始化 Web Audio 图（创建 AudioContext + 振荡器链）
  // 必须在用户交互后调用（浏览器自动播放策略）
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;

    // 主音量控制（起点静音，便于淡入）
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // 颂钵/古琴的泛音基频：用纯五度关系（2:3）营造和谐感
    // 基频 110Hz(A2) + 164.81Hz(E3) + 220Hz(A3) + 329.63Hz(E4) + 一个低八度衬底
    const freqs = [55, 110, 164.81, 220, 329.63];
    const types: OscillatorType[] = ["sine", "sine", "sine", "triangle", "sine"];
    const gains = [0.35, 0.5, 0.4, 0.25, 0.15]; // 各泛音音量配比

    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = types[i];
      osc.frequency.value = freq;

      // 缓慢颤音（LFO 调制频率），让声音有呼吸感而非死板
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.1 + i * 0.03; // 每个泛音颤动速度略不同
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = freq * 0.005; // 轻微颤动
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      // 每个泛音独立的音量包络
      const oscGain = ctx.createGain();
      oscGain.gain.value = gains[i] * 0.3; // 整体压低，避免刺耳

      // 低通滤波，去掉高频毛刺，更柔和
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800 + i * 200;
      filter.Q.value = 1;

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();

      oscillatorsRef.current.push(osc, lfo);
    });

    setAudioReady(true);
  }, []);

  // 播放（淡入）
  const play = useCallback(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    // 浏览器可能 suspend 了 context，需 resume
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    const now = audioCtxRef.current.currentTime;
    masterGainRef.current.gain.cancelScheduledValues(now);
    masterGainRef.current.gain.setValueAtTime(
      masterGainRef.current.gain.value,
      now
    );
    // 1.5 秒淡入到 0.3 音量
    masterGainRef.current.gain.linearRampToValueAtTime(0.3, now + 1.5);
    setIsPlaying(true);
  }, []);

  // 暂停（淡出）
  const pause = useCallback(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const now = audioCtxRef.current.currentTime;
    masterGainRef.current.gain.cancelScheduledValues(now);
    masterGainRef.current.gain.setValueAtTime(
      masterGainRef.current.gain.value,
      now
    );
    masterGainRef.current.gain.linearRampToValueAtTime(0, now + 0.8);
    setIsPlaying(false);
  }, []);

  // 首次用户交互后：初始化音频并自动播放
  useEffect(() => {
    if (isAdmin) return;

    const handleFirstInteraction = () => {
      initAudio();
      // 初始化后稍等一帧再播放，确保图就绪
      setTimeout(() => play(), 100);
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };

    // 浏览器自动播放策略：必须等用户首次交互
    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("touchstart", handleFirstInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [isAdmin, initAudio, play]);

  // 切换播放/暂停
  const togglePlay = () => {
    if (!audioReady) {
      // 首次点击时初始化（兜底，防止首次交互监听失效）
      initAudio();
      setTimeout(() => play(), 100);
      return;
    }
    if (isPlaying) pause();
    else play();
  };

  // 静音/取消静音（不停止振荡器，仅切主音量）
  const toggleMute = () => {
    if (!masterGainRef.current || !audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    const muted = masterGainRef.current.gain.value < 0.01;
    masterGainRef.current.gain.cancelScheduledValues(now);
    masterGainRef.current.gain.setValueAtTime(
      masterGainRef.current.gain.value,
      now
    );
    masterGainRef.current.gain.linearRampToValueAtTime(
      muted ? 0.3 : 0,
      now + 0.3
    );
    // 静音视为暂停态
    setIsPlaying(!muted);
  };

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* 已停止 */
        }
      });
      audioCtxRef.current?.close();
    };
  }, []);

  if (isAdmin) return null;

  return (
    <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-full border border-gold/20 bg-bg-primary/90 px-3 py-2 backdrop-blur-md md:top-24">
      <button
        onClick={togglePlay}
        className="flex items-center gap-1.5 text-gold transition-opacity hover:opacity-80"
        title={isPlaying ? "暂停音乐" : "播放禅修音乐"}
        aria-label={isPlaying ? "暂停音乐" : "播放禅修音乐"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <Music className={`h-4 w-4 ${isPlaying ? "animate-pulse" : ""}`} />
      </button>

      <button
        onClick={toggleMute}
        className="text-gold transition-opacity hover:opacity-80"
        title="静音/取消静音"
        aria-label="静音/取消静音"
      >
        {isPlaying ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
