// 起名字库数据
// 根据五行和性别推荐合适的名字

export interface NameSuggestion {
  name: string;
  meaning: string;
  wuXing: string;
  source: string;
}

export interface NameChar {
  char: string;
  meaning: string;
}

// 按五行分类的字库
export const nameCharsByElement: Record<string, NameChar[]> = {
  "木": [
    { char: "林", meaning: "草木丛生" },
    { char: "森", meaning: "繁盛茂密" },
    { char: "梓", meaning: "良木，故乡" },
    { char: "桐", meaning: "梧桐，高洁" },
    { char: "楠", meaning: "楠木，珍贵" },
    { char: "柏", meaning: "柏树，坚贞" },
    { char: "楷", meaning: "楷模，正直" },
    { char: "栩", meaning: "生动传神" },
    { char: "槿", meaning: "木槿花" },
    { char: "萱", meaning: "忘忧草" },
    { char: "芷", meaning: "香草，清雅" },
    { char: "芮", meaning: "初生草木" },
    { char: "茉", meaning: "茉莉花" },
    { char: "薇", meaning: "蔷薇花" },
    { char: "枫", meaning: "枫叶，飘逸" },
  ],
  "火": [
    { char: "炎", meaning: "光明炽盛" },
    { char: "焱", meaning: "火光闪耀" },
    { char: "烨", meaning: "光辉灿烂" },
    { char: "灿", meaning: "光彩耀眼" },
    { char: "炜", meaning: "光明鲜明" },
    { char: "熠", meaning: "光耀闪烁" },
    { char: "熙", meaning: "光明兴盛" },
    { char: "煜", meaning: "照耀光亮" },
    { char: "晖", meaning: "阳光光辉" },
    { char: "昭", meaning: "光明美好" },
    { char: "瑶", meaning: "美玉" },
    { char: "宁", meaning: "安宁祥和" },
    { char: "彤", meaning: "红色，热情" },
    { char: "曦", meaning: "晨曦阳光" },
    { char: "暖", meaning: "温暖" },
  ],
  "土": [
    { char: "坤", meaning: "大地厚德" },
    { char: "坦", meaning: "平坦宽厚" },
    { char: "培", meaning: "培育滋养" },
    { char: "垚", meaning: "土高耸" },
    { char: "墨", meaning: "文墨深厚" },
    { char: "垣", meaning: "城墙守护" },
    { char: "城", meaning: "坚固安稳" },
    { char: "轩", meaning: "高远气宇" },
    { char: "宇", meaning: "宇宙广阔" },
    { char: "安", meaning: "平安安定" },
    { char: "韵", meaning: "韵律和谐" },
    { char: "怡", meaning: "愉悦和乐" },
    { char: "岚", meaning: "山间云雾" },
    { char: "婉", meaning: "温婉柔美" },
    { char: "容", meaning: "从容包容" },
  ],
  "金": [
    { char: "鑫", meaning: "财富兴盛" },
    { char: "铭", meaning: "铭记不忘" },
    { char: "锦", meaning: "锦绣美好" },
    { char: "钰", meaning: "珍宝美玉" },
    { char: "锐", meaning: "锐意进取" },
    { char: "铠", meaning: "铠甲坚强" },
    { char: "铮", meaning: "铁骨铮铮" },
    { char: "钧", meaning: "重量权威" },
    { char: "铎", meaning: "振铎教化" },
    { char: "瑞", meaning: "祥瑞吉兆" },
    { char: "诗", meaning: "诗意美好" },
    { char: "悦", meaning: "喜悦快乐" },
    { char: "舒", meaning: "舒畅从容" },
    { char: "珊", meaning: "珊瑚珍宝" },
    { char: "锦", meaning: "锦绣前程" },
  ],
  "水": [
    { char: "淼", meaning: "水势浩大" },
    { char: "涵", meaning: "涵养深厚" },
    { char: "泽", meaning: "恩泽润泽" },
    { char: "润", meaning: "润泽温和" },
    { char: "瀚", meaning: "浩瀚广大" },
    { char: "澜", meaning: "波澜壮阔" },
    { char: "澄", meaning: "清澈明净" },
    { char: "渊", meaning: "学识渊博" },
    { char: "沛", meaning: "充沛旺盛" },
    { char: "溪", meaning: "溪流清雅" },
    { char: "洛", meaning: "洛水女神" },
    { char: "洁", meaning: "纯洁高雅" },
    { char: "沐", meaning: "沐浴恩泽" },
    { char: "汐", meaning: "夜潮之水" },
    { char: "漪", meaning: "水波涟漪" },
  ],
};

// 古籍取名典故
export const nameSources: Record<string, string[]> = {
  "诗经": [
    "《诗经·周南》：「窈窕淑女，君子好逑」",
    "《诗经·大雅》：「明哲保身，以保其身」",
    "《诗经·卫风》：「如切如磋，如琢如磨」",
    "《诗经·小雅》：「高山仰止，景行行止」",
  ],
  "楚辞": [
    "《楚辞·离骚》：「路漫漫其修远兮，吾将上下而求索」",
    "《楚辞·九歌》：「袅袅兮秋风，洞庭波兮木叶下」",
    "《楚辞·九章》：「余处幽篁兮终不见天」",
  ],
  "唐诗": [
    "李白：「长风破浪会有时，直挂云帆济沧海」",
    "杜甫：「会当凌绝顶，一览众山小」",
    "王维：「行到水穷处，坐看云起时」",
    "苏轼：「但愿人长久，千里共婵娟」",
  ],
  "论语": [
    "《论语》：「学而时习之，不亦说乎」",
    "《论语》：「三人行，必有我师焉」",
    "《论语》：「温故而知新，可以为师矣」",
  ],
};

// 根据八字五行生成起名建议
export function generateNameSuggestions(
  surname: string,
  gender: string,
  missingElements: string[],
  weakElements: string[],
  secondChar: string = "",
  thirdChar: string = "",
): NameSuggestion[] {
  const suggestions: NameSuggestion[] = [];
  const targetElements = [...missingElements, ...weakElements].slice(0, 3);
  if (targetElements.length === 0) {
    targetElements.push("木", "水", "金");
  }

  // 如果用户指定了字，优先使用
  if (secondChar) {
    const fallback = targetElements[0] || "木";
    suggestions.push({
      name: secondChar + (thirdChar || getRandomChar(targetElements)),
      meaning: "自定义用字",
      wuXing: fallback,
      source: "家人指定",
    });
  }

  // 自动生成名字
  const sourceKeys = Object.keys(nameSources);
  for (let i = 0; i < 6; i++) {
    const element = targetElements[i % targetElements.length] || "木";
    const chars = nameCharsByElement[element] || nameCharsByElement["木"];
    const c1 = chars[i % chars.length];
    const c2 = chars[(i + 5) % chars.length];
    const sourceKey = sourceKeys[i % sourceKeys.length];
    const sourceTexts = nameSources[sourceKey];

    if (thirdChar) {
      suggestions.push({
        name: c1.char + thirdChar,
        meaning: `${c1.meaning} + 自定义`,
        wuXing: element,
        source: sourceTexts[i % sourceTexts.length],
      });
    } else {
      suggestions.push({
        name: c1.char + c2.char,
        meaning: `${c1.meaning}、${c2.meaning}`,
        wuXing: element,
        source: sourceTexts[i % sourceTexts.length],
      });
    }
  }

  return suggestions;
}

function getRandomChar(elements: string[]): string {
  const element = elements[0] || "木";
  const chars = nameCharsByElement[element] || nameCharsByElement["木"];
  return chars[Math.floor(Math.random() * chars.length)].char;
}
