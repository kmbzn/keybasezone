---
title: "PHP2Shell, AI가 찾아낸 치명적인 PHP 취약점"
description: "AI를 활용해 발견한 PHP2Shell 취약점 두 건과 실제 공격 동향, 긴급 보안 업데이트를 정리합니다."
cover: "/images/article-covers/ai-php2shell-cover.png"
published: "2026-10-22"
---

# PHP2Shell, AI가 찾아낸 치명적인 PHP 취약점

2026년 10월 21일, PHP에서 두 건의 치명적인 보안 취약점이 공개됐습니다. **PHP2Shell**로 알려진 이번 취약점은 CVE-2026-109618과 CVE-2026-109619이며, 모두 CVSS v4.0 기준 9.2점의 긴급(Critical) 등급입니다. [PHP 공식 보안 공지](https://www.php.net/archive/2026.php#2026-10-21-5)

공격자는 별도의 로그인 없이 취약한 서버에서 악성 코드를 실행할 수 있습니다. 특히 Apache의 `mod_php` 환경에서는 웹 애플리케이션 코드가 실행되기도 전에 공격할 수 있는 사례가 확인됐습니다. PHP-FPM을 비롯해 웹 요청을 처리하는 다른 PHP 환경도 점검 대상입니다. [PHP 공식 보안 공지](https://www.php.net/archive/2026.php#2026-10-21-5)

[![PHP 공식 로고](/images/article-covers/ai-php2shell.png)](https://www.php.net/archive/2026.php#2026-10-21-5)

*본문 이미지: PHP Group / Colin Viebrock, [PHP 공식 로고](https://www.php.net/download-logos.php), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). 원본 파일을 수정 없이 사용했습니다.*

## AI가 발견과 검증을 도운 취약점

이번 사례에서 눈에 띄는 점은 **연구진이 AI를 활용해 오랫동안 숨어 있던 취약점을 찾아냈다**는 것입니다. Wiz Research는 Wiz Atlas, Gemini 4 Argon, GPT-5.6 Sol을 연구에 사용했으며, 특히 Gemini 4 Argon이 취약점 발견과 공격 코드 개발, 공격 탐지, 패치 검증에 기여했다고 설명했습니다. 공개 전에는 PHP 개발팀, Calif, OpenAI 등과 함께 발견 내용을 조율하고 패치를 검증했습니다. [Wiz Research 보고서](https://www.wiz.io/blog/php2shell-php-rce)

연구진에 따르면 관련 결함은 PHP 코드에 10년 넘게 존재했습니다. 여러 메모리 결함을 연결하고 실행 환경에 맞춰 공격을 재현하는 과정은 복잡했지만, AI가 분석과 반복적인 테스트를 도우면서 실제 악용 가능성을 입증할 수 있었습니다. AI가 취약점을 찾아 고치는 데 기여하는 동시에, 복잡한 공격을 구현하는 데 필요한 시간도 줄일 수 있음을 보여준 사례입니다. [Wiz Research 보고서](https://www.wiz.io/blog/php2shell-php-rce)

## 공개 전부터 관측된 공격

AWS는 공식 발표보다 나흘 앞선 **10월 17일의 공격 시도**를 MadPot 허니팟 관측 자료에서 확인했습니다. 다만 공개 전 관측된 시도가 실제 운영 환경에서 성공했을지는 불분명하다고 밝혔습니다. 21일 취약점과 패치가 공개된 뒤에는 실제 공격 활동이 광범위하게 확인됐습니다. [AWS 공격 관측 보고서](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/)

## PHP 업데이트가 필요합니다

PHP 개발팀은 다음과 같은 긴급 보안 업데이트를 배포했습니다.

| 사용 중인 계열 | 보안 업데이트 버전 |
| --- | --- |
| PHP 8.2 | **8.2.35** |
| PHP 8.3 | **8.3.36** |
| PHP 8.4 | **8.4.27** |
| PHP 8.5 | **8.5.12** |

PHP 8.1 이하 버전은 PHP 프로젝트의 공식 보안 지원이 종료된 상태입니다. 일부 배포판과 장기 지원 업체는 수정 사항을 별도로 제공하므로 해당 업체의 패키지 공지도 확인해야 합니다. [PHP 공식 보안 공지](https://www.php.net/archive/2026.php#2026-10-21-5)

Cloudflare 역시 이번 공격에 대응하는 WAF 보호 규칙을 배포했습니다. 하지만 WAF는 추가적인 방어 수단이며, 취약점 자체를 해결하려면 **서버의 PHP를 업데이트해야 합니다**. 웹사이트 코드나 플러그인만 업데이트하는 것으로는 해결되지 않습니다. [Cloudflare 대응 발표](https://blog.cloudflare.com/php-vulnerabilities-waf-protection/)

참고로 이 블로그(KeyBaseZone)는 Astro와 Cloudflare 기반의 정적 사이트로 운영되어 이번 PHP 취약점의 직접적인 영향은 받지 않습니다.

## 참고 자료

- [PHP 공식 보안 공지](https://www.php.net/archive/2026.php#2026-10-21-5)
- [Wiz Research: AI를 활용한 PHP2Shell 발견과 검증](https://www.wiz.io/blog/php2shell-php-rce)
- [AWS 공격 관측 보고서](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/)
- [Cloudflare 대응 발표](https://blog.cloudflare.com/php-vulnerabilities-waf-protection/)
