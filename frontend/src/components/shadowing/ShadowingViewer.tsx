import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, Square, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '../ui';
import type { ShadowingLanguage, ShadowingSentence } from '../../types/shadowing';
import {
  ShadowingPlayer,
  isSpeechSupported,
  loadVoices,
} from '../../utils/shadowingTTS';

interface ShadowingViewerProps {
  sentences: ShadowingSentence[];
  language: ShadowingLanguage;
  /** 문장이 바뀔 때 자동으로 재생 시작 (연속 재생 모드용) */
  autoPlay?: boolean;
  /** 현재 페이지의 모든 문장 재생이 끝났을 때 호출 */
  onComplete?: () => void;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5];

/** 경계 이벤트의 charIndex/charLength로 단어 범위를 계산. length 미제공 시 다음 공백까지 */
function wordRangeAt(text: string, charIndex: number, charLength: number): [number, number] {
  const start = Math.max(0, Math.min(charIndex, text.length));
  let end = charLength > 0 ? start + charLength : start;
  if (end <= start) {
    const m = text.slice(start).match(/^\S+/);
    end = start + (m ? m[0].length : 1);
  }
  return [start, Math.min(end, text.length)];
}

/**
 * 노래방 자막식 shadowing 뷰어.
 * 문장 단위 TTS를 순차 재생하며 현재 문장을 하이라이트한다.
 */
export default function ShadowingViewer({
  sentences,
  language,
  autoPlay = false,
  onComplete,
}: ShadowingViewerProps) {
  const [activeIndex, setActiveIndex] = useState(-1);
  // 현재 발화 중인 단어 범위(문장 텍스트 기준). 경계 이벤트 미지원 시 null → 문장 단위 폴백
  const [activeWord, setActiveWord] = useState<{ sentence: number; start: number; end: number } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const playerRef = useRef<ShadowingPlayer | null>(null);
  const activeRef = useRef<HTMLSpanElement | null>(null);

  // 콜백/플래그는 ref로 보관해 플레이어 콜백의 stale closure를 피한다
  const onCompleteRef = useRef(onComplete);
  const autoPlayRef = useRef(autoPlay);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);
  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  const supported = isSpeechSupported();

  // 현재 언어에 맞는 음성 우선 정렬
  const langPrefix = useMemo(
    () => ({ en: 'en', ja: 'ja', zh: 'zh', ko: 'ko' }[language]),
    [language],
  );
  const sortedVoices = useMemo(() => {
    const match = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));
    const rest = voices.filter((v) => !v.lang.toLowerCase().startsWith(langPrefix));
    return [...match, ...rest];
  }, [voices, langPrefix]);

  // 음성 목록 로드
  useEffect(() => {
    let alive = true;
    loadVoices().then((vs) => {
      if (!alive) return;
      setVoices(vs);
      const preferred = vs.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
      if (preferred) setVoiceURI(preferred.voiceURI);
    });
    return () => {
      alive = false;
    };
  }, [langPrefix]);

  // 플레이어 (재)생성: 문장/언어가 바뀌면 새로 만든다
  useEffect(() => {
    const player = new ShadowingPlayer({
      sentences,
      lang: language,
      rate,
      callbacks: {
        onSentenceStart: (i) => {
          setActiveIndex(i);
          setActiveWord(null);
        },
        onWordBoundary: (sentence, start, length) => {
          const text = sentences[sentence]?.text ?? '';
          const [s, e] = wordRangeAt(text, start, length);
          setActiveWord({ sentence, start: s, end: e });
        },
        onEnd: () => {
          setPlaying(false);
          setActiveIndex(-1);
          setActiveWord(null);
          onCompleteRef.current?.();
        },
        onError: (msg) => {
          setError(msg);
          setPlaying(false);
        },
      },
    });
    playerRef.current = player;
    setActiveIndex(-1);
    setPlaying(false);

    // 연속 재생 모드: 새 페이지(문장)가 로드되면 자동으로 재생 시작
    if (autoPlayRef.current && sentences.length > 0) {
      player.play(0);
      setPlaying(true);
    }

    return () => {
      player.stop();
    };
    // rate/voice는 별도 effect에서 주입하므로 deps에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentences, language]);

  // rate/voice 변경 반영
  useEffect(() => {
    playerRef.current?.setRate(rate);
  }, [rate]);
  useEffect(() => {
    const v = voices.find((x) => x.voiceURI === voiceURI) ?? null;
    playerRef.current?.setVoice(v);
  }, [voiceURI, voices]);

  // 활성 문장 자동 스크롤
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeIndex]);

  const handlePlay = () => {
    setError(null);
    const player = playerRef.current;
    if (!player) return;
    // 끝났거나 처음이면 0부터, 일시정지였으면 현재 위치부터
    const from = activeIndex < 0 ? 0 : activeIndex;
    player.play(from);
    setPlaying(true);
  };
  const handlePause = () => {
    playerRef.current?.pause();
    setPlaying(false);
  };
  const handleStop = () => {
    playerRef.current?.stop();
    setPlaying(false);
    setActiveIndex(-1);
    setActiveWord(null);
  };
  const handlePrev = () => {
    playerRef.current?.prev();
    setPlaying(true);
  };
  const handleNext = () => {
    playerRef.current?.next();
    setPlaying(true);
  };

  if (!supported) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-800">
        이 브라우저는 음성 합성(Web Speech API)을 지원하지 않습니다. Chrome/Edge 등에서 실행해 주세요.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 컨트롤 바 */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <Button size="sm" variant="ghost" onClick={handlePrev} icon={<SkipBack className="h-4 w-4" />}>
          이전
        </Button>
        {playing ? (
          <Button size="sm" onClick={handlePause} icon={<Pause className="h-4 w-4" />}>
            일시정지
          </Button>
        ) : (
          <Button size="sm" onClick={handlePlay} icon={<Play className="h-4 w-4" />}>
            재생
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={handleNext} icon={<SkipForward className="h-4 w-4" />}>
          다음
        </Button>
        <Button size="sm" variant="secondary" onClick={handleStop} icon={<Square className="h-4 w-4" />}>
          정지
        </Button>

        <div className="mx-2 h-6 w-px bg-gray-200" />

        {/* 속도 */}
        <label className="text-sm text-gray-600">속도</label>
        <select
          className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        >
          {SPEEDS.map((s) => (
            <option key={s} value={s}>
              {s}x
            </option>
          ))}
        </select>

        {/* 음성 */}
        <label className="ml-2 text-sm text-gray-600">음성</label>
        <select
          className="max-w-[220px] rounded-md border border-gray-300 px-2 py-1 text-sm"
          value={voiceURI}
          onChange={(e) => setVoiceURI(e.target.value)}
        >
          {sortedVoices.length === 0 && <option value="">기본</option>}
          {sortedVoices.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* 문장 렌더링: 현재 문장 하이라이트 */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-lg leading-loose shadow-sm">
        {sentences.length === 0 ? (
          <p className="text-gray-400">문장이 없습니다. 텍스트를 입력하거나 PDF를 업로드하세요.</p>
        ) : (
          <p className="flex flex-wrap gap-x-1 gap-y-2">
            {sentences.map((s, i) => {
              const isActive = i === activeIndex;
              const word = isActive && activeWord?.sentence === i ? activeWord : null;
              return (
                <span
                  key={s.id}
                  ref={isActive ? activeRef : null}
                  onClick={() => {
                    playerRef.current?.play(i);
                    setPlaying(true);
                  }}
                  className={
                    'cursor-pointer rounded px-1 transition-colors duration-200 ' +
                    (isActive
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-800 hover:bg-gray-100')
                  }
                >
                  {word ? (
                    <>
                      {s.text.slice(0, word.start)}
                      <span className="rounded bg-primary-600 px-0.5 font-semibold text-white">
                        {s.text.slice(word.start, word.end)}
                      </span>
                      {s.text.slice(word.end)}
                    </>
                  ) : (
                    s.text
                  )}
                </span>
              );
            })}
          </p>
        )}
      </div>

      <p className="text-xs text-gray-400">
        문장을 클릭하면 해당 위치부터 재생됩니다. (Web Speech API · 단어 단위 하이라이트, 미지원 브라우저는 문장 단위로 표시)
      </p>
    </div>
  );
}
