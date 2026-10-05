export type SidebarEntry = { path: string; title: string };
export type SidebarSection = { label?: string; collapsible?: boolean; entries: SidebarEntry[] };

export const sidebar: SidebarSection[] = [
  {
    entries: [
      { path: "/mindscape", title: "Mindscape 🔥" },
      { path: "/musics", title: "Playlist 🎧" },
    ],
  },
  {
    label: "Ubuntu",
    collapsible: false,
    entries: [
      { path: "/os/winemoji", title: "Wine 카카오톡 이모지 깨짐 문제 해결" },
      { path: "/os/dunggeunmo", title: "우분투 GRUB 폰트 변경" },
      { path: "/os/ubuntu_thumbnails", title: "우분투 영상 썸네일 문제 해결" },
      { path: "/os/clipboard_image_kakaotalk_ubuntu", title: "우분투 Wine 카카오톡 사진 이미지 스크린샷 붙여넣기" },
      { path: "/os/wine_without_explorer", title: "Wine 환경에서 카카오톡 실행 시 `explorer.exe` 뜨지 않게 하는 법" },
      { path: "/os/no_animation", title: "Ubuntu 윈도우 애니메이션 끄기" },
    ],
  },
  {
    label: "AI",
    entries: [
      { path: "/ai/gpt-6-sol-luna", title: "GPT-6 Sol·Luna 출시" },
    ],
  },
  {
    label: "Wellness",
    entries: [
      { path: "/wellness/psyllium-husk", title: "차전자피 (Psyllium Husk)" },
      { path: "/wellness/extra-virgin-olive-oil", title: "엑스트라 버진 올리브유 (Extra Virgin Olive Oil)" },
      { path: "/wellness/nasal-irrigation", title: "자가비강세척 (Nasal Irrigation)" },
      { path: "/wellness/ht08", title: "QCY HT08 (MeloBuds Pro Plus)" },
      { path: "/wellness/concerta", title: "콘서타 (Concerta)" },
      { path: "/wellness/inderal", title: "인데놀 (Inderal)" },
      { path: "/wellness/sertraline", title: "설트랄린 (Sertraline)" },
      { path: "/wellness/melatonin", title: "멜라토닌 (Melatonin)" },
      { path: "/wellness/cervical-abrasion", title: "치경부 마모증" },
      { path: "/wellness/barbell-squat", title: "바벨 스쿼트 (Barbell Squat)" },
    ],
  },
  {
    label: "Humanities",
    entries: [
      { path: "/humanities/nordvik", title: "Nordvik, Russia" },
      { path: "/humanities/north-sentinel-island", title: "North Sentinel Island" },
      { path: "/humanities/rongorongo", title: "롱고롱고(Rongorongo)" },
      { path: "/humanities/baroque-music", title: "바로크 음악 (Baroque Music)" },
    ],
  },
  {
    label: "Design",
    entries: [
      { path: "/design/google-icon-redesign-2026", title: "구글의 아이콘 대개편: 6년 만의 실수 인정" },
      { path: "/design/gerald-genta", title: "제럴드 젠타: 럭셔리 스포츠 워치의 창시자" },
      { path: "/design/bauhaus", title: "바우하우스: 현대 디자인의 원점" },
    ],
  },
  {
    label: "Brands",
    entries: [
      { path: "/brands/nomos-glashutte", title: "NOMOS Glashütte" },
      { path: "/brands/frederique-constant", title: "Frédérique Constant" },
      { path: "/brands/kz", title: "KZ" },
      { path: "/brands/aestrua", title: "에스트라 (AESTURA)" },
      { path: "/brands/jinhao", title: "JINHAO (金豪)" },
      { path: "/brands/herman-miller", title: "Herman Miller" },
      { path: "/brands/desker", title: "데스커 (DESKER)" },
      { path: "/brands/musinsa-standard", title: "무신사 스탠다드 (Musinsa Standard)" },
    ],
  },
  {
    label: "Finance",
    entries: [
      { path: "/finance/hyundai-card-zero", title: "현대카드 ZERO" },
      { path: "/finance/shinhan-card-cheum", title: "신한카드 처음" },
      { path: "/finance/sp500-etf", title: "S&P 500 ETF 투자 가이드" },
      { path: "/finance/parking-account-cma", title: "파킹통장 vs CMA 통장" },
      { path: "/finance/berkshire-hathaway", title: "버크셔 해서웨이 (Berkshire Hathaway)" },
      { path: "/finance/bitcoin", title: "비트코인 (Bitcoin)" },
    ],
  },
  {
    label: "Products",
    entries: [
      { path: "/products/audio-interface", title: "오디오 인터페이스 (Audio Interface)" },
      { path: "/products/kurutoga", title: "쿠루토가 (KURUTOGA)" },
      { path: "/products/cx31993-dac", title: "CX31993 DAC 동글" },
      { path: "/products/cleansing-milk", title: "클렌징 밀크 (Cleansing Milk)" },
      { path: "/products/fidget-toy", title: "피젯 토이 (Fidget Toy)" },
      { path: "/products/thinkpad", title: "ThinkPad" },
    ],
  },
  {
    entries: [
      { path: "/tmp", title: "tmp" },
    ],
  },
];
