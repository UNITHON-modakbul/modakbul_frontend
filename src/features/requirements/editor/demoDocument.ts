export const demoEditorDocument = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DemoForge Preview</title>
    <style>
      * { box-sizing: border-box; }
      html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; }
      body { font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif; background: #fffaf1; color: #17332f; }
      .page { position: relative; width: 100%; height: 100%; overflow: hidden; }
      .header-line { position: absolute; inset: 0 0 auto; height: 15%; border-bottom: 1px solid rgba(23,51,47,.1); }
      .movable { position: absolute; transform-origin: top left; touch-action: none; }
      .brand-mark { left: 5%; top: 4%; width: 4%; aspect-ratio: 1; display: grid; place-items: center; border-radius: 24%; background: #17332f; color: #d9ef7d; font: 900 clamp(7px,1.1vw,16px) monospace; }
      .brand-name { left: 10%; top: 6%; font-size: clamp(10px,1.4vw,21px); font-weight: 900; white-space: nowrap; }
      .nav { top: 6.5%; color: rgba(23,51,47,.55); font-size: clamp(7px,.85vw,12px); font-weight: 800; white-space: nowrap; }
      .nav-intro { left: 74%; } .nav-process { left: 84%; } .nav-faq { left: 94%; }
      .hero-title { left: 7%; top: 25%; width: 52%; margin: 0; font-size: clamp(28px,5vw,74px); font-weight: 950; line-height: .98; letter-spacing: -.06em; white-space: pre-line; }
      .hero-title::first-line { color: #17332f; }
      .hero-description { left: 7%; top: 57%; width: 45%; font-size: clamp(9px,1.2vw,17px); font-weight: 650; line-height: 1.7; color: rgba(23,51,47,.58); }
      .button { top: 72%; height: clamp(34px,4.4vw,64px); border-radius: 12px; font: 900 clamp(9px,1.1vw,15px) inherit; cursor: pointer; }
      .primary { left: 7%; width: 19%; border: 0; background: #17332f; color: white; box-shadow: 0 7px 0 #0d2421; }
      .secondary { left: 28%; width: 17%; border: 1px solid rgba(23,51,47,.2); background: white; color: #17332f; }
      .visual { left: 60%; top: 19%; width: 38%; aspect-ratio: 1; border-radius: 50%; background: rgba(217,239,125,.6); }
      .visual-card { position: absolute; inset: 13% 8% 8%; display: grid; place-items: center; transform: rotate(2deg); border: 3px solid #17332f; border-radius: 8%; background: white; box-shadow: 12px 12px 0 #ec6b42; }
      .visual-content { width: 72%; }
      .pill { display: inline-block; padding: 4% 8%; border-radius: 999px; background: #e9f2cc; font-size: clamp(6px,.7vw,10px); font-weight: 900; }
      .line { height: 7px; margin-top: 8%; border-radius: 999px; background: #17332f; }
      .line.muted { width: 78%; height: 5px; margin-top: 5%; opacity: .2; }
      .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 7%; margin-top: 13%; }
      .cards span { aspect-ratio: 1.5; border-radius: 12%; background: #f3f0e7; }
      .cards span:last-child { background: #17332f; }
    </style>
  </head>
  <body>
    <main class="page">
      <div class="header-line"></div>
      <div class="movable brand-mark" data-demoforge-id="home.brand.mark" data-demoforge-label="브랜드 로고" data-demoforge-type="image">D</div>
      <div class="movable brand-name" data-demoforge-id="home.brand.name" data-demoforge-label="브랜드명" data-demoforge-type="text">DemoForge</div>
      <div class="movable nav nav-intro" data-demoforge-id="home.nav.intro" data-demoforge-label="서비스 소개 메뉴" data-demoforge-type="text">서비스 소개</div>
      <div class="movable nav nav-process" data-demoforge-id="home.nav.process" data-demoforge-label="만드는 과정 메뉴" data-demoforge-type="text">만드는 과정</div>
      <div class="movable nav nav-faq" data-demoforge-id="home.nav.faq" data-demoforge-label="FAQ 메뉴" data-demoforge-type="text">FAQ</div>
      <h1 class="movable hero-title" data-demoforge-id="home.hero.title" data-demoforge-label="메인 타이틀" data-demoforge-type="text">아이디어를\n작동하는 데모로</h1>
      <p class="movable hero-description" data-demoforge-id="home.hero.description" data-demoforge-label="설명 텍스트" data-demoforge-type="text">기획서를 올리면 AI가 필요한 질문을 찾고, 답변을 바탕으로 실제 동작하는 서비스를 완성해요.</p>
      <button class="movable button primary" data-demoforge-id="home.cta.primary" data-demoforge-label="데모 만들기 버튼" data-demoforge-type="button">데모 만들기 →</button>
      <button class="movable button secondary" data-demoforge-id="home.cta.secondary" data-demoforge-label="예시 보기 버튼" data-demoforge-type="button">예시 보기</button>
      <div class="movable visual" data-demoforge-id="home.hero.visual" data-demoforge-label="배경 이미지" data-demoforge-type="image">
        <div class="visual-card"><div class="visual-content"><span class="pill">AI BUILD</span><div class="line"></div><div class="line muted"></div><div class="cards"><span></span><span></span></div></div></div>
      </div>
    </main>
    <script src="/demoforge-editor-bridge.js"></script>
  </body>
</html>`
