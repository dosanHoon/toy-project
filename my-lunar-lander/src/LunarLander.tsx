import React, { useEffect, useRef, useState } from "react";

const WIDTH = 800;
const HEIGHT = 600;
const GROUND_TOP = HEIGHT - 80;

const GRAVITY = 0.012;
const THRUST = 0.11;
const ROT_SPEED = 0.055;
const BODY_HALF = 25; // 본체 절반 높이/경계 보정

// 유틸: 난수 고정 LCG
function makeRng(seed = 42) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32;
}

const LunarLander: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 로켓 이미지
  const rocketImgRef = useRef<HTMLImageElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // 키 상태
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<null | "success" | "crash" | "playing">("playing");

  // 고정 배경(별/지형)
  const starsRef = useRef<{ x: number; y: number }[]>([]);
  const terrainRef = useRef<number[]>([]);

  // 골인지점
  const goalRef = useRef<{ x: number; width: number }>({ x: WIDTH / 2, width: 100 });

  // 착륙선 상태
  const landerRef = useRef({ x: WIDTH / 2, y: 80, vx: 0, vy: 0.6, angle: 0 });

  // 초기화
  const resetGame = () => {
    setStatus("playing");
    landerRef.current = { x: WIDTH / 2, y: 80, vx: 0, vy: 0.6, angle: 0 };
  };

  // 로켓 이미지 로드 (한 번만)
  useEffect(() => {
    const img = new Image();
    img.src = "/rocket.png"; // public/rocket.png
    const onload = () => setImgLoaded(true);
    img.addEventListener("load", onload);
    rocketImgRef.current = img;
    return () => img.removeEventListener("load", onload);
  }, []);

  // 고정 별/지형/골인지점 생성 (한 번만)
  useEffect(() => {
    const rng = makeRng(1234);
    // 별
    starsRef.current = Array.from({ length: 130 }).map(() => ({
      x: Math.floor(rng() * WIDTH),
      y: Math.floor(rng() * HEIGHT),
    }));

    // 지형
    const step = 20;
    const pts: number[] = [];
    let y = GROUND_TOP;
    for (let x = 0; x <= WIDTH; x += step) {
      const dy = (rng() - 0.5) * 30;
      y = Math.min(HEIGHT - 40, Math.max(GROUND_TOP - 60, y + dy));
      pts.push(y);
    }
    terrainRef.current = pts;

    // 골인지점: 지형 기복이 과하지 않은 곳을 찾음
    const groundYAt = (xx: number) => {
      const i = Math.max(0, Math.min(pts.length - 2, Math.floor(xx / step)));
      const t = (xx % step) / step;
      const y0 = pts[i];
      const y1 = pts[i + 1];
      return y0 * (1 - t) + y1 * t;
    };

    let gx = 100 + rng() * (WIDTH - 200);
    // 3회 정도 시도하며 기울기 완화
    for (let k = 0; k < 3; k++) {
      const yL = groundYAt(gx - 40);
      const yR = groundYAt(gx + 40);
      if (Math.abs(yL - yR) < 10) break; // 충분히 평평
      gx = 100 + rng() * (WIDTH - 200);
    }
    goalRef.current = { x: gx, width: 100 };
  }, []);

  // 키 이벤트
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      setKeys((k) => ({ ...k, [e.key]: true }));
      if ((status === "success" || status === "crash") && (e.key === "r" || e.key === "R" || e.key === " ")) {
        resetGame();
      }
    };
    const up = (e: KeyboardEvent) => setKeys((k) => ({ ...k, [e.key]: false }));
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [status]);

  // 풀스크린 토글
  const onFullscreen = () => {
    const c = canvasRef.current!;
    if (!document.fullscreenElement) c.requestFullscreen();
    else document.exitFullscreen();
  };

  // 지면 y 샘플러
  const groundYAt = (x: number) => {
    const step = 20;
    const i = Math.max(0, Math.min(terrainRef.current.length - 2, Math.floor(x / step)));
    const t = (x % step) / step;
    const y0 = terrainRef.current[i] ?? GROUND_TOP;
    const y1 = terrainRef.current[i + 1] ?? GROUND_TOP;
    return y0 * (1 - t) + y1 * t;
  };

  // 메인 루프
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const update = () => {
      if (status !== "playing") return;
      const L = landerRef.current;

      // 회전/추진
      if (keys["ArrowLeft"]) L.angle -= ROT_SPEED;
      if (keys["ArrowRight"]) L.angle += ROT_SPEED;
      if (keys["ArrowUp"]) {
        L.vx += Math.sin(L.angle) * -THRUST;
        L.vy += Math.cos(L.angle) * -THRUST;
      }

      // 중력
      L.vy += GRAVITY;

      // 이동
      L.x += L.vx;
      L.y += L.vy;

      // 화면 경계 (바깥 불가)
      const marginX = BODY_HALF;
      if (L.x < marginX) { L.x = marginX; L.vx = 0; }
      if (L.x > WIDTH - marginX) { L.x = WIDTH - marginX; L.vx = 0; }
      if (L.y < BODY_HALF) { L.y = BODY_HALF; L.vy = 0; }

      // 지면 충돌 체크
      const baseY = L.y + BODY_HALF;
      const gy = groundYAt(L.x);
      if (baseY >= gy) {
        // 착륙 조건
        const withinPad = Math.abs(L.x - goalRef.current.x) <= goalRef.current.width / 2;
        const okV = Math.abs(L.vy) < 0.32 && Math.abs(L.vx) < 0.35;
        const okAngle = Math.abs(L.angle) < 0.25; // ~14도
        const success = withinPad && okV && okAngle;
        setStatus(success ? "success" : "crash");
        // 스냅
        L.y = gy - BODY_HALF;
        L.vx = 0; L.vy = 0;
      }
    };

    const draw = () => {
      // 배경
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // 별(고정)
      ctx.fillStyle = "white";
      for (const s of starsRef.current) ctx.fillRect(s.x, s.y, 1, 1);

      // 지형(고정)
      ctx.fillStyle = "#666";
      ctx.beginPath();
      ctx.moveTo(0, HEIGHT);
      const step = 20;
      terrainRef.current.forEach((y, i) => {
        const x = i * step;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(WIDTH, HEIGHT);
      ctx.closePath();
      ctx.fill();

      // 골인지점 패드 표시
      const padX = goalRef.current.x;
      const padW = goalRef.current.width;
      const padY = groundYAt(padX);
      ctx.strokeStyle = "#7cff7c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(padX - padW / 2, padY);
      ctx.lineTo(padX + padW / 2, padY);
      ctx.stroke();
      // 비콘
      ctx.beginPath();
      ctx.moveTo(padX - padW / 2, padY);
      ctx.lineTo(padX - padW / 2, padY - 18);
      ctx.moveTo(padX + padW / 2, padY);
      ctx.lineTo(padX + padW / 2, padY - 18);
      ctx.stroke();

      // 착륙선
      const L = landerRef.current;
      ctx.save();
      ctx.translate(L.x, L.y);
      ctx.rotate(L.angle);

      // 본체를 이미지로 렌더링 (로켓)
      const img = rocketImgRef.current;
      if (img && (imgLoaded || img.complete)) {
        const drawH = BODY_HALF * 2; // 기존 충돌 판정과 일치하도록 24px 높이
        const aspect = (img.naturalWidth || 1) / (img.naturalHeight || 1);
        const drawW = drawH * aspect;
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      } else {
        // 로드 전 임시 사각형
        ctx.fillStyle = "#f2f2f2";
        ctx.fillRect(-10, -10, 20, 20);
      }

      // 키 표시: 화염/측추력
      if (keys["ArrowUp"]) {
        ctx.beginPath();
        ctx.moveTo(-6, BODY_HALF);
        ctx.lineTo(0, BODY_HALF + 12 + Math.random() * 3);
        ctx.lineTo(6, BODY_HALF);
        ctx.closePath();
        ctx.fillStyle = "#ffa500";
        ctx.fill();
      }
      if (keys["ArrowLeft"]) {
        ctx.beginPath();
        ctx.moveTo(-12, -6);
        ctx.lineTo(-22 - Math.random() * 2, 0);
        ctx.lineTo(-12, 6);
        ctx.closePath();
        ctx.fillStyle = "#ffcc00";
        ctx.fill();
      }
      if (keys["ArrowRight"]) {
        ctx.beginPath();
        ctx.moveTo(12, -6);
        ctx.lineTo(22 + Math.random() * 2, 0);
        ctx.lineTo(12, 6);
        ctx.closePath();
        ctx.fillStyle = "#ffcc00";
        ctx.fill();
      }

      ctx.restore();

      // HUD
      ctx.fillStyle = "#9f9";
      ctx.font = "14px monospace";
      ctx.fillText(`X:${L.x.toFixed(1)}  Y:${L.y.toFixed(1)}  ANG:${(L.angle * 180/Math.PI).toFixed(1)}°`, 10, 20);
      ctx.fillText(`VX:${L.vx.toFixed(2)} VY:${L.vy.toFixed(2)}`, 10, 38);
      ctx.fillText(`TARGET X:${(padX - padW/2).toFixed(0)}~${(padX + padW/2).toFixed(0)}`, 10, 56);

      if (status === "success" || status === "crash") {
        ctx.fillStyle = status === "success" ? "#7cff7c" : "#ff6b6b";
        ctx.font = "24px monospace";
        const msg = status === "success" ? "착륙 성공! [R/Space] 재시작" : "충돌! [R/Space] 재시작";
        const textW = ctx.measureText(msg).width;
        ctx.fillText(msg, (WIDTH - textW) / 2, HEIGHT / 2);
      }
    };

    const loop = () => {
      update();
      draw();
      raf = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(raf);
  }, [keys, status, imgLoaded]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ margin: 8 }}>Lunar Lander <img src="/poster.jpg" alt="poster" width={100}/></h2>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
        <button onClick={resetGame}>Restart (R/Space)</button>
        <button onClick={onFullscreen}>Fullscreen</button>
      </div>
      <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} style={{ background: "black" }} />
    </div>
  );
};

export default LunarLander;
