# Markdown 커버 이미지 규칙

Markdown 문서의 맨 위 YAML frontmatter에서 `cover` 값으로 페이지 상단 커버와 최근 게시물 썸네일을 지정합니다. 본문 첫 이미지와 커버 선택은 서로 독립적입니다.

```yaml
---
title: 문서 제목
cover: "/images/article-covers/example.jpg"
---
```

- 사이트의 `public/` 폴더 안에 있는 이미지는 사이트 루트 기준 경로로 씁니다. 예를 들어 `public/images/example.jpg`는 `cover: "/images/example.jpg"`로 지정합니다.
- 외부 이미지는 전체 `https://...` 주소를 쓸 수 있습니다.
- 커버 이미지를 표시하지 않으려면 `cover: false`로 지정합니다. 본문에 이미지가 있어도 커버에는 나타나지 않습니다.
- `cover`를 생략하거나 빈 값으로 두어도 커버는 표시되지 않습니다. 본문 이미지에서 자동으로 가져오지 않습니다.
- 커버 이미지는 상세 문서의 큰 표지와 홈의 최근 게시물 카드에서 같은 규칙으로 사용됩니다.
