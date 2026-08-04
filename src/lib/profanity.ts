const BLOCKED_WORDS = [
  "씨발", "씨팔", "시발", "개새끼", "개색기", "개색끼", "병신", "지랄", "좆", "존나",
  "개년", "걸레년", "창녀", "보지", "자지", "성기사진", "몸사진", "가슴사진",
  "노출사진", "야동", "야설", "포르노", "조건만남", "원나잇", "성매매",
  "질내사정", "떡치자", "섹스하자", "폰섹", "몸매인증", "가슴인증",
  "fuck", "motherfucker", "dick", "pussy", "porn", "onlyfans", "nudes",
];

const SEPARATOR_RE = /[\s\-_.·,*~^!?/\\]/;

function normalizeForMatch(text: string) {
  const map: number[] = [];
  let compact = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (SEPARATOR_RE.test(ch)) continue;
    compact += ch.toLowerCase();
    map.push(i);
  }
  return { compact, map };
}

export function containsProfanity(text: string): boolean {
  if (!text) return false;
  const { compact } = normalizeForMatch(text);
  return BLOCKED_WORDS.some((word) => compact.includes(word.toLowerCase()));
}

export function filterProfanity(text: string): string {
  if (!text) return text;
  const { compact, map } = normalizeForMatch(text);
  const mask = new Array(text.length).fill(false);

  for (const word of BLOCKED_WORDS) {
    const needle = word.toLowerCase();
    if (!needle) continue;
    let fromIndex = 0;
    let idx: number;
    while ((idx = compact.indexOf(needle, fromIndex)) !== -1) {
      for (let k = idx; k < idx + needle.length; k++) {
        mask[map[k]] = true;
      }
      fromIndex = idx + needle.length;
    }
  }

  return text
    .split("")
    .map((ch, i) => (mask[i] ? "*" : ch))
    .join("");
}
