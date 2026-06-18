# 모바일 청첩장 (Mobile Wedding Invitation)

A single, vertically-scrolling mobile wedding invitation, built as a **zero-build
static site** (HTML + CSS + vanilla JS). Implemented from the `청첩장 Design System`
handoff bundle (claude.ai/design) — white-toned, quietly elegant, faithful to
standard Korean 청첩장 conventions: muted **rose** accent, soft **gold** ornament,
Korean serif for moments, Pretendard for UI.

## Run

No build step. Open `index.html` directly, or serve the folder:

```sh
python -m http.server 8000
# → http://localhost:8000
```

(Fonts and clipboard work best over `http(s)://` rather than `file://`.)

## Structure

```
index.html          full invitation markup (all sections)
app.js              interactions (calendar, gallery/lightbox, copy, map, share, reveal)
styles/
  styles.css        entry — @imports only
  components.css    component + section styles (ported from the design system)
  tokens/           colors, typography, spacing, effects, fonts, base (verbatim design tokens)
```

## Sections (top → bottom)

표지(Cover) · 모시는 글(Greeting) · 예식 안내(Calendar) · 갤러리(Gallery) ·
오시는 길(Location) · 마음 전하실 곳(Gift/accounts).

## Interactions

- **계좌번호 / 주소 복사** — copy buttons flip to "복사됨".
- **갤러리** — tap a photo → full-screen lightbox. (Esc / tap backdrop to close.)
- **지도** — 카카오맵 JS SDK로 예식 장소를 표시 (appkey 필요, 아래 Caveats 참고). 네이버/카카오/T맵 버튼은 주소 기반 deep-link.
- **공유** — uses the Web Share API where available, else copies the URL.
- Sections fade-and-rise on scroll; respects `prefers-reduced-motion`.

## Customising for a real couple

All content is plain text in `index.html` — edit in place:

- **Names / date / venue** — Cover, Calendar (`data-year/-month/-day/-time`), Location, Footer.
- **Photos** — 대표 사진은 `images/00_main_photo.jpg`, 갤러리는 `app.js`의 `GALLERY` 배열에서 경로를 교체.
- **Map** — `index.html`의 `[data-map]` 블록에서 `data-lat/-lng/-name`을 수정. 카카오맵 SDK `appkey`를 본인 키로 교체 (아래 Caveats 참고). 네이버/카카오/T맵 버튼은 주소 기반 deep-link.
- **Accounts** — edit the rows in the Gift section.

## Deploying to GitHub Pages

This is a zero-build static site, so GitHub Pages serves the files as-is — no Actions/workflow needed.

1. 저장소에 코드를 푸시합니다 (`main` 브랜치).
2. GitHub 저장소 → **Settings → Pages → Build and deployment → Source: Deploy from a branch** 선택.
3. **Branch: `main` / `/ (root)`** 로 저장.
4. 잠시 후 배포 URL 확인:
   - 사용자/조직 페이지: `https://<username>.github.io`
   - 프로젝트 페이지: `https://<username>.github.io/<repo>/`

### Kakao Map 도메인 등록 (필수)

카카오 JS 키는 클라이언트에 공개되는 키라, 보안은 "키 숨김"이 아니라 **도메인 제한**으로 합니다. 등록된 도메인 밖에서는 키가 동작하지 않으므로 제3자가 복사해도 자기 사이트에선 지도가 뜨지 않습니다.

1. [Kakao Developers](https://developers.kakao.com) → 내 애플리케이션 → **앱 설정 → 플랫폼 → Web → 사이트 도메인**.
2. 배포 도메인 등록: `https://<username>.github.io` (도메인 기준이라 프로젝트 경로까지 함께 커버).
3. 로컬 테스트용 `http://localhost:8000` 도 등록.
4. 키가 이미 git 히스토리에 노출됐고 사용을 더 엄격히 막고 싶다면 콘솔에서 **키 재발급** 후 `index.html`의 `appkey` 교체.

## Caveats

- **Fonts load from CDN** (Pretendard via jsDelivr; Nanum Myeongjo / Gowun Batang / Cormorant Garamond via Google Fonts). For an offline build, self-host the `.woff2` files and repoint `styles/tokens/fonts.css`.
- **Kakao Map appkey** — `index.html`의 SDK `<script>`에 JavaScript 키가 들어 있습니다. JS 키는 공개 전제이며, **카카오 콘솔의 Web 도메인 등록**으로 보호합니다. 설정 절차는 위 "Deploying to GitHub Pages" 참고.
