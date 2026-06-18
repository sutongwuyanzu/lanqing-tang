"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Music, Volume2, VolumeX, Pause, Play } from "lucide-react";

// 免费禅修音乐（来自 Pixabay Music，CC0 免版权）
// 静心、冥想、古琴风格
const MUSIC_URL = "https://cdn.pixabay.com/audio/2022/10/25/audio_e694c7f3f4.mp3";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showError, setShowError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    // 后台不播放禅修音乐
    if (isAdmin) return;

    // 创建 audio 元素
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    // 尝试自动播放（浏览器可能阻止，需要用户交互）
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // 自动播放被阻止，等用户点击
          setIsPlaying(false);
          // 添加全局点击监听，第一次点击时播放
          const handleFirstClick = () => {
            audio.play().then(() => setIsPlaying(true)).catch(() => setShowError(true));
            document.removeEventListener("click", handleFirstClick);
            document.removeEventListener("touchstart", handleFirstClick);
          };
          document.addEventListener("click", handleFirstClick, { once: true });
          document.addEventListener("touchstart", handleFirstClick, { once: true });
        });
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [isAdmin]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setShowError(true));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      {isAdmin ? null : (
        <>
          {/* 右上角音乐控制按钮 */}
      <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-full border border-gold/20 bg-bg-primary/90 px-3 py-2 backdrop-blur-md md:top-24">
        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 text-gold transition-opacity hover:opacity-80"
          title={isPlaying ? "暂停音乐" : "播放音乐"}
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
          title={isMuted ? "取消静音" : "静音"}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* 首次提示（如果自动播放被阻止） */}
      {showError && (
        <div
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-gold/20 bg-bg-card px-4 py-2 text-xs text-gold md:bottom-8"
          onClick={() => setShowError(false)}
        >
          🎵 点击右上角播放禅修音乐
        </div>
      )}
        </>
      )}
    </>
  );
}
