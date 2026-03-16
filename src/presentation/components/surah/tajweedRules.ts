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
  | 'madd_lazim'
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
  pronunciation: string; // explicit explanation of how to read the sample
}

// NOTE: These patterns are simplified approximations to demonstrate UI only.
// They are NOT fully accurate tajweed detection.
export const TAJWEED_RULES: TajweedRule[] = [
  // Noon Sakinah & Tanween rules
  {
    key: 'izhar',
    name: 'อิซฮาร (Izhar)',
    description: 'เมื่อ นูนตาย (نْ) หรือ สระตันวีน ( ً ٍ ٌ ) ไปพบกับอักษรคอหอย 6 ตัว (ء ه ع ح غ خ)',
    pronunciation: 'ให้อ่านออกเสียง "นูน" ชัดเจน ห้ามหน่วงเสียง เช่น ฮาดิน (ไม่อ่าน ฮาดิงงง)',
    colorClass: 'text-sky-700',
    pattern: /(?:ن[\u0652\u06DF]?|[\u064B-\u064D])\s*[ءأإآهعحغخ]/g,
    sample: 'مِنْ هَادٍ',
  },
  {
    key: 'ikhfa',
    name: 'อิฆฟาอ์ (Ikhfaa)',
    description: 'เมื่อ นูนตาย หรือ สระตันวีน ไปพบกับอักษร 15 ตัว (เช่น ตะ س, ซีน س, ชีน ش, ดาล د...)',
    pronunciation: 'ให้อ่านซ่อนเสียง นูน ให้คล้ายกับเสียง ง.งู พร้อมกับหน่วงเสียง (ดึงจมูก) 2 จังหวะ เช่น มิงงง-ชัรฺริ (ไม่อ่าน มิน-ชัรฺริ)',
    colorClass: 'text-rose-600',
    pattern: /(?:ن[\u0652\u06DF]?|[\u064B-\u064D])\s*[تثجدذزسشصضطظفقك]/g,
    sample: 'مِنْ شَرِّ',
  },
  {
    key: 'iqlab',
    name: 'อิกลาบ (Iqlab)',
    description: 'เมื่อ นูนตาย หรือ ตันวีน ไปพบกับตัว บา (ب) จะถูกแปลงเสียงเป็นตัว มีม (م) แทน (มักมีอักษร มีม เล็กๆ กำกับ)',
    pronunciation: 'ให้อ่านออกเสียงเป็นตัว "มีม" และต้องหน่วงเสียง 2 จังหวะ เช่น อัมมม-บิอ์ฮุม (ไม่อ่าน อัน-บิอ์ฮุม)',
    colorClass: 'text-amber-600',
    pattern: /(?:ن[\u0652\u06DF\u06E2]?|[\u064B-\u064D]\u06E2?)\s*ب/g,
    sample: 'أَنْبِئْهُمْ',
  },
  {
    key: 'idgham_ghunnah',
    name: 'อิดฆอม บิฆ็อนนะฮ์ (Idgham with Ghunnah)',
    description: 'เมื่อ นูนตาย หรือ ตันวีน พบตัว (ي ن م و)',
    pronunciation: 'ให้อ่านรวบกล้ำตัว นูน เข้าไปในพยัญชนะนั้นๆ พร้อมหน่วงเสียงลงจมูก 2 จังหวะ เช่น มิววว-วะร็ออ์ (ไม่อ่าน มิน-วะร็ออ์)',
    colorClass: 'text-emerald-600',
    pattern: /(?:ن[\u0652\u06DF]?|[\u064B-\u064D])\s*[ينمو]/g,
    sample: 'مِنْ نُورٍ',
  },
  {
    key: 'idgham_no_ghunnah',
    name: 'อิดฆอม บิลาฆ็อนนะฮ์ (Idgham without Ghunnah)',
    description: 'เมื่อ นูนตาย หรือ ตันวีน พบตัว ลาม (ل) หรือ รอ (ر)',
    pronunciation: 'ให้อ่านรวบข้ามเสียง นูน ไปเลย โดย "ไม่ต้องหน่วงเสียง" เช่น มิร-ร็อบบิฮิม (ไม่อ่าน มิรรรร-ร็อบบิฮิม)',
    colorClass: 'text-green-700',
    pattern: /(?:ن[\u0652\u06DF]?|[\u064B-\u064D])\s*[لر]/g,
    sample: 'مِنْ رَبِّهِمْ',
  },

  // Meem Sakinah rules (Shafawiyyah)
  {
    key: 'ikhfa_shafawi',
    name: 'อิฆฟาอ์ ชะฟะวีย์ (Ikhfaa Shafawi)',
    description: 'เมื่อ มีมตาย (مْ) ไปพบกับตัว บา (ب)',
    pronunciation: 'ให้อ่านออกเสียง มีม แบบริมฝีปากแตะกันเบาๆ (หลวมๆ) และหน่วงเสียง 2 จังหวะ',
    colorClass: 'text-pink-600',
    pattern: /م[\u0652\u06DF]?\s*ب/g,
    sample: 'لَهُمْ بِنَبَإٍ',
  },
  {
    key: 'idgham_shafawi',
    name: 'อิดฆอม ชะฟะวีย์ (Idgham Shafawi)',
    description: 'เมื่อ มีมตาย (مْ) ไปพบกับตัว มีม (م) ดัวถัดไป',
    pronunciation: 'ให้อ่านรวบ มีม สองตัวนี้ให้เป็นตัวเดียวกัน (เสมือนมีตัชดีด ّ กำกับ) และหน่วงเสียง 2 จังหวะ',
    colorClass: 'text-fuchsia-700',
    pattern: /م[\u0652\u06DF]?\s*م/g,
    sample: 'كُنْتُمْ مُؤْمِنِينَ',
  },
  {
    key: 'izhar_shafawi',
    name: 'อิซฮาร ชะฟะวีย์ (Izhar Shafawi)',
    description: 'เมื่อ มีมตาย (مْ) ไปพบกับตัวอักษรใดก็ได้ (ยกเว้น ب และ م)',
    pronunciation: 'ให้อ่านออกเสียง มีม ให้ชัดเจน โดยเม้มริมฝีปากสนิท และไม่ต้องหน่วงเสียง',
    colorClass: 'text-cyan-700',
    pattern: /م[\u0652\u06DF]\s*(?![بم])/g,
    sample: 'عَلَيْهِمْ قِتَالٌ',
  },

  // Lam rules
  {
    key: 'lam_shamsiyyah',
    name: 'ลาม ชัมซียะฮ์ (Lam Shamsiyyah)',
    description: 'เมื่อคำว่า "อัล" (ال) นำหน้าพยัญชนะอาทิตย์ (จะมีตัชดีด ّ กำกับบนอักษรตัวถัดไป)',
    pronunciation: 'ให้อ่านกระโดดข้ามตัว "ลาม" ไปเลย นำตัวอักษรข้างหน้าไปรวบกล้ำเน้นหนักกับพยัญชนะอาทิตย์แทน เช่น อัช-ชัมสฺ (ไม่อ่าน อัล-ชัมสฺ)',
    colorClass: 'text-orange-600',
    pattern: /[اأإآٱ]ل[\u0652\u06DF\u06E1]?(?=\s*[تثدذرزسشصضطظلن])/g,
    sample: 'الشَّمْسُ',
  },
  {
    key: 'lam_qamariyyah',
    name: 'ลาม กอมะรียะฮ์ (Lam Qamariyyah)',
    description: 'เมื่อคำว่า "อัล" (ال) นำหน้าพยัญชนะดวงจันทร์ (ปกติจะมีสุกูน ْ กำกับอยู่บนตัวลาม)',
    pronunciation: 'ให้ "อ่านออกเสียง ลามตาย (ล.ลิง สะกด)" อย่างชัดเจน ไม่ต้องรวบกล้ำ เช่น อัล-กอมัร',
    colorClass: 'text-teal-700',
    pattern: /[اأإآٱ]ل[\u0652\u06DF\u06E1]?(?=\s*[أإآابجحخعغفقكمهويءؤئ])/g,
    sample: 'الْقَمَرُ',
  },

    // Madd rules (simplified)
  {
    key: 'madd_muttasil',
    name: 'มัด มุตตะศิล (Madd Muttasil)',
    description: 'เสียงยาวพบกับฮัมซะฮ์ (ء) โดยอยู่ในคำเดียวกัน (สัญลักษณ์คลื่นจะอยู่บนหัวสระยาว)',
    pronunciation: 'ให้อ่านลากเสียงยาว 4 ถึง 5 ฮะเราะกะฮ์ (จังหวะนิ้ว)',
    colorClass: 'text-indigo-600',
    pattern: /[اويى\u0670][\u0653\u06E4]?\s*[ءأإآؤئ]/g,
    sample: 'سَوَاءً',
  },
  {
    key: 'madd_munfasil',
    name: 'มัด มุนฟะศิล (Madd Munfasil)',
    description: 'เสียงยาวท้ายคำพบกับฮัมซะฮ์ (ء) ที่ขึ้นต้นคำถัดไป (สัญลักษณ์คลื่นยาวๆ อยู่คนละคำกัน)',
    pronunciation: 'อนุโลมให้อ่านลากยาวได้ 2, 4 หรือ 5 ฮะเราะกะฮ์',
    colorClass: 'text-indigo-800',
    pattern: /[اويى\u0670][\u0653\u06E4]?\s+[ءأإآؤئ]/g,
    sample: 'فِي أَنْفُسِهِمْ',
  },
  {
    key: 'madd_lazim',
    name: 'มัด ลาซิม (Madd Lazim)',
    description: 'สระยาวที่มีเครื่องหมายคล้ายคลื่นหนา ( ٓ ) กำกับอยู่ด้านบน',
    pronunciation: 'บังคับ! ให้อ่านลากเสียงยาวให้สุดถึง 6 ฮะเราะกะฮ์ (จังหวะ)',
    colorClass: 'text-rose-800',
    pattern: /[اويى\u0670][\u0653\u06E4]/g,
    sample: 'الضَّالِّينَ',
  },
  {
    key: 'madd_lin',
    name: 'มัด ลีน (Madd Lin)',
    description: 'ขณะหยุดพักการอ่านตรงคำที่มี วาวตาย (وْ) หรือ ยาตาย (يْ) ที่มีอักษรพยัญชนะสระอ้า (ฟัตฮะฮ์) นำหน้า',
    pronunciation: 'ให้อ่านลากเสียงเอนลงอ่อนๆ (ลีน) ได้ความยาว 2, 4 หรือ 6 จังหวะ เช่น เคาฟฺ / บัยตฺ',
    colorClass: 'text-violet-700',
    pattern: /\u064E[وي][\u0652\u06DF]/g,
    sample: 'خَوْفٌ / بَيْتٍ',
  },

  // Qalqalah & Ghunnah
  {
    key: 'qalqalah',
    name: 'กอลกอละฮ์ (Qalqalah)',
    description: 'กอลกอละฮ์ คือ พยัญชนะสะท้อนเสียง 5 ตัว (ก๊อฟ ق, ฏอ ط, บา ب, ญีม ج, ดาล د)',
    pronunciation: 'เมื่อตัวอักษร 5 ตัวนี้เป็นตัวสะกดตาย หรืออยู่ท้ายคำขณะหยุดอ่าน จะต้องอัดลมและกระเดาะเสียงคลื่นสะท้อนออกมา เช่น คอ-ลุก (ขย้อนเสียง ก.ไก่ เบาๆ)',
    colorClass: 'text-blue-600',
    pattern: /[قطبجد][\u0652\u06DF\u06E1]/g,
    sample: 'يَقْطَعُونَ',
  },
  {
    key: 'ghunnah',
    name: 'ฆ็อนนะฮ์ (Ghunnah)',
    description: 'เมื่อ นูน (ن) หรือ มีม (م) มีเครื่องหมายตัชดีด ดับเบิ้ล (ّ) กำกับเหนือตัวอักษร',
    pronunciation: 'จะต้องอ่านเน้นหนักที่ตัวอักษรนั้น พร้อมกับหน่วงเสียงขึ้นจมูก 2 จังหวะเสมอ เช่น อินนน-นะ / ษุมมม-มะ',
    colorClass: 'text-purple-600',
    pattern: /[من]\u0651/g,
    sample: 'إِنَّ / ثُمَّ',
  },
];

export function getRuleByKey(key: TajweedRuleKey): TajweedRule | undefined {
  return TAJWEED_RULES.find((r) => r.key === key);
}
