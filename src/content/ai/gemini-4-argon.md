---
title: "Gemini 4 Argon 출시, 복잡한 작업을 끝까지 해결하는 AI"
cover: "/images/article-covers/ai-gemini-4-argon.png"
description: 'Google이 새롭게 공개한 Gemini 4 Argon의 추론·코딩 성능과 실제 활용 사례, API 가격 및 이용 범위를 살펴봅니다.'
---

# Gemini 4 Argon 출시, 복잡한 작업을 끝까지 해결하는 AI

Google이 새롭게 공개한 Gemini 4 Argon의 추론·코딩 성능과 실제 활용 사례, API 가격 및 이용 범위를 살펴봅니다.

---

Google은 2026년 9월 30일 차세대 AI 모델인 **Gemini 4 Argon**을 발표하고, 10월 13일부터 일반 이용자와 개발자를 대상으로 제공하기 시작했습니다. 복잡한 소프트웨어 개발과 금융·법률 분석, 과학 연구, 사이버 보안 등 전문적인 작업을 겨냥한 모델입니다. Google은 Argon이 여러 단계에 걸친 작업에서도 깊이 있는 추론을 유지하고, 실제 업무를 처음부터 끝까지 수행하는 능력을 강화했다고 설명했습니다. [blog.google](https://blog.google/intl/ko-kr/products/gemini-4-argon-kr/)

가장 눈에 띄는 변화는 **최대 100만 토큰의 출력 지원**입니다. 기존 6만 4천 토큰이었던 출력 한도를 크게 늘려, 긴 코드 생성이나 대규모 프로젝트 분석처럼 많은 작업을 연속적으로 처리할 수 있도록 했습니다. 입력과 출력을 합산한 컨텍스트 한도 역시 약 100만 토큰이며, 텍스트뿐 아니라 이미지·영상·오디오·PDF 입력을 지원합니다. 추론 강도는 Low·Medium·High의 세 단계로 조절할 수 있습니다. [blog.google](https://blog.google/intl/ko-kr/products/gemini-4-argon-kr/)

성능 평가에서도 경쟁력을 보여줬습니다. 실제 소프트웨어 엔지니어링 능력을 평가하는 **DeepSWE v1.1에서 77.9%**를 기록해 GPT-6 Astra(74.1%)와 Claude Opus 5.5(74.2%)를 앞섰습니다. 금융·법률·코딩 등 전문 업무를 평가하는 Vals Index에서는 68.9%, 업무 자동화 성능을 측정하는 AutomationBench에서는 51.3%로 1위를 차지했습니다. 긴 영상의 내용을 이해하는 LVBench에서도 91.7%를 기록했습니다. Google이 공개한 벤치마크에 따르면 전문 지식 업무와 장기적인 추론, 멀티모달 이해에서 특히 높은 성능을 보였습니다. [Google DeepMind](https://deepmind.google/models/gemini/)

실제 개발 환경에서도 성과가 공개됐습니다. Google은 Argon을 활용해 Chrome의 수백 개 파일에 걸친 구조 개선 작업을 수개월에서 수주로 단축했다고 밝혔습니다. Google Antigravity를 이용하는 내부 개발팀에서는 AI 에이전트가 작성한 코드의 제출량이 **35% 이상 증가**하고, 코드 변경을 되돌리는 작업은 약 3분의 1 감소했습니다. 또한 Google의 Agent Development Kit(ADK)를 최적화해 긴 세션의 메모리 내 준비 시간을 40% 줄이고, 초기 모듈 로딩 속도를 21% 높였습니다. 이러한 사례는 Argon이 코드를 생성하는 데서 나아가 기존 소프트웨어를 분석하고 개선하는 작업에도 활용되고 있음을 보여줍니다. [blog.google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/)

사이버 보안과 과학 연구도 주요 활용 분야입니다. Argon은 보안 취약점 수정 능력을 평가하는 **CWE-bench v1에서 68%**를 기록하며 공동 1위에 올랐습니다. Google은 신뢰할 수 있는 보안 전문가들에게 Fairwind Program을 통해 별도 버전을 제공하고 있으며, 실제 소프트웨어의 취약점 탐지와 패치 작업에 활용하고 있습니다. 과학 분야에서는 양자 컴퓨팅 알고리즘 최적화와 분자 구조 예측 소프트웨어의 성능 개선에도 사용됐습니다. [blog.google](https://blog.google/intl/ko-kr/products/gemini-4-argon-kr/)

API 가격은 2026년 11월 30일까지 입력 100만 토큰당 **2달러**, 출력 100만 토큰당 **10달러**입니다. 캐시된 입력 토큰에는 95% 할인이 적용됩니다. 12월 1일부터는 입력 100만 토큰당 4달러, 출력 100만 토큰당 20달러로 변경됩니다. 출시 초기에는 Claude Opus 5.5의 표준 API 가격보다 50% 낮은 토큰 단가로 제공되는 셈입니다. API 모델 ID는 `gemini-4-argon`이며, 기본 추론 수준은 Medium으로 설정됩니다. [Google AI for Developers](https://ai.google.dev/gemini-api/docs/latest-model?hl=en)

Gemini 4 Argon은 **Google AI Pro 및 Ultra 구독자**에게 Gemini 앱과 Google 검색의 AI 모드로 제공됩니다. 개발자는 유료 Gemini API와 Google AI Studio에서 사용할 수 있으며, Ultra 구독자는 Google Antigravity의 데스크톱 앱과 CLI에서도 이용할 수 있습니다. Gemini 앱에는 채팅에서 작업 모드로 전환하는 기능과 백그라운드 작업 기능도 추가됐습니다. Google은 앞으로 Gemini 4 제품군의 다른 모델도 선보일 계획입니다. [blog.google](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/)

---

### 공식 자료 및 이미지

- [Google: Gemini 4 Argon 공식 발표 및 대표 이미지](https://blog.google/intl/ko-kr/products/gemini-4-argon-kr/) — 파란색 배경의 공식 이미지와 DeepSWE, Vals Index 등 벤치마크 그래프가 포함돼 있습니다.
- [Google DeepMind: Gemini 4 Argon 전체 벤치마크 비교표](https://deepmind.google/models/gemini/#performance) — GPT-6 Astra, Claude Fable 5.1, Claude Opus 5.5와 비교한 공식 성능표입니다.
- [Google: Gemini 4 Argon 정식 출시 발표](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/) — 10월 13일 공개된 실제 활용 사례와 개발 성과를 확인할 수 있습니다.
- [Google AI for Developers: Gemini 4 Argon 모델 안내](https://ai.google.dev/gemini-api/docs/latest-model) — API 가격, 토큰 한도, 추론 설정 및 개발 문서입니다.
