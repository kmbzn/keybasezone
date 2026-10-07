---
cover: "/images/article-covers/os-no-animation.webp"
description: 'Ubuntu의 창 전환 애니메이션을 끄고 데스크톱을 더 간결하고 빠릿하게 사용하는 설정입니다.'
---

# Ubuntu 윈도우 애니메이션 끄기

우분투를 설치한 후 시스템이 묘하게 무겁거나, 더 빠릿한 창 전환을 원하신다면 **애니메이션 효과**를 끄는 것을 시도해볼 수 있습니다.

:::warning
**Just Perfection** extension이 활성화되어 있는 경우 설정이 적용되지 않을 수 있습니다.<br />
이 때는 별도로 GUI 내에서 설정해 주셔야 합니다.
:::

아래 명령어를 터미널에 입력하시면 적용됩니다.

```sh
gsettings set org.gnome.desktop.interface enable-animations false
```