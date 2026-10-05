# KeyBaseZone

`blog-v2/docs`의 Markdown 문서와 관련 정적 파일을 유지하며 Astro로 제공하는 웹사이트입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## Cloudflare Workers 배포

Cloudflare Workers의 Git 연결을 `kmbzn/keybasezone` 저장소와 `main` 브랜치에 설정합니다.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`

사이트 주소는 `https://kmbzn.com/`입니다.
