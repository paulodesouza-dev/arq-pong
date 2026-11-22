(() => {
  "use strict";

  // ---------- Configuração ----------
  const W = 800, H = 500;
  const WIN_SCORE = 7;
  const QUESTION_TIME = 10;          // segundos para responder
  const STREAK_FOR_POWER = 3;        // acertos seguidos para turbinar
  const POWER_DURATION = 12;         // segundos de raquete maior
  const PADDLE_W = 14;
  const PADDLE_H = 90;
  const PADDLE_H_POWER = 150;
  const PLAYER_SPEED = 520;          // px/s no teclado
  const AI_SPEED = 330;              // px/s da Memória
  const BALL_SIZE = 18;
  const BALL_START_SPEED = 380;
  const BALL_MAX_SPEED = 900;
  const BALL_SPEEDUP = 1.06;
  const SERVE_DELAY = 0.9;

  // Paleta Frutiger Aero
  const AERO = {
    cpu:  { dark: "#0569b5", mid: "#2fb2f5", light: "#bff0ff", glow: "rgba(90,210,255,0.9)" },
    mem:  { dark: "#2f8a0e", mid: "#7fd23a", light: "#e2ffc0", glow: "rgba(150,240,80,0.9)" },
    power:{ dark: "#0a7fd0", mid: "#6ee0ff", light: "#ffffff", glow: "rgba(255,255,255,1)" }
  };

  // ---------- Elementos ----------
  const $ = (id) => document.getElementById(id);
  const canvas = $("game");
  const ctx = canvas.getContext("2d");
  const el = {
    scoreCpu: $("score-cpu"), scoreMem: $("score-mem"),
    streak: $("streak"), powerup: $("powerup"),
    start: $("screen-start"), question: $("screen-question"), end: $("screen-end"),
    qTopic: $("q-topic"), qTime: $("q-time"), qBar: $("q-bar"), qText: $("q-text"),
    qOptions: $("q-options"), qFeedback: $("q-feedback"), btnContinue: $("btn-continue"),
    endTitle: $("end-title"), endStats: $("end-stats"), review: $("review"),
    btnStart: $("btn-start"), btnRestart: $("btn-restart")
  };

  // ---------- Estado ----------
  let state = "start"; // start | serve | playing | question | end
  let score = { cpu: 0, mem: 0 };
  let streak = 0, powerTime = 0, serveTimer = 0;
  let wrongList = [], answered = 0, asked = 0;
  let deck = [];
  let current = null;       // pergunta atual (com opções embaralhadas)
  let qTimeLeft = 0;
  let qResolved = false;
  let clock = 0;            // tempo total, para animações

  const player = { x: 24, y: H / 2, h: PADDLE_H };
  const ai = { x: W - 24 - PADDLE_W, y: H / 2, h: PADDLE_H, aimOffset: 0 };
  const ball = { x: W / 2, y: H / 2, vx: 0, vy: 0, speed: BALL_START_SPEED, trail: [] };

  const keys = { up: false, down: false };
  let pointerY = null;

  // ---------- Utilidades ----------
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a, b) => a + Math.random() * (b - a);

  // Bolhas decorativas do fundo e "estouros" nas rebatidas
  const bgBubbles = Array.from({ length: 22 }, () => makeBubble(true));
  const pops = [];
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const show = (node) => node.classList.remove("hidden");
  const hide = (node) => node.classList.add("hidden");

  function makeBubble(anywhere) {
    return {
      x: rand(0, W),
      y: anywhere ? rand(0, H) : H + rand(10, 60),
      r: rand(3, 16),
      speed: rand(12, 40),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.25, 0.6)
    };
  }

  function nextQuestion() {
    if (deck.length === 0) deck = shuffle(QUESTIONS);
    const base = deck.pop();
    const order = shuffle([0, 1, 2]);
    return {
      ...base,
      options: order.map((i) => base.options[i]),
      answer: order.indexOf(base.answer)
    };
  }

  // ---------- Fluxo do jogo ----------
  function newGame() {
    score = { cpu: 0, mem: 0 };
    streak = 0;
    powerTime = 0;
    wrongList = [];
    answered = 0;
    asked = 0;
    deck = shuffle(QUESTIONS);
    player.y = ai.y = H / 2;
    player.h = PADDLE_H;
    updateHud();
    hide(el.start); hide(el.end); hide(el.question);
    resetBall();
  }

  function resetBall() {
    ball.x = W / 2;
    ball.y = H / 2;
    ball.vx = ball.vy = 0;
    ball.speed = BALL_START_SPEED;
    ball.trail = [];
    serveTimer = SERVE_DELAY;
    state = "serve";
  }

  function serve() {
    const dir = Math.random() < 0.5 ? -1 : 1;
    const angle = (Math.random() * 0.6 - 0.3) * Math.PI / 2;
    ball.vx = Math.cos(angle) * ball.speed * dir;
    ball.vy = Math.sin(angle) * ball.speed;
    ai.aimOffset = 0;
    state = "playing";
  }

  function cpuScores() {
    score.cpu++;
    updateHud();
    if (score.cpu >= WIN_SCORE) endGame();
    else resetBall();
  }

  function endGame() {
    state = "end";
    hide(el.question);
    const won = score.cpu >= WIN_SCORE;
    el.endTitle.textContent = won ? "Você venceu!" : "A Memória venceu!";
    el.endStats.textContent =
      `Placar: CPU ${score.cpu} x ${score.mem} Memória  ·  ` +
      `Perguntas: ${answered} de ${asked} acertadas`;

    el.review.innerHTML = "";
    if (wrongList.length === 0) {
      const p = document.createElement("p");
      p.className = "review-empty";
      p.textContent = asked === 0
        ? "Nenhuma pergunta apareceu: você não deixou nenhum dado passar!"
        : "Você acertou todas as perguntas. Mandou bem!";
      el.review.appendChild(p);
    } else {
      for (const w of wrongList) {
        const item = document.createElement("div");
        item.className = "review-item";
        item.innerHTML = `<div class="q"></div><div class="a"></div><div class="e"></div>`;
        item.querySelector(".q").textContent = w.q;
        item.querySelector(".a").textContent = "Resposta: " + w.options[w.answer];
        item.querySelector(".e").textContent = w.explain;
        el.review.appendChild(item);
      }
    }
    show(el.end);
    el.btnRestart.focus();
  }

  // ---------- Perguntas ----------
  function askQuestion() {
    state = "question";
    current = nextQuestion();
    asked++;
    qTimeLeft = QUESTION_TIME;
    qResolved = false;

    el.qTopic.textContent = current.topic;
    el.qText.textContent = current.q;
    el.qOptions.innerHTML = "";
    current.options.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.className = "option";
      btn.innerHTML = `<span class="num">${i + 1}</span><span></span>`;
      btn.lastChild.textContent = text;
      btn.addEventListener("click", () => answer(i));
      el.qOptions.appendChild(btn);
    });
    hide(el.qFeedback);
    hide(el.btnContinue);
    updateTimerUi();
    show(el.question);
  }

  function answer(choice) {
    if (state !== "question" || qResolved) return;
    qResolved = true;
    const correct = choice === current.answer;
    el.qOptions.querySelectorAll(".option").forEach((b, i) => {
      b.disabled = true;
      if (i === current.answer) b.classList.add("correct");
      else if (i === choice) b.classList.add("wrong");
    });

    el.qFeedback.className = "feedback " + (correct ? "ok" : "bad");
    const body = document.createElement("div");
    if (correct) {
      answered++;
      streak++;
      body.innerHTML = "<b>Acertou!</b> O dado foi recuperado e o ponto foi anulado.";
      if (streak % STREAK_FOR_POWER === 0) {
        powerTime = POWER_DURATION;
        body.innerHTML += `<br><b>${streak} acertos seguidos!</b> Sua raquete ficou maior por ${POWER_DURATION}s.`;
      }
    } else {
      streak = 0;
      score.mem++;
      wrongList.push(current);
      const head = choice === null ? "Tempo esgotado!" : "Errou!";
      body.innerHTML =
        `<b></b> Ponto para a Memória.<br>Resposta certa: <b class="answer"></b><br><span class="explain"></span>`;
      body.querySelector("b").textContent = head;
      body.querySelector(".answer").textContent = current.options[current.answer];
      body.querySelector(".explain").textContent = current.explain;
    }
    el.qFeedback.replaceChildren(body);
    updateHud();
    show(el.qFeedback);
    show(el.btnContinue);
    el.btnContinue.focus();
  }

  function continueAfterQuestion() {
    if (state !== "question" || !qResolved) return;
    hide(el.question);
    if (score.mem >= WIN_SCORE) endGame();
    else resetBall();
  }

  function updateTimerUi() {
    el.qTime.textContent = Math.ceil(qTimeLeft);
    el.qBar.style.width = (qTimeLeft / QUESTION_TIME) * 100 + "%";
    const low = qTimeLeft <= 3;
    el.qBar.classList.toggle("low", low);
    el.qTime.classList.toggle("low", low);
  }

  function updateHud() {
    el.scoreCpu.textContent = score.cpu;
    el.scoreMem.textContent = score.mem;
    el.streak.textContent = `Sequência: ${streak}`;
    if (powerTime > 0) {
      el.powerup.textContent = `Raquete turbinada · ${Math.ceil(powerTime)}s`;
      show(el.powerup);
    } else {
      hide(el.powerup);
    }
  }

  // ---------- Atualização ----------
  function updateScenery(dt) {
    clock += dt;
    for (let i = 0; i < bgBubbles.length; i++) {
      const b = bgBubbles[i];
      b.y -= b.speed * dt;
      b.phase += dt;
      if (b.y < -b.r * 2) bgBubbles[i] = makeBubble(false);
    }
    for (let i = pops.length - 1; i >= 0; i--) {
      const p = pops[i];
      p.t += dt;
      if (p.t > p.life) pops.splice(i, 1);
    }
  }

  function update(dt) {
    if (state === "question") {
      if (!qResolved) {
        qTimeLeft = Math.max(0, qTimeLeft - dt);
        updateTimerUi();
        if (qTimeLeft <= 0) answer(null);
      }
      return;
    }
    if (state !== "playing" && state !== "serve") return;

    // Power-up
    if (powerTime > 0) {
      const before = Math.ceil(powerTime);
      powerTime = Math.max(0, powerTime - dt);
      if (Math.ceil(powerTime) !== before) updateHud();
    }
    const targetH = powerTime > 0 ? PADDLE_H_POWER : PADDLE_H;
    player.h += (targetH - player.h) * Math.min(1, dt * 8);

    // Jogador
    if (keys.up || keys.down) {
      pointerY = null;
      player.y += (keys.down - keys.up) * PLAYER_SPEED * dt;
    } else if (pointerY !== null) {
      player.y += (pointerY - player.y) * Math.min(1, dt * 18);
    }
    player.y = clamp(player.y, player.h / 2, H - player.h / 2);

    // IA (Memória)
    const aiTarget = ball.vx > 0 ? ball.y + ai.aimOffset : H / 2;
    const aiSpeed = AI_SPEED + (ball.speed - BALL_START_SPEED) * 0.25;
    const diff = aiTarget - ai.y;
    if (Math.abs(diff) > 4) ai.y += Math.sign(diff) * Math.min(Math.abs(diff), aiSpeed * dt);
    ai.y = clamp(ai.y, ai.h / 2, H - ai.h / 2);

    if (state === "serve") {
      serveTimer -= dt;
      if (serveTimer <= 0) serve();
      return;
    }

    // Bola
    ball.trail.push({ x: ball.x, y: ball.y });
    if (ball.trail.length > 8) ball.trail.shift();

    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    const r = BALL_SIZE / 2;
    if (ball.y - r < 0) { ball.y = r; ball.vy = Math.abs(ball.vy); }
    if (ball.y + r > H) { ball.y = H - r; ball.vy = -Math.abs(ball.vy); }

    if (ball.vx < 0 && hits(player)) bounce(player, 1);
    if (ball.vx > 0 && hits(ai)) bounce(ai, -1);

    // Pontos
    if (ball.x + r < 0) askQuestion();       // o dado passou pela CPU
    else if (ball.x - r > W) cpuScores();    // o dado passou pela Memória
  }

  function hits(p) {
    const r = BALL_SIZE / 2;
    return ball.x - r < p.x + PADDLE_W && ball.x + r > p.x &&
           ball.y + r > p.y - p.h / 2 && ball.y - r < p.y + p.h / 2;
  }

  function bounce(p, dir) {
    const rel = clamp((ball.y - p.y) / (p.h / 2), -1, 1);
    const angle = rel * (Math.PI / 3); // até 60°
    ball.speed = Math.min(BALL_MAX_SPEED, ball.speed * BALL_SPEEDUP);
    ball.vx = Math.cos(angle) * ball.speed * dir;
    ball.vy = Math.sin(angle) * ball.speed;
    ball.x = dir > 0 ? p.x + PADDLE_W + BALL_SIZE / 2 : p.x - BALL_SIZE / 2;
    pops.push({ x: ball.x, y: ball.y, t: 0, life: 0.45 });
    if (dir > 0) {
      // Quando a bola vai para a Memória, ela "erra a mira" um pouco
      ai.aimOffset = (Math.random() - 0.5) * ai.h * 1.1;
    }
  }

  // ---------- Desenho ----------
  function draw() {
    drawField();
    drawBus();
    drawPaddle(player, powerTime > 0 ? AERO.power : AERO.cpu, "CPU", true);
    drawPaddle(ai, AERO.mem, "MEMÓRIA", false);
    drawTrail();
    drawPops();
    drawBubble(ball.x, ball.y, BALL_SIZE / 2 + 2, 1, true);

    if (state === "serve") {
      ctx.save();
      ctx.font = "600 22px 'Segoe UI', Tahoma, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,50,120,0.6)";
      ctx.shadowBlur = 8;
      ctx.fillText("Enviando dado...", W / 2, H / 2 - 36);
      ctx.restore();
    }
  }

  function drawField() {
    // Água/céu profundo
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0b6fc2");
    g.addColorStop(0.55, "#1a9ee6");
    g.addColorStop(1, "#5fd2ff");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Raios de luz descendo do topo
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 5; i++) {
      const cx = 120 + i * 150 + Math.sin(clock * 0.3 + i) * 30;
      const lg = ctx.createLinearGradient(0, 0, 0, H);
      lg.addColorStop(0, "rgba(255,255,255,0.10)");
      lg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.moveTo(cx - 25, 0);
      ctx.lineTo(cx + 25, 0);
      ctx.lineTo(cx + 110, H);
      ctx.lineTo(cx - 20, H);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // Brilho suave no fundo (horizonte)
    const rg = ctx.createRadialGradient(W / 2, H + 60, 20, W / 2, H + 60, 420);
    rg.addColorStop(0, "rgba(200,255,170,0.45)");
    rg.addColorStop(1, "rgba(200,255,170,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);

    // Bolhas subindo
    for (const b of bgBubbles) {
      drawBubble(b.x + Math.sin(b.phase * 1.3) * 6, b.y, b.r, b.alpha, false);
    }
  }

  function drawBus() {
    // Linha central feita de pequenas bolhas: o "data bus"
    for (let y = 14; y < H; y += 26) {
      const wobble = Math.sin(clock * 2 + y * 0.05) * 1.5;
      drawBubble(W / 2 + wobble, y, 4.5, 0.75, false);
    }
    ctx.save();
    ctx.font = "700 13px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.translate(W / 2 - 18, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("DATA BUS", 0, 0);
    ctx.restore();
  }

  function drawBubble(x, y, r, alpha, isData) {
    ctx.save();
    ctx.globalAlpha = alpha;

    if (isData) {
      ctx.shadowColor = "rgba(255,255,255,0.95)";
      ctx.shadowBlur = 18;
    }
    // Corpo translúcido com borda mais clara
    const body = ctx.createRadialGradient(x, y, r * 0.2, x, y, r);
    if (isData) {
      body.addColorStop(0, "rgba(255,240,200,0.55)");
      body.addColorStop(0.7, "rgba(255,190,90,0.55)");
      body.addColorStop(1, "rgba(255,255,255,0.95)");
    } else {
      body.addColorStop(0, "rgba(255,255,255,0.03)");
      body.addColorStop(0.75, "rgba(190,240,255,0.18)");
      body.addColorStop(1, "rgba(255,255,255,0.75)");
    }
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Contorno fino
    ctx.strokeStyle = isData ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)";
    ctx.lineWidth = isData ? 1.5 : 1;
    ctx.stroke();

    // Reflexo principal
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.ellipse(x - r * 0.35, y - r * 0.4, r * 0.32, r * 0.2, -0.6, 0, Math.PI * 2);
    ctx.fill();
    // Brilho pequeno do lado oposto
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.arc(x + r * 0.45, y + r * 0.45, r * 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawTrail() {
    ball.trail.forEach((t, i) => {
      const k = (i + 1) / ball.trail.length;
      drawBubble(t.x, t.y, (BALL_SIZE / 2) * k * 0.6, k * 0.45, false);
    });
  }

  function drawPops() {
    for (const p of pops) {
      const k = p.t / p.life;
      ctx.save();
      ctx.globalAlpha = 1 - k;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10 + k * 26, 0, Math.PI * 2);
      ctx.stroke();
      // gotinhas
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const d = 12 + k * 30;
        drawBubble(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d, 2.5 * (1 - k) + 1, 1 - k, false);
      }
      ctx.restore();
    }
  }

  function drawPaddle(p, c, label, isPlayer) {
    const x = p.x, y = p.y - p.h / 2, w = PADDLE_W, h = p.h, r = w / 2;
    ctx.save();

    // Brilho externo
    ctx.shadowColor = c.glow;
    ctx.shadowBlur = isPlayer && powerTime > 0 ? 26 : 14;

    // Cápsula de vidro colorido
    const g = ctx.createLinearGradient(x, 0, x + w, 0);
    g.addColorStop(0, c.dark);
    g.addColorStop(0.45, c.mid);
    g.addColorStop(1, c.dark);
    ctx.fillStyle = g;
    capsule(x, y, w, h, r);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Contorno branco
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Faixa de reflexo
    const hl = ctx.createLinearGradient(x, 0, x + w, 0);
    hl.addColorStop(0, "rgba(255,255,255,0.0)");
    hl.addColorStop(0.3, "rgba(255,255,255,0.85)");
    hl.addColorStop(0.55, "rgba(255,255,255,0.0)");
    ctx.fillStyle = hl;
    capsule(x + 2, y + 4, w - 6, h - 8, (w - 6) / 2);
    ctx.fill();

    // Ponto de luz no topo
    ctx.fillStyle = c.light;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.ellipse(x + w * 0.4, y + 9, w * 0.22, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Rótulo
    ctx.font = "700 12px 'Segoe UI', Tahoma, sans-serif";
    ctx.textAlign = isPlayer ? "left" : "right";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.shadowColor = "rgba(0,40,100,0.6)";
    ctx.shadowBlur = 4;
    const lx = isPlayer ? x + w + 10 : x - 10;
    ctx.fillText(label, lx, p.y + 4);
    ctx.restore();
  }

  function capsule(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ---------- Loop ----------
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    updateScenery(dt);
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  // ---------- Entrada ----------
  window.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k === "ArrowUp" || k === "w" || k === "W") { keys.up = true; e.preventDefault(); }
    if (k === "ArrowDown" || k === "s" || k === "S") { keys.down = true; e.preventDefault(); }

    if (state === "question") {
      if (!qResolved && ["1", "2", "3"].includes(k)) answer(Number(k) - 1);
      else if (qResolved && (k === "Enter" || k === " ")) { e.preventDefault(); continueAfterQuestion(); }
    } else if ((state === "start" || state === "end") && k === "Enter") {
      e.preventDefault();
      newGame();
    }
  });
  window.addEventListener("keyup", (e) => {
    const k = e.key;
    if (k === "ArrowUp" || k === "w" || k === "W") keys.up = false;
    if (k === "ArrowDown" || k === "s" || k === "S") keys.down = false;
  });
  window.addEventListener("blur", () => { keys.up = keys.down = false; });

  function setPointer(e) {
    const rect = canvas.getBoundingClientRect();
    pointerY = ((e.clientY - rect.top) / rect.height) * H;
  }
  canvas.addEventListener("pointerdown", (e) => {
    canvas.setPointerCapture(e.pointerId);
    setPointer(e);
  });
  canvas.addEventListener("pointermove", (e) => {
    // Mouse: segue sempre; toque/caneta: só enquanto arrasta
    if (e.pointerType === "mouse" || e.buttons > 0) setPointer(e);
  });

  el.btnStart.addEventListener("click", newGame);
  el.btnRestart.addEventListener("click", newGame);
  el.btnContinue.addEventListener("click", continueAfterQuestion);

  updateHud();
  requestAnimationFrame(loop);
})();
