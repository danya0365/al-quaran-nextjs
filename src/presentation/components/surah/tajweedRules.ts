export type TajweedRuleKey =
  | 'izhar'
  | 'ikhfa'
  | 'iqlab'
  | 'idgham_ghunnah'
  | 'idgham_no_ghunnah'
  | 'ikhfa_shafawi'
  | 'idgham_shafawi'
  | 'izhar_shafawi'
  | 'lam_shamsiyyah'
  | 'lam_qamariyyah'
  | 'madd_muttasil'
  | 'madd_munfasil'
  | 'madd_lin'
  | 'qalqalah'
  | 'ghunnah';

export interface TajweedRule {
  key: TajweedRuleKey;
  name: string;
  description: string;
  colorClass: string; // tailwind text color class
  // Very simplified pattern; real tajweed is contextual and complex.
  // This MVP highlights approximate occurrences for demo purposes.
  pattern: RegExp;
  sample: string; // short readable example for popup
}

// NOTE: These patterns are simplified approximations to demonstrate UI only.
// They are NOT fully accurate tajweed detection.
export const TAJWEED_RULES: TajweedRule[] = [
  // Noon Sakinah & Tanween rules
  {
    key: 'izhar',
    name: 'อิซฮาร (Izhar)',
    description:
      'นูนซากิน/ตันวีน พบอักษรคอหอย (ء ه ع ح غ خ) อ่านชัดถ้อยชัดคำ',
    colorClass: 'text-sky-700',
    pattern: /[\u064B-\u064D\u0652]\s*[ءهعحغخ]/g,
    sample: 'مِنْ هَادٍ',
  },
  {
    key: 'ikhfa',
    name: 'อิฆฟาอ์ (Ikhfaa)',
    description:
      'นูนซากิน/ตันวีน พบ (ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك) ให้อ่านซ่อนเสียง',
    colorClass: 'text-rose-600',
    pattern: /[\u064B-\u064D\u0652]\s*[تثجدذزرزشصضطظفقك]/g,
    sample: 'مِنْ شَرِّ',
  },
  {
    key: 'iqlab',
    name: 'อิกลาบ (Iqlab)',
    description: 'นูนซากิน/ตันวีน พบ บ เปลี่ยนเสียงเป็นมีมพร้อมฆ็อนนะฮ์',
    colorClass: 'text-amber-600',
    pattern: /[\u064B-\u064D\u0652]\s*ب/g,
    sample: 'أَنْبِئْهُمْ',
  },
  {
    key: 'idgham_ghunnah',
    name: 'อิดฆอมมีฆ็อนนะฮ์ (Idgham with Ghunnah)',
    description: 'นูนซากิน/ตันวีน พบ (ي ن م و) ควบกล้ำพร้อมฆ็อนนะฮ์',
    colorClass: 'text-emerald-600',
    pattern: /[\u064B-\u064D\u0652]\s*[ينمو]/g,
    sample: 'مِنْ نُورٍ',
  },
  {
    key: 'idgham_no_ghunnah',
    name: 'อิดฆอมไม่มีฆ็อนนะฮ์ (Idgham without Ghunnah)',
    description: 'นูนซากิน/ตันวีน พบ (ل ر) ควบกล้ำไม่มีฆ็อนนะฮ์',
    colorClass: 'text-green-700',
    pattern: /[\u064B-\u064D\u0652]\s*[لر]/g,
    sample: 'مِنْ رَبِّهِمْ',
  },

  // Meem Sakinah rules (Shafawiyyah)
  {
    key: 'ikhfa_shafawi',
    name: 'อิฆฟาอ์ ชะฟะวีย์ (Ikhfaa Shafawi)',
    description: 'มีมซากิน (مْ) พบ บ ให้อ่านซ่อนเสียงริมฝีปาก',
    colorClass: 'text-pink-600',
    pattern: /م\u0652\s*ب/g,
    sample: 'لَهُمْ بِنَبَإٍ',
  },
  {
    key: 'idgham_shafawi',
    name: 'อิดฆอม ชะฟะวีย์ (Idgham Shafawi)',
    description: 'มีมซากิน (มْ) พบ ม ควบกล้ำพร้อมฆ็อนนะฮ์',
    colorClass: 'text-fuchsia-700',
    pattern: /م\u0652\s*م/g,
    sample: 'كُنْتُمْ مُؤْمِنِينَ',
  },
  {
    key: 'izhar_shafawi',
    name: 'อิซฮาร ชะฟะวีย์ (Izhar Shafawi)',
    description: 'มีมซากิน (มฺ) พบตัวอื่นใดที่ไม่ใช่ บ หรือ ม ให้อ่านชัด',
    colorClass: 'text-cyan-700',
    pattern: /م\u0652(?!\s*[بم])/g,
    sample: 'عَلَيْهِمْ قِتَالٌ',
  },

  // Lam rules
  {
    key: 'lam_shamsiyyah',
    name: 'ลาม ชัมซียะฮ์ (Lam Shamsiyyah)',
    description: 'อัลลาม (ال) ตามด้วยอักษรอาทิตย์ เช่น ت ث د ذ ر ز س ش ص ض ط ظ ل ن',
    colorClass: 'text-orange-600',
    pattern: /ال(?=\s*[تثدذرزسشصضطظلن])/g,
    sample: 'الشَّمْسُ',
  },
  {
    key: 'lam_qamariyyah',
    name: 'ลาม กอมะรียะฮ์ (Lam Qamariyyah)',
    description: 'อัลลาม (ال) ตามด้วยอักษรจันทร์ เช่น أ ب ج ح خ ع غ ف ق ك م ه و ي',
    colorClass: 'text-teal-700',
    pattern: /ال(?=\s*[أابجحخعغفقكمهوي])/g,
    sample: 'الْقَمَرُ',
  },

  // Madd rules (simplified)
  {
    key: 'madd_muttasil',
    name: 'มัด มุตตะศิล (Madd Muttasil)',
    description: 'เสียงยาวกับฮัมซะฮ์ในคำเดียวกัน (รูปแบบอย่างย่อ)',
    colorClass: 'text-indigo-600',
    pattern: /[اوي][^\s]{0,1}ء/g,
    sample: 'سَوَاءً',
  },
  {
    key: 'madd_munfasil',
    name: 'มัด มุนฟะศิล (Madd Munfasil)',
    description: 'เสียงยาวท้ายคำ ตามด้วยฮัมซะฮ์ขึ้นต้นคำถัดไป (อย่างย่อ)',
    colorClass: 'text-indigo-800',
    pattern: /[اوي]\s+ء/g,
    sample: 'فِي أَنْفُسِهِمْ',
  },
  {
    key: 'madd_lin',
    name: 'มัด ลีน (Madd Lin)',
    description: 'ฟัตฮะฮ์ + วาว/ยา ซากิน (َوْ / َيْ) (อย่างย่อ)',
    colorClass: 'text-violet-700',
    pattern: /\u064E[وي]\u0652/g,
    sample: 'خَوْفٌ / بَيْتٍ',
  },

  // Qalqalah & Ghunnah
  {
    key: 'qalqalah',
    name: 'กอลกอละฮ์ (Qalqalah)',
    description: 'พยัญชนะ ق ط ب ج د ที่มีสุกูน มีการสะท้อนเสียงเล็กน้อย',
    colorClass: 'text-blue-600',
    pattern: /[قطبجد]\u0652/g,
    sample: 'يَقْطَعُونَ',
  },
  {
    key: 'ghunnah',
    name: 'ฆ็อนนะฮ์ (Ghunnah)',
    description: 'มฺ/นฺ ที่มีตัชดีด (ّ) ให้ยืดเสียงนาสิก',
    colorClass: 'text-purple-600',
    pattern: /[من]\u0651/g,
    sample: 'إِنَّ / ثُمَّ',
  },
];

export function getRuleByKey(key: TajweedRuleKey): TajweedRule | undefined {
  return TAJWEED_RULES.find((r) => r.key === key);
}
