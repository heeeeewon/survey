const B = window.SURVEY_BUNDLE;
const CONFIG = window.SURVEY_CONFIG || {};
const STORAGE_KEY = "daejin_multilingual_health_survey_responses_v2";
let lang = localStorage.getItem("survey_lang") || "ko";
let surveyStarted = false;
let pendingResponseId = null;
let currentPage = 0;
const rtlLangs = new Set(["ur"]);
const COUNTRY_CODES = "AF AX AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UM UY UZ VU VE VN VG VI WF EH YE ZM ZW".split(" ");
const landingCopy = {
  "ko": {
    "title": "언어를 선택해 주세요",
    "subtitle": "선택한 언어로 설문 안내와 문항이 표시됩니다.",
    "start": "설문 시작",
    "change": "언어 다시 선택"
  },
  "en": {
    "title": "Select Your Language",
    "subtitle": "The survey instructions and questions will be shown in the language you select.",
    "start": "Start Survey",
    "change": "Select Language Again"
  },
  "ru": {
    "title": "Выберите язык",
    "subtitle": "Инструкции и вопросы анкеты будут показаны на выбранном языке.",
    "start": "Начать опрос",
    "change": "Выбрать язык заново"
  },
  "kk": {
    "title": "Тілді таңдаңыз",
    "subtitle": "Сауалнама нұсқаулары мен сұрақтары таңдалған тілде көрсетіледі.",
    "start": "Сауалнаманы бастау",
    "change": "Тілді қайта таңдау"
  },
  "mn": {
    "title": "Хэлээ сонгоно уу",
    "subtitle": "Судалгааны заавар болон асуултууд сонгосон хэлээр харагдана.",
    "start": "Судалгааг эхлүүлэх",
    "change": "Хэлийг дахин сонгох"
  },
  "zh-CN": {
    "title": "请选择语言",
    "subtitle": "问卷说明和题目将以您选择的语言显示。",
    "start": "开始问卷",
    "change": "重新选择语言"
  },
  "uz": {
    "title": "Tilni tanlang",
    "subtitle": "So'rovnoma ko'rsatmalari va savollari tanlangan tilda ko'rsatiladi.",
    "start": "So'rovnomani boshlash",
    "change": "Tilni qayta tanlash"
  },
  "ne": {
    "title": "भाषा छान्नुहोस्",
    "subtitle": "सर्वेक्षणका निर्देशन र प्रश्नहरू तपाईंले छानेको भाषामा देखाइनेछन्।",
    "start": "सर्वेक्षण सुरु गर्नुहोस्",
    "change": "भाषा फेरि छान्नुहोस्"
  },
  "bn": {
    "title": "ভাষা নির্বাচন করুন",
    "subtitle": "জরিপের নির্দেশনা ও প্রশ্নগুলো আপনার নির্বাচিত ভাষায় দেখানো হবে।",
    "start": "জরিপ শুরু করুন",
    "change": "ভাষা আবার নির্বাচন করুন"
  },
  "si": {
    "title": "භාෂාව තෝරන්න",
    "subtitle": "සමීක්ෂණ උපදෙස් සහ ප්‍රශ්න ඔබ තෝරාගත් භාෂාවෙන් පෙන්වනු ලැබේ.",
    "start": "සමීක්ෂණය ආරම්භ කරන්න",
    "change": "භාෂාව නැවත තෝරන්න"
  },
  "ur": {
    "title": "زبان منتخب کریں",
    "subtitle": "سروے کی ہدایات اور سوالات آپ کی منتخب کردہ زبان میں دکھائے جائیں گے۔",
    "start": "سروے شروع کریں",
    "change": "زبان دوبارہ منتخب کریں"
  }
};
const contextualOptions = {
  "basic_10": {
    "ko": {
      "전혀 부담 없음": "전혀 부담 없음",
      "적은 편": "적은 편",
      "보통": "보통",
      "큰 편": "큰 편",
      "매우 큼": "매우 큼"
    },
    "en": {
      "전혀 부담 없음": "No financial burden at all",
      "적은 편": "Slight financial burden",
      "보통": "Moderate financial burden",
      "큰 편": "Heavy financial burden",
      "매우 큼": "Very heavy financial burden"
    },
    "ru": {
      "전혀 부담 없음": "Совсем нет финансовой нагрузки",
      "적은 편": "Небольшая финансовая нагрузка",
      "보통": "Умеренная финансовая нагрузка",
      "큰 편": "Большая финансовая нагрузка",
      "매우 큼": "Очень большая финансовая нагрузка"
    },
    "kk": {
      "전혀 부담 없음": "Қаржылық ауыртпалық мүлде жоқ",
      "적은 편": "Аздаған қаржылық ауыртпалық",
      "보통": "Орташа қаржылық ауыртпалық",
      "큰 편": "Үлкен қаржылық ауыртпалық",
      "매우 큼": "Өте үлкен қаржылық ауыртпалық"
    },
    "mn": {
      "전혀 부담 없음": "Санхүүгийн дарамт огт байхгүй",
      "적은 편": "Бага зэрэг санхүүгийн дарамттай",
      "보통": "Дунд зэргийн санхүүгийн дарамттай",
      "큰 편": "Их санхүүгийн дарамттай",
      "매우 큼": "Маш их санхүүгийн дарамттай"
    },
    "zh-CN": {
      "전혀 부담 없음": "完全没有经济负担",
      "적은 편": "经济负担较轻",
      "보통": "中等经济负担",
      "큰 편": "经济负担较重",
      "매우 큼": "经济负担非常重"
    },
    "uz": {
      "전혀 부담 없음": "Moliyaviy yuklama umuman yo'q",
      "적은 편": "Yengil moliyaviy yuklama",
      "보통": "O'rtacha moliyaviy yuklama",
      "큰 편": "Og'ir moliyaviy yuklama",
      "매우 큼": "Juda og'ir moliyaviy yuklama"
    },
    "ne": {
      "전혀 부담 없음": "आर्थिक बोझ पटक्कै छैन",
      "적은 편": "हल्का आर्थिक बोझ",
      "보통": "मध्यम आर्थिक बोझ",
      "큰 편": "धेरै आर्थिक बोझ",
      "매우 큼": "अत्यधिक आर्थिक बोझ"
    },
    "bn": {
      "전혀 부담 없음": "কোনো আর্থিক বোঝা নেই",
      "적은 편": "সামান্য আর্থিক বোঝা",
      "보통": "মাঝারি আর্থিক বোঝা",
      "큰 편": "বেশি আর্থিক বোঝা",
      "매우 큼": "খুব বেশি আর্থিক বোঝা"
    },
    "si": {
      "전혀 부담 없음": "මූල්‍ය බරපැන කිසිසේත් නැත",
      "적은 편": "සුළු මූල්‍ය බරපැනක්",
      "보통": "මධ්‍යම මූල්‍ය බරපැනක්",
      "큰 편": "වැඩි මූල්‍ය බරපැනක්",
      "매우 큼": "ඉතා වැඩි මූල්‍ය බරපැනක්"
    },
    "ur": {
      "전혀 부담 없음": "مالی بوجھ بالکل نہیں",
      "적은 편": "ہلکا مالی بوجھ",
      "보통": "درمیانہ مالی بوجھ",
      "큰 편": "زیادہ مالی بوجھ",
      "매우 큼": "بہت زیادہ مالی بوجھ"
    }
  },
  "pss": {
    "ko": {
      "0 전혀 아니다": "0 전혀 아니다",
      "1 거의 아니다": "1 거의 아니다",
      "2 가끔": "2 가끔",
      "3 꽤 자주": "3 꽤 자주",
      "4 매우 자주": "4 매우 자주"
    },
    "en": {
      "0 전혀 아니다": "0 Never",
      "1 거의 아니다": "1 Almost never",
      "2 가끔": "2 Sometimes",
      "3 꽤 자주": "3 Fairly often",
      "4 매우 자주": "4 Very often"
    },
    "ru": {
      "0 전혀 아니다": "0 Никогда",
      "1 거의 아니다": "1 Почти никогда",
      "2 가끔": "2 Иногда",
      "3 꽤 자주": "3 Довольно часто",
      "4 매우 자주": "4 Очень часто"
    },
    "kk": {
      "0 전혀 아니다": "0 Ешқашан",
      "1 거의 아니다": "1 Сирек",
      "2 가끔": "2 Кейде",
      "3 꽤 자주": "3 Жиі",
      "4 매우 자주": "4 Өте жиі"
    },
    "mn": {
      "0 전혀 아니다": "0 Хэзээ ч үгүй",
      "1 거의 아니다": "1 Бараг үгүй",
      "2 가끔": "2 Заримдаа",
      "3 꽤 자주": "3 Нэлээд олон удаа",
      "4 매우 자주": "4 Маш олон удаа"
    },
    "zh-CN": {
      "0 전혀 아니다": "0 从不",
      "1 거의 아니다": "1 几乎从不",
      "2 가끔": "2 有时",
      "3 꽤 자주": "3 经常",
      "4 매우 자주": "4 很经常"
    },
    "uz": {
      "0 전혀 아니다": "0 Hech qachon",
      "1 거의 아니다": "1 Deyarli hech qachon",
      "2 가끔": "2 Ba'zan",
      "3 꽤 자주": "3 Tez-tez",
      "4 매우 자주": "4 Juda tez-tez"
    },
    "ne": {
      "0 전혀 아니다": "0 कहिल्यै होइन",
      "1 거의 아니다": "1 प्रायः कहिल्यै होइन",
      "2 가끔": "2 कहिलेकाहीँ",
      "3 꽤 자주": "3 प्रायः",
      "4 매우 자주": "4 धेरै प्रायः"
    },
    "bn": {
      "0 전혀 아니다": "0 কখনো নয়",
      "1 거의 아니다": "1 প্রায় কখনো নয়",
      "2 가끔": "2 কখনো কখনো",
      "3 꽤 자주": "3 বেশ প্রায়ই",
      "4 매우 자주": "4 খুব প্রায়ই"
    },
    "si": {
      "0 전혀 아니다": "0 කිසිදා නැත",
      "1 거의 아니다": "1 ඉතා කලාතුරකින්",
      "2 가끔": "2 සමහර විට",
      "3 꽤 자주": "3 තරමක් නිතර",
      "4 매우 자주": "4 ඉතා නිතර"
    },
    "ur": {
      "0 전혀 아니다": "0 کبھی نہیں",
      "1 거의 아니다": "1 تقریباً کبھی نہیں",
      "2 가끔": "2 کبھی کبھار",
      "3 꽤 자주": "3 کافی اکثر",
      "4 매우 자주": "4 بہت اکثر"
    }
  },
  "assis": {
    "ko": {
      "1 전혀 그렇지 않다": "1 전혀 그렇지 않다",
      "2 그렇지 않다": "2 그렇지 않다",
      "3 보통이다": "3 보통이다",
      "4 그렇다": "4 그렇다",
      "5 매우 그렇다": "5 매우 그렇다"
    },
    "en": {
      "1 전혀 그렇지 않다": "1 Strongly disagree",
      "2 그렇지 않다": "2 Disagree",
      "3 보통이다": "3 Neutral",
      "4 그렇다": "4 Agree",
      "5 매우 그렇다": "5 Strongly agree"
    },
    "ru": {
      "1 전혀 그렇지 않다": "1 Совершенно не согласен",
      "2 그렇지 않다": "2 Не согласен",
      "3 보통이다": "3 Нейтрально",
      "4 그렇다": "4 Согласен",
      "5 매우 그렇다": "5 Полностью согласен"
    },
    "kk": {
      "1 전혀 그렇지 않다": "1 Мүлдем келіспеймін",
      "2 그렇지 않다": "2 Келіспеймін",
      "3 보통이다": "3 Бейтарап",
      "4 그렇다": "4 Келісемін",
      "5 매우 그렇다": "5 Толық келісемін"
    },
    "mn": {
      "1 전혀 그렇지 않다": "1 Огт санал нийлэхгүй",
      "2 그렇지 않다": "2 Санал нийлэхгүй",
      "3 보통이다": "3 Төвийг сахисан",
      "4 그렇다": "4 Санал нийлнэ",
      "5 매우 그렇다": "5 Бүрэн санал нийлнэ"
    },
    "zh-CN": {
      "1 전혀 그렇지 않다": "1 非常不同意",
      "2 그렇지 않다": "2 不同意",
      "3 보통이다": "3 中立",
      "4 그렇다": "4 同意",
      "5 매우 그렇다": "5 非常同意"
    },
    "uz": {
      "1 전혀 그렇지 않다": "1 Mutlaqo rozi emasman",
      "2 그렇지 않다": "2 Rozi emasman",
      "3 보통이다": "3 Neytral",
      "4 그렇다": "4 Roziman",
      "5 매우 그렇다": "5 To'liq roziman"
    },
    "ne": {
      "1 전혀 그렇지 않다": "1 पूर्ण रूपमा असहमत",
      "2 그렇지 않다": "2 असहमत",
      "3 보통이다": "3 तटस्थ",
      "4 그렇다": "4 सहमत",
      "5 매우 그렇다": "5 पूर्ण रूपमा सहमत"
    },
    "bn": {
      "1 전혀 그렇지 않다": "1 সম্পূর্ণ অসম্মত",
      "2 그렇지 않다": "2 অসম্মত",
      "3 보통이다": "3 নিরপেক্ষ",
      "4 그렇다": "4 একমত",
      "5 매우 그렇다": "5 সম্পূর্ণ একমত"
    },
    "si": {
      "1 전혀 그렇지 않다": "1 සම්පූර්ණයෙන්ම එකඟ නොවෙමි",
      "2 그렇지 않다": "2 එකඟ නොවෙමි",
      "3 보통이다": "3 මධ්‍යස්ථයි",
      "4 그렇다": "4 එකඟයි",
      "5 매우 그렇다": "5 සම්පූර්ණයෙන්ම එකඟයි"
    },
    "ur": {
      "1 전혀 그렇지 않다": "1 بالکل متفق نہیں",
      "2 그렇지 않다": "2 متفق نہیں",
      "3 보통이다": "3 غیر جانبدار",
      "4 그렇다": "4 متفق ہوں",
      "5 매우 그렇다": "5 مکمل طور پر متفق ہوں"
    }
  },
  "phq": {
    "ko": {
      "0 전혀 아니다": "0 전혀 아니다",
      "1 여러날 동안": "1 여러날 동안",
      "2 일주일 이상": "2 일주일 이상",
      "3 거의 매일": "3 거의 매일"
    },
    "en": {
      "0 전혀 아니다": "0 Not at all",
      "1 여러날 동안": "1 Several days",
      "2 일주일 이상": "2 More than half the days",
      "3 거의 매일": "3 Nearly every day"
    },
    "ru": {
      "0 전혀 아니다": "0 Совсем нет",
      "1 여러날 동안": "1 Несколько дней",
      "2 일주일 이상": "2 Более половины дней",
      "3 거의 매일": "3 Почти каждый день"
    },
    "kk": {
      "0 전혀 아니다": "0 Мүлдем емес",
      "1 여러날 동안": "1 Бірнеше күн",
      "2 일주일 이상": "2 Күндердің жартысынан көбі",
      "3 거의 매일": "3 Күн сайын дерлік"
    },
    "mn": {
      "0 전혀 아니다": "0 Огт үгүй",
      "1 여러날 동안": "1 Хэдэн өдөр",
      "2 일주일 이상": "2 Өдрүүдийн талаас илүү",
      "3 거의 매일": "3 Бараг өдөр бүр"
    },
    "zh-CN": {
      "0 전혀 아니다": "0 完全没有",
      "1 여러날 동안": "1 有几天",
      "2 일주일 이상": "2 超过一半的天数",
      "3 거의 매일": "3 几乎每天"
    },
    "uz": {
      "0 전혀 아니다": "0 Umuman emas",
      "1 여러날 동안": "1 Bir necha kun",
      "2 일주일 이상": "2 Kunlarning yarmidan ko'prog'ida",
      "3 거의 매일": "3 Deyarli har kuni"
    },
    "ne": {
      "0 전혀 아니다": "0 पटक्कै होइन",
      "1 여러날 동안": "1 केही दिन",
      "2 일주일 이상": "2 आधाभन्दा बढी दिनहरूमा",
      "3 거의 매일": "3 लगभग हरेक दिन"
    },
    "bn": {
      "0 전혀 아니다": "0 মোটেই নয়",
      "1 여러날 동안": "1 কয়েক দিন",
      "2 일주일 이상": "2 অর্ধেকের বেশি দিনগুলোতে",
      "3 거의 매일": "3 প্রায় প্রতিদিন"
    },
    "si": {
      "0 전혀 아니다": "0 කිසිසේත්ම නැත",
      "1 여러날 동안": "1 දින කිහිපයක්",
      "2 일주일 이상": "2 දිනවලින් අඩකට වඩා",
      "3 거의 매일": "3 දිනපතාම පාහේ"
    },
    "ur": {
      "0 전혀 아니다": "0 بالکل نہیں",
      "1 여러날 동안": "1 کئی دن",
      "2 일주일 이상": "2 آدھے سے زیادہ دنوں میں",
      "3 거의 매일": "3 تقریباً ہر روز"
    }
  }
};

function t(value){ return (B.translations[lang] && B.translations[lang][value]) || value || ""; }
function ui(key){ return t(B.ui[key] || key); }
function lc(key){ return (landingCopy[lang] || landingCopy.en)[key]; }
const pageNavText = {
  "ko": {"previous":"이전","next":"다음","page":"페이지","requiredError":"이 페이지의 필수 항목에 모두 응답해 주세요."},
  "en": {"previous":"Previous","next":"Next","page":"Page","requiredError":"Please answer all required items on this page."},
  "ru": {"previous":"Назад","next":"Далее","page":"Страница","requiredError":"Пожалуйста, ответьте на все обязательные вопросы на этой странице."},
  "kk": {"previous":"Артқа","next":"Келесі","page":"Бет","requiredError":"Осы беттегі барлық міндетті сұрақтарға жауап беріңіз."},
  "mn": {"previous":"Өмнөх","next":"Дараагийн","page":"Хуудас","requiredError":"Энэ хуудсан дахь бүх заавал хариулах асуултад хариулна уу."},
  "zh-CN": {"previous":"上一页","next":"下一页","page":"页","requiredError":"请回答本页所有必填项目。"},
  "uz": {"previous":"Orqaga","next":"Keyingi","page":"Sahifa","requiredError":"Iltimos, ushbu sahifadagi barcha majburiy savollarga javob bering."},
  "ne": {"previous":"अघिल्लो","next":"अर्को","page":"पृष्ठ","requiredError":"कृपया यस पृष्ठका सबै अनिवार्य प्रश्नहरूको उत्तर दिनुहोस्।"},
  "bn": {"previous":"পূর্ববর্তী","next":"পরবর্তী","page":"পৃষ্ঠা","requiredError":"অনুগ্রহ করে এই পৃষ্ঠার সব বাধ্যতামূলক প্রশ্নের উত্তর দিন।"},
  "si": {"previous":"පෙර","next":"ඊළඟ","page":"පිටුව","requiredError":"කරුණාකර මෙම පිටුවේ ඇති සියලුම අනිවාර්ය ප්‍රශ්නවලට පිළිතුරු දෙන්න."},
  "ur": {"previous":"پچھلا","next":"اگلا","page":"صفحہ","requiredError":"براہ کرم اس صفحے کے تمام لازمی سوالات کے جواب دیں۔"}
};
function navText(key){ return (pageNavText[lang] || pageNavText.en)[key] || key; }
function esc(s){ return String(s ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function idSafe(id){ return id.replace(/[^a-zA-Z0-9_-]/g, "_"); }
function allItems(){ return B.survey.sections.flatMap(sec => sec.items); }
function itemById(id){ return allItems().find(item => item.id === id); }
const heatedTobaccoUseOptions = {
  "ko": {
    "매일 피운다": "매일 사용한다",
    "가끔 피운다": "가끔 사용한다",
    "과거에는 피웠으나 현재 피우지 않는다": "과거에는 사용했으나 현재 사용하지 않는다"
  },
  "en": {
    "매일 피운다": "I use it every day",
    "가끔 피운다": "I use it occasionally",
    "과거에는 피웠으나 현재 피우지 않는다": "I used it in the past, but I do not use it now"
  },
  "ru": {
    "매일 피운다": "Я использую это каждый день",
    "가끔 피운다": "Я использую это время от времени",
    "과거에는 피웠으나 현재 피우지 않는다": "Я использовал(а) это раньше, но сейчас не использую"
  },
  "kk": {
    "매일 피운다": "Мен оны күн сайын қолданамын",
    "가끔 피운다": "Мен оны кейде қолданамын",
    "과거에는 피웠으나 현재 피우지 않는다": "Бұрын қолданғанмын, бірақ қазір қолданбаймын"
  },
  "mn": {
    "매일 피운다": "Би үүнийг өдөр бүр хэрэглэдэг",
    "가끔 피운다": "Би үүнийг хааяа хэрэглэдэг",
    "과거에는 피웠으나 현재 피우지 않는다": "Би өмнө нь хэрэглэдэг байсан, одоо хэрэглэхгүй"
  },
  "zh-CN": {
    "매일 피운다": "我每天使用",
    "가끔 피운다": "我偶尔使用",
    "과거에는 피웠으나 현재 피우지 않는다": "我以前使用过，但现在不使用"
  },
  "uz": {
    "매일 피운다": "Men undan har kuni foydalanaman",
    "가끔 피운다": "Men undan vaqti-vaqti bilan foydalanaman",
    "과거에는 피웠으나 현재 피우지 않는다": "Men ilgari undan foydalanganman, hozir foydalanmayman"
  },
  "ne": {
    "매일 피운다": "म यसलाई हरेक दिन प्रयोग गर्छु",
    "가끔 피운다": "म यसलाई कहिलेकाहीँ प्रयोग गर्छु",
    "과거에는 피웠으나 현재 피우지 않는다": "मैले पहिले प्रयोग गर्थेँ, तर अहिले प्रयोग गर्दिनँ"
  },
  "bn": {
    "매일 피운다": "আমি এটি প্রতিদিন ব্যবহার করি",
    "가끔 피운다": "আমি এটি মাঝে মাঝে ব্যবহার করি",
    "과거에는 피웠으나 현재 피우지 않는다": "আমি আগে এটি ব্যবহার করতাম, কিন্তু এখন ব্যবহার করি না"
  },
  "si": {
    "매일 피운다": "මම එය දිනපතා භාවිතා කරමි",
    "가끔 피운다": "මම එය ඉඳහිට භාවිතා කරමි",
    "과거에는 피웠으나 현재 피우지 않는다": "මම පෙර එය භාවිතා කළෙමි, නමුත් දැන් භාවිතා නොකරමි"
  },
  "ur": {
    "매일 피운다": "میں اسے ہر روز استعمال کرتا/کرتی ہوں",
    "가끔 피운다": "میں اسے کبھی کبھار استعمال کرتا/کرتی ہوں",
    "과거에는 피웠으나 현재 피우지 않는다": "میں نے اسے پہلے استعمال کیا تھا، لیکن اب استعمال نہیں کرتا/کرتی"
  }
};
function displayId(id){
  return String(id)
    .replace(/^basic_/, "")
    .replace(/^sleep_/, "")
    .replace(/^pss_/, "")
    .replace(/^assis_/, "")
    .replace(/^lsis_/, "")
    .replace(/^phq_/, "")
    .replace(/^smoking_/, "")
    .replace(/_/g, "-");
}
function optionText(item, opt){
  if(item.id === "smoking_E_3_1"){
    const langOptions = heatedTobaccoUseOptions[lang] || heatedTobaccoUseOptions.en;
    if(langOptions && langOptions[opt]) return langOptions[opt];
  }
  let group = null;
  if(item.id.startsWith("pss_")) group = "pss";
  else if(item.id.startsWith("assis_")) group = "assis";
  else if(item.id.startsWith("phq_")) group = "phq";
  else if(item.id === "basic_10") group = "basic_10";
  const langOptions = group && contextualOptions[group] && (contextualOptions[group][lang] || contextualOptions[group].en);
  if(langOptions && langOptions[opt]) return langOptions[opt];
  return t(opt);
}
function stripTrailingScore(text){
  return String(text).replace(/\s*[\(\uFF08]\s*[0-9\uFF10-\uFF19]+\s*[\)\uFF09]\s*$/u, "");
}
function displayOptionText(item, opt){
  const text = optionText(item, opt);
  return item.id && item.id.startsWith("lsis_") ? stripTrailingScore(text) : text;
}
function countryName(code){
  const hasHangul = text => /[\u3131-\u318e\uac00-\ud7a3]/u.test(String(text || ""));
  try{
    const display = new Intl.DisplayNames([lang, "en"], { type: "region" });
    const localized = display.of(code) || code;
    if(lang !== "ko" && hasHangul(localized)){
      const english = new Intl.DisplayNames(["en"], { type: "region" }).of(code);
      return english || code;
    }
    return localized;
  }catch(err){
    try{
      return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
    }catch(fallbackErr){
      return code;
    }
  }
}
function renderCountrySelect(name){
  const options = COUNTRY_CODES
    .map(code => ({ code, label: countryName(code) }))
    .sort((a, b) => a.label.localeCompare(b.label, lang))
    .map(country => `<option value="${esc(country.code + " - " + country.label)}">${esc(country.label)}</option>`)
    .join("");
  return `<select name="${esc(name)}"><option value="">${esc(ui("selectCountry"))}</option>${options}</select>`;
}
function numberAttributes(source, extra = ""){
  const min = source.min !== undefined ? ` min="${esc(source.min)}"` : "";
  const max = source.max !== undefined ? ` max="${esc(source.max)}"` : "";
  const step = source.step !== undefined ? ` step="${esc(source.step)}"` : "";
  return `type="number" inputmode="numeric" data-number-bounds="1"${extra}${min}${max}${step}`;
}
const zeroMinuteCopy = {
  ko: "분이 0분인 경우에도 분 칸에 0을 입력해 주세요.",
  en: "If the minutes are 0, enter 0 in the minutes field.",
  ru: "Если минут 0, введите 0 в поле минут.",
  kk: "Минут 0 болса да, минут өрісіне 0 енгізіңіз.",
  mn: "Минут 0 байсан ч минутын талбарт 0 гэж оруулна уу.",
  "zh-CN": "如果分钟为0，也请在分钟栏输入0。",
  uz: "Daqiqa 0 bo'lsa ham, daqiqa maydoniga 0 kiriting.",
  ne: "मिनेट ० भए पनि मिनेटको खाली ठाउँमा ० लेख्नुहोस्।",
  bn: "মিনিট ০ হলে মিনিটের ঘরেও ০ লিখুন।",
  si: "විනාඩි 0ක් නම්, විනාඩි කොටුවට 0 ඇතුළත් කරන්න.",
  ur: "اگر منٹ 0 ہوں تو منٹ کے خانے میں بھی 0 درج کریں۔"
};
function zeroMinuteNote(){
  return zeroMinuteCopy[lang] || zeroMinuteCopy.en;
}
const validationCopy = {
  ko: {
    numberRange: "{min}~{max} 범위의 숫자를 입력해 주세요.",
    integer: "정수만 입력해 주세요.",
    minuteAt24: "24시간을 입력한 경우 분은 0분이어야 합니다.",
    otherRequired: "기타를 선택한 경우 기타 내용을 입력해 주세요.",
    detailRequired: "빈도 응답을 선택한 경우 상세 이유를 입력해 주세요.",
    fieldRequired: "이 항목을 입력해 주세요.",
    checkboxRequired: "계속하려면 이 항목에 체크해 주세요.",
    selectRequired: "응답을 선택해 주세요."
  },
  en: {
    numberRange: "Enter a number from {min} to {max}.",
    integer: "Enter a whole number only.",
    minuteAt24: "If the duration is 24 hours, minutes must be 0.",
    otherRequired: "If you select Other, enter the other answer.",
    detailRequired: "If you select a frequency, enter the detailed reason.",
    fieldRequired: "This field is required.",
    checkboxRequired: "Please check this box to continue.",
    selectRequired: "Please select an answer."
  },
  ru: {
    numberRange: "Введите число от {min} до {max}.",
    integer: "Введите только целое число.",
    minuteAt24: "Если указано 24 часа, минуты должны быть 0.",
    otherRequired: "Если выбран вариант «Другое», укажите ответ.",
    detailRequired: "Если выбран вариант частоты, укажите подробную причину.",
    fieldRequired: "Заполните это поле.",
    checkboxRequired: "Чтобы продолжить, установите этот флажок.",
    selectRequired: "Выберите ответ."
  },
  kk: {
    numberRange: "{min}–{max} аралығындағы санды енгізіңіз.",
    integer: "Тек бүтін сан енгізіңіз.",
    minuteAt24: "24 сағат енгізілсе, минут 0 болуы керек.",
    otherRequired: "«Басқа» таңдалса, нақты жауапты жазыңыз.",
    detailRequired: "Жиілік жауабын таңдасаңыз, нақты себебін жазыңыз.",
    fieldRequired: "Бұл өрісті толтырыңыз.",
    checkboxRequired: "Жалғастыру үшін осы құсбелгіні қойыңыз.",
    selectRequired: "Жауапты таңдаңыз."
  },
  mn: {
    numberRange: "{min}-{max} хоорондох тоо оруулна уу.",
    integer: "Зөвхөн бүхэл тоо оруулна уу.",
    minuteAt24: "24 цаг оруулсан бол минут 0 байх ёстой.",
    otherRequired: "«Бусад»-ыг сонгосон бол бусад хариултаа бичнэ үү.",
    detailRequired: "Давтамжийн хариулт сонгосон бол дэлгэрэнгүй шалтгаанаа бичнэ үү.",
    fieldRequired: "Энэ талбарыг бөглөнө үү.",
    checkboxRequired: "Үргэлжлүүлэхийн тулд энэ нүдийг чагтална уу.",
    selectRequired: "Хариултаа сонгоно уу."
  },
  "zh-CN": {
    numberRange: "请输入 {min} 到 {max} 之间的数字。",
    integer: "请输入整数。",
    minuteAt24: "如果填写24小时，分钟必须为0。",
    otherRequired: "选择“其他”时，请填写具体内容。",
    detailRequired: "选择频率后，请填写详细原因。",
    fieldRequired: "请填写此项。",
    checkboxRequired: "请勾选此项以继续。",
    selectRequired: "请选择一个答案。"
  },
  uz: {
    numberRange: "{min} dan {max} gacha bo'lgan sonni kiriting.",
    integer: "Faqat butun son kiriting.",
    minuteAt24: "Agar 24 soat kiritilsa, daqiqa 0 bo'lishi kerak.",
    otherRequired: "Agar “Boshqa”ni tanlasangiz, boshqa javobni kiriting.",
    detailRequired: "Agar chastotani tanlasangiz, batafsil sababni kiriting.",
    fieldRequired: "Ushbu maydonni to'ldiring.",
    checkboxRequired: "Davom etish uchun ushbu katakchani belgilang.",
    selectRequired: "Javobni tanlang."
  },
  ne: {
    numberRange: "{min} देखि {max} सम्मको संख्या प्रविष्ट गर्नुहोस्।",
    integer: "पूर्णांक मात्र प्रविष्ट गर्नुहोस्।",
    minuteAt24: "२४ घण्टा लेखिएको छ भने मिनेट ० हुनुपर्छ।",
    otherRequired: "“अन्य” छान्नुभएको छ भने अन्य उत्तर लेख्नुहोस्।",
    detailRequired: "आवृत्ति छान्नुभएको छ भने विस्तृत कारण लेख्नुहोस्।",
    fieldRequired: "कृपया यो क्षेत्र भर्नुहोस्।",
    checkboxRequired: "अगाडि बढ्न यो बाकसमा चिन्ह लगाउनुहोस्।",
    selectRequired: "कृपया उत्तर छान्नुहोस्।"
  },
  bn: {
    numberRange: "{min} থেকে {max} এর মধ্যে একটি সংখ্যা লিখুন।",
    integer: "শুধু পূর্ণ সংখ্যা লিখুন।",
    minuteAt24: "২৪ ঘণ্টা লিখলে মিনিট অবশ্যই ০ হতে হবে।",
    otherRequired: "“অন্যান্য” নির্বাচন করলে অন্যান্য উত্তর লিখুন।",
    detailRequired: "ফ্রিকোয়েন্সি নির্বাচন করলে বিস্তারিত কারণ লিখুন।",
    fieldRequired: "এই ঘরটি পূরণ করুন।",
    checkboxRequired: "চালিয়ে যেতে এই বাক্সে টিক দিন।",
    selectRequired: "একটি উত্তর নির্বাচন করুন।"
  },
  si: {
    numberRange: "{min} සිට {max} දක්වා සංඛ්‍යාවක් ඇතුළත් කරන්න.",
    integer: "පූර්ණ සංඛ්‍යාවක් පමණක් ඇතුළත් කරන්න.",
    minuteAt24: "පැය 24ක් ඇතුළත් කළහොත් විනාඩි 0 විය යුතුය.",
    otherRequired: "“වෙනත්” තෝරා ඇත්නම් වෙනත් පිළිතුර ඇතුළත් කරන්න.",
    detailRequired: "වාර ගණන තෝරා ඇත්නම් විස්තරාත්මක හේතුව ඇතුළත් කරන්න.",
    fieldRequired: "කරුණාකර මෙම ක්ෂේත්‍රය පුරවන්න.",
    checkboxRequired: "ඉදිරියට යාමට මෙම කොටුව සලකුණු කරන්න.",
    selectRequired: "කරුණාකර පිළිතුරක් තෝරන්න."
  },
  ur: {
    numberRange: "{min} سے {max} تک کوئی عدد درج کریں۔",
    integer: "صرف صحیح عدد درج کریں۔",
    minuteAt24: "اگر 24 گھنٹے درج کیے جائیں تو منٹ 0 ہونا چاہیے۔",
    otherRequired: "اگر آپ نے “دیگر” منتخب کیا ہے تو دیگر جواب درج کریں۔",
    detailRequired: "اگر آپ نے تعدد منتخب کیا ہے تو تفصیلی وجہ درج کریں۔",
    fieldRequired: "یہ خانہ پُر کریں۔",
    checkboxRequired: "جاری رکھنے کے لیے اس خانے کو نشان زد کریں۔",
    selectRequired: "براہ کرم ایک جواب منتخب کریں۔"
  }
};
function validationText(key, vars = {}){
  let text = ((validationCopy[lang] || validationCopy.en)[key] || validationCopy.en[key] || key);
  Object.entries(vars).forEach(([name, value]) => { text = text.replace(`{${name}}`, value); });
  return text;
}
function liveValidationToken(field, message){
  return `${field.name || field.id || ""}|${field.value || ""}|${message}`;
}
function clearLiveValidation(field){
  delete field.dataset.liveValidationToken;
  const target = field.closest(".item") || field.closest(".extra-field");
  if(target) target.classList.remove("live-error");
}
function showLiveValidation(field, message){
  const token = liveValidationToken(field, message);
  if(field.dataset.liveValidationToken === token) return;
  field.dataset.liveValidationToken = token;
  const target = field.closest(".item") || field.closest(".extra-field");
  if(target) target.classList.add("live-error");
  showValidationToast(message);
  try{ field.reportValidity(); }catch(err){}
}
function numberValidationMessage(field){
  if(!field.value){
    return "";
  }
  const value = Number(field.value);
  if(!Number.isFinite(value) || !Number.isInteger(value)){
    return validationText("integer");
  }
  const min = field.min !== "" ? Number(field.min) : null;
  const max = field.max !== "" ? Number(field.max) : null;
  if(max !== null && value > max){
    if(field.name && field.name.endsWith("_minutes") && max === 0) return validationText("minuteAt24");
    return validationText("numberRange", { min: min ?? 0, max });
  }
  if(min !== null && value < min){
    return validationText("numberRange", { min, max: max ?? "" });
  }
  return "";
}
function normalizeNumberField(field){
  if(field.disabled) return true;
  const message = numberValidationMessage(field);
  field.setCustomValidity(message);
  if(!message) clearLiveValidation(field);
  return !message;
}
function normalizeDurationGrid(grid){
  const hours = grid.querySelector('input[name$="_hours"]');
  const minutes = grid.querySelector('input[name$="_minutes"]');
  if(!hours || !minutes || hours.max !== "24") return;
  if(!minutes.dataset.originalMax) minutes.dataset.originalMax = minutes.max || "59";
  const atLimit = hours.value !== "" && Number(hours.value) >= Number(hours.max);
  minutes.max = atLimit ? "0" : minutes.dataset.originalMax;
}
function enforceFeasibleNumbers(root = document){
  root.querySelectorAll(".parts-grid").forEach(grid => normalizeDurationGrid(grid));
  root.querySelectorAll('input[data-number-bounds="1"]').forEach(field => {
    normalizeNumberField(field);
  });
}
function customRequiredMessage(field){
  if(field.classList.contains("other-input")) return validationText("otherRequired");
  if(field.dataset.frequencyDetailFor) return validationText("detailRequired");
  return requiredValidationMessage(field);
}
function requiredValidationMessage(field){
  if(field && field.type === "checkbox") return validationText("checkboxRequired");
  if(field && (field.type === "radio" || field.tagName === "SELECT")) return validationText("selectRequired");
  return validationText("fieldRequired");
}
function requiredMissing(field){
  if(!field || field.disabled || !field.required) return false;
  if(field.type === "radio"){
    const form = field.form || document;
    const group = [...form.querySelectorAll(`input[type="radio"][name="${CSS.escape(field.name)}"]`)].filter(el => !el.disabled);
    return !group.some(el => el.checked);
  }
  if(field.type === "checkbox") return !field.checked;
  return !String(field.value || "").trim();
}
function refreshRequiredValidity(field){
  if(!field) return true;
  if(field.disabled || !field.required){
    if(!field.matches || !field.matches('input[data-number-bounds="1"]')){
      field.setCustomValidity("");
    }
    clearLiveValidation(field);
    return true;
  }
  if(field.matches && field.matches('input[data-number-bounds="1"]')){
    const numberMessage = numberValidationMessage(field);
    if(numberMessage){
      field.setCustomValidity(numberMessage);
      return false;
    }
  }
  if(field.classList.contains("other-input") || field.dataset.frequencyDetailFor){
    return validateCustomRequiredField(field);
  }
  const message = requiredMissing(field) ? requiredValidationMessage(field) : "";
  field.setCustomValidity(message);
  if(!message) clearLiveValidation(field);
  return !message;
}
function refreshFormValidationState(root = document){
  root.querySelectorAll("[required]").forEach(field => refreshRequiredValidity(field));
}
function validateCustomRequiredField(field){
  if(field.disabled || !field.required){
    field.setCustomValidity("");
    clearLiveValidation(field);
    return true;
  }
  const message = field.value.trim() ? "" : customRequiredMessage(field);
  field.setCustomValidity(message);
  if(!message) clearLiveValidation(field);
  return !message;
}
function shouldReportCustomRequired(field, target, mode){
  if(!target || field.disabled || !field.required || field.value.trim()) return false;
  if(target === field) return mode === "blur";
  const label = field.closest("label");
  if(label && label.contains(target)) return false;
  const page = field.closest(".survey-page");
  return !!(page && page.contains(target) && target.matches && target.matches("input, textarea, select"));
}
function handleLiveValidation(event, mode = "input"){
  const target = event && event.target;
  if(target && target.matches && target.matches('input[data-number-bounds="1"]')){
    const grid = target.closest(".parts-grid");
    if(grid) normalizeDurationGrid(grid);
    normalizeNumberField(target);
    if(target.validationMessage && target.value) showLiveValidation(target, target.validationMessage);
    if(grid){
      grid.querySelectorAll('input[data-number-bounds="1"]').forEach(field => {
        normalizeNumberField(field);
        if(field !== target && field.validationMessage && field.value) showLiveValidation(field, field.validationMessage);
      });
    }
  }
  document.querySelectorAll(".other-input[required], [data-frequency-detail-for][required]").forEach(field => {
    validateCustomRequiredField(field);
    if(field.validationMessage && shouldReportCustomRequired(field, target, mode)){
      showLiveValidation(field, field.validationMessage);
    }
  });
}
function renderParts(item){
  const parts = item.parts || [];
  const hasMinuteField = parts.some(part => String(part.id || "").toLowerCase().includes("minute"));
  const grid = `<div class="parts-grid parts-${parts.length}">` + parts.map(part => {
    const name = idSafe(part.id);
    const fieldClass = part.type === "select" ? "part-select" : "part-number";
    const label = `<label class="part-field ${fieldClass}"><span>${esc(t(part.label))}</span>`;
    if(part.type === "select"){
      return label + `<select name="${esc(name)}"><option value=""></option>${part.options.map(opt => `<option value="${esc(opt)}">${esc(t(opt))}</option>`).join("")}</select></label>`;
    }
    return label + `<input name="${esc(name)}" ${numberAttributes(part, ' data-time-part="1"')}></label>`;
  }).join("") + `</div>`;
  return grid + (hasMinuteField ? `<div class="hint minute-zero-note">${esc(zeroMinuteNote())}</div>` : "");
}

function isFrequencyDetailItem(item){
  return item.id === "sleep_5_j" || item.id === "sleep_10_e";
}

function renderFrequencyDetail(item, name){
  const detailName = `${name}__detail`;
  const detailInput = item.type === "textarea"
    ? `<textarea name="${esc(detailName)}" rows="3" placeholder="${esc(ui("textPlaceholder"))}" data-frequency-detail-for="${esc(item.id)}"></textarea>`
    : `<input name="${esc(detailName)}" type="text" placeholder="${esc(ui("textPlaceholder"))}" data-frequency-detail-for="${esc(item.id)}">`;
  const options = `<div class="options frequency-options">` + item.options.map(opt => (
    `<label><input type="radio" name="${esc(name)}" value="${esc(opt)}"> <span>${esc(displayOptionText(item, opt))}</span></label>`
  )).join("") + `</div>`;
  return `
    <div class="frequency-detail">
      <label class="detail-field"><span>${esc(t("상세 이유"))}</span>${detailInput}</label>
      <div class="choice-title">${esc(t("어려움 정도"))}</div>
      ${options}
    </div>`;
}

function initSelectors(){
  const ls = document.getElementById("languageSelect");
  ls.innerHTML = Object.entries(B.languages).map(([code, meta]) => `<option value="${code}">${esc(meta.name)}</option>`).join("");
  ls.value = lang;
  ls.onchange = () => { lang = ls.value; currentPage = 0; localStorage.setItem("survey_lang", lang); render(); };
  document.getElementById("groupSelect").innerHTML = B.groups.map(g => `<option value="${esc(g)}">${esc(t(g))}</option>`).join("");
}

function renderUiText(){
  document.documentElement.lang = lang;
  document.body.classList.toggle("rtl", rtlLangs.has(lang));
  document.getElementById("appTitle").textContent = t(B.survey.title);
  document.getElementById("appSubtitle").textContent = ui("appSubtitle");
  document.querySelectorAll("[data-ui]").forEach(el => el.textContent = ui(el.dataset.ui));
  document.getElementById("downloadCsv").textContent = ui("downloadCsv");
  document.getElementById("downloadJson").textContent = ui("downloadJson");
  document.getElementById("downloadHtml").textContent = ui("downloadHtml");
  document.getElementById("clearResponses").textContent = ui("clearResponses");
}

function renderLanding(){
  let landing = document.getElementById("landingPage");
  if(!landing){
    landing = document.createElement("section");
    landing.id = "landingPage";
    landing.className = "landing";
    document.querySelector(".top").insertAdjacentElement("afterend", landing);
  }
  const cards = Object.entries(B.languages).map(([code, meta]) => `
    <button type="button" class="language-card ${code === lang ? "selected" : ""}" data-lang="${esc(code)}">
      <span>${esc(meta.name)}</span><small>${esc(code)}</small>
    </button>`).join("");
  landing.innerHTML = `
    <div class="landing-copy">
      <h2>${esc(lc("title"))}</h2>
      <p>${esc(lc("subtitle"))}</p>
      <p class="group-note">${esc(ui("participantGroupHint"))}</p>
    </div>
    <div class="language-grid">${cards}</div>
    <button type="button" id="startSurvey" class="start-button">${esc(lc("start"))}</button>`;
  landing.querySelectorAll(".language-card").forEach(button => {
    button.onclick = () => { lang = button.dataset.lang; currentPage = 0; localStorage.setItem("survey_lang", lang); render(); };
  });
  document.getElementById("startSurvey").onclick = () => { currentPage = 0; surveyStarted = true; render(); window.scrollTo({ top: 0, behavior: "smooth" }); };
}

function renderItem(item){
  if(item.type === "note"){
    return `<div class="item note-item" data-qid="${esc(item.id)}"><div class="item-label">${esc(displayId(item.id))}. ${esc(t(item.label))}</div><div class="hint">${esc(t(item.responseHint || ""))}</div></div>`;
  }
  const required = item.required ? ` <span class="required">${esc(ui("required"))}</span>` : "";
  const name = idSafe(item.id);
  let field = "";
  if(item.type === "radio"){
    field = `<div class="options">` + item.options.map((opt, i) => {
      const isOther = opt.includes("기타");
      const otherInput = isOther ? `<input class="other-input" name="${esc(name)}__other" type="text" placeholder="${esc(ui("otherInput"))}" disabled>` : "";
      const optionExtras = (item.extraFields || [])
        .filter(extraField => extraField.showIfValueContains === opt)
        .map(extraField => renderExtraField(item, extraField))
        .join("");
      return `<div class="option-block"><label class="option-choice"><input type="radio" name="${esc(name)}" value="${esc(opt)}" data-other="${isOther ? "1" : "0"}"> <span>${esc(displayOptionText(item, opt))}</span>${otherInput}</label>${optionExtras}</div>`;
    }).join("") + `</div>`;
  } else if(isFrequencyDetailItem(item)){
    field = renderFrequencyDetail(item, name);
  } else if(item.type === "textarea"){
    field = `<textarea name="${esc(name)}" rows="3" placeholder="${esc(ui("textPlaceholder"))}"></textarea>`;
  } else if(item.type === "number"){
    field = `<input name="${esc(name)}" ${numberAttributes(item)} placeholder="${esc(item.responseHint || ui("textPlaceholder"))}">`;
  } else if(item.type === "country"){
    field = renderCountrySelect(name);
  } else if(item.type === "parts"){
    field = renderParts(item);
  } else {
    field = `<input name="${esc(name)}" type="text" placeholder="${esc(ui("textPlaceholder"))}">`;
  }
  const hint = item.responseHint && item.type !== "radio" && !isFrequencyDetailItem(item) ? `<div class="hint">${esc(t(item.responseHint))}</div>` : "";
  const extra = item.type === "radio" ? "" : (item.extraFields || []).map(extraField => renderExtraField(item, extraField)).join("");
  return `<div class="item" data-qid="${esc(item.id)}" data-required-base="${item.required ? "1" : "0"}"><div class="item-label"><span class="qid">${esc(displayId(item.id))}</span><span>${esc(t(item.label))}${required}</span></div>${field}${hint}${extra}<div class="skip-note">${esc(ui("disabledByLogic"))}</div></div>`;
}

function renderExtraField(parentItem, extraField){
  const name = idSafe(extraField.id);
  const required = extraField.required ? ` <span class="required">${esc(ui("required"))}</span>` : "";
  if(extraField.type === "radio"){
    return `<div class="extra-field" data-extra-id="${esc(extraField.id)}" data-parent-id="${esc(parentItem.id)}" data-show-if="${esc(extraField.showIfValueContains || "")}">
      <div class="item-label">${esc(t(extraField.label))}${required}</div>
      <div class="options">${extraField.options.map(opt => `<label><input type="radio" name="${esc(name)}" value="${esc(opt)}"> <span>${esc(displayOptionText(parentItem, opt))}</span></label>`).join("")}</div>
    </div>`;
  }
  if(extraField.type === "number"){
    const min = extraField.min ?? "";
    const max = extraField.max ?? "";
    const step = extraField.step ?? 1;
    const bounds = min !== "" || max !== "" ? ` data-number-bounds="1"` : "";
    return `<div class="extra-field" data-extra-id="${esc(extraField.id)}" data-parent-id="${esc(parentItem.id)}" data-show-if="${esc(extraField.showIfValueContains || "")}">
      <label class="item-label">${esc(t(extraField.label))}${required}</label>
      <input type="number" name="${esc(name)}" min="${esc(min)}" max="${esc(max)}" step="${esc(step)}"${bounds}>
    </div>`;
  }
  return `<div class="extra-field" data-extra-id="${esc(extraField.id)}" data-parent-id="${esc(parentItem.id)}" data-show-if="${esc(extraField.showIfValueContains || "")}">
    <label class="item-label">${esc(t(extraField.label))}${required}</label>
    <input type="text" name="${esc(name)}" placeholder="${esc(ui("textPlaceholder"))}">
  </div>`;
}

function renderForm(){
  const form = document.getElementById("surveyForm");
  const consent = `
    <section class="card survey-page" data-page-index="0">
      <h2>${esc(t(B.survey.introTitle))}</h2>
      <p class="intro">${esc(t(B.survey.intro))}</p>
      <h2>${esc(t(B.survey.consentTitle))}</h2>
      <div class="intro">${B.survey.consentBullets.map(x => `<p>${esc(t(x))}</p>`).join("")}</div>
      <div class="options"><label><input type="checkbox" name="consent" required> <span>${esc(t(B.survey.consentLabel))} <span class="required">${esc(ui("required"))}</span></span></label></div>
    </section>`;
  const sections = B.survey.sections.map((sec, index) => `
    <section class="card survey-page" data-page-index="${index + 1}">
      <h2>${esc(t(sec.title))}</h2>
      <p class="intro">${esc(t(sec.intro))}</p>
      ${sec.items.map(renderItem).join("")}
    </section>`).join("");
  const nav = `
    <div class="page-nav">
      <div>
        <div id="pageStatus" class="page-status"></div>
        <div id="lastPageNote" class="last-page-note">${esc(t(B.survey.thanks))}</div>
        <div id="pageError" class="page-error" role="alert" hidden></div>
      </div>
      <div class="actions page-actions">
        <button type="button" id="prevPageButton" class="secondary">${esc(navText("previous"))}</button>
        <button type="button" id="nextPageButton">${esc(navText("next"))}</button>
        <button type="submit" id="submitButton">${esc(ui("sheetSubmit"))}</button>
        <button type="reset" id="resetButton" class="secondary" hidden>${esc(ui("reset"))}</button>
      </div>
    </div>`;
  form.innerHTML = consent + sections + nav;
  enforceFeasibleNumbers(form);
  form.addEventListener("invalid", event => {
    refreshRequiredValidity(event.target);
  }, true);
  form.onsubmit = saveResponse;
  form.oninput = (event) => {
    enforceFeasibleNumbers(form);
    applyOtherInputs();
    applySkipLogic();
    applyFrequencyDetailInputs();
    refreshFormValidationState(form);
    clearPageError();
    handleLiveValidation(event, "input");
    updateProgress();
  };
  form.onchange = (event) => {
    enforceFeasibleNumbers(form);
    applyOtherInputs();
    applySkipLogic();
    applyFrequencyDetailInputs();
    refreshFormValidationState(form);
    clearPageError();
    handleLiveValidation(event, "change");
    updateProgress();
  };
  form.onfocusout = (event) => {
    enforceFeasibleNumbers(form);
    applyOtherInputs();
    applyFrequencyDetailInputs();
    refreshFormValidationState(form);
    handleLiveValidation(event, "blur");
    updateProgress();
  };
  form.onreset = () => {
    setTimeout(() => {
      currentPage = 0;
      pendingResponseId = null;
      applyOtherInputs();
      applySkipLogic();
      applyFrequencyDetailInputs();
      enforceFeasibleNumbers(form);
      refreshFormValidationState(form);
      updatePageVisibility();
    }, 0);
  };
  document.getElementById("prevPageButton").onclick = () => goToPage(currentPage - 1);
  document.getElementById("nextPageButton").onclick = () => goToPage(currentPage + 1);
  applyOtherInputs();
  applySkipLogic();
  applyFrequencyDetailInputs();
  updatePageVisibility();
}

function surveyPages(){ return [...document.querySelectorAll(".survey-page")]; }
function surveyPageCount(){ return surveyPages().length; }
function fieldsInPage(pageIndex, selector = "input, textarea, select"){
  const page = document.querySelector(`.survey-page[data-page-index="${CSS.escape(String(pageIndex))}"]`);
  return page ? [...page.querySelectorAll(selector)].filter(field => !field.disabled) : [];
}
function clearPageError(){
  const error = document.getElementById("pageError");
  if(error){
    error.hidden = true;
    error.textContent = "";
  }
  document.querySelectorAll(".has-error").forEach(el => el.classList.remove("has-error"));
}
function showPageError(field){
  const error = document.getElementById("pageError");
  if(error){
    error.textContent = navText("requiredError");
    error.hidden = false;
  }
  const target = field.closest(".item") || field.closest(".extra-field") || field;
  target.classList.add("has-error");
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  try{ field.focus({ preventScroll: true }); }catch(err){ field.focus(); }
  try{ field.reportValidity(); }catch(err){}
}
function validatePage(pageIndex, showMessage = true){
  applySkipLogic();
  applyOtherInputs();
  applyFrequencyDetailInputs();
  enforceFeasibleNumbers(document.getElementById("surveyForm"));
  clearPageError();
  const page = document.querySelector(`.survey-page[data-page-index="${CSS.escape(String(pageIndex))}"]`);
  if(page) refreshFormValidationState(page);
  const invalid = fieldsInPage(pageIndex, "[required]").find(field => !field.checkValidity());
  if(invalid && showMessage) showPageError(invalid);
  return !invalid;
}
function firstInvalidPage(){
  for(const page of surveyPages()){
    const pageIndex = Number(page.dataset.pageIndex);
    if(!validatePage(pageIndex, false)) return pageIndex;
  }
  return -1;
}
function goToPage(pageIndex){
  if(pageIndex > currentPage && !validatePage(currentPage)) return;
  clearPageError();
  const total = surveyPageCount();
  currentPage = Math.max(0, Math.min(pageIndex, total - 1));
  updatePageVisibility(true);
}
function scrollToCurrentPageTop(){
  const page = surveyPages()[currentPage];
  if(!page) return;
  const progress = document.querySelector(".progress");
  const offset = (progress ? progress.offsetHeight : 0) + 14;
  requestAnimationFrame(() => {
    const top = Math.max(0, page.getBoundingClientRect().top + window.scrollY - offset);
    window.scrollTo({ top, behavior: "smooth" });
  });
}
function updatePageVisibility(scroll = false){
  const pages = surveyPages();
  const total = pages.length || 1;
  currentPage = Math.max(0, Math.min(currentPage, total - 1));
  pages.forEach((page, index) => {
    const active = index === currentPage;
    page.hidden = !active;
    page.classList.toggle("is-current", active);
  });
  const prev = document.getElementById("prevPageButton");
  const next = document.getElementById("nextPageButton");
  const submit = document.getElementById("submitButton");
  const reset = document.getElementById("resetButton");
  const status = document.getElementById("pageStatus");
  const lastPageNote = document.getElementById("lastPageNote");
  const isLast = currentPage === total - 1;
  if(prev) prev.disabled = currentPage === 0;
  if(next) next.hidden = isLast;
  if(submit) submit.hidden = !isLast;
  if(reset) reset.hidden = true;
  if(lastPageNote) lastPageNote.hidden = !isLast;
  if(status) status.textContent = `${navText("page")} ${currentPage + 1} / ${total}`;
  updateProgress();
  if(scroll) scrollToCurrentPageTop();
}

function fieldValue(itemId){
  const item = itemById(itemId);
  if(!item) return "";
  const name = idSafe(item.id);
  const checked = document.querySelector(`[name="${CSS.escape(name)}"]:checked`);
  if(checked) return checked.value;
  const field = document.querySelector(`[name="${CSS.escape(name)}"]`);
  if(field && (field.type === "radio" || field.type === "checkbox")) return "";
  return field ? field.value : "";
}

function conditionMet(condition){
  if(!condition) return true;
  const value = fieldValue(condition.id);
  if(condition.contains && !value.includes(condition.contains)) return false;
  if(condition.notContains && (!value || value.includes(condition.notContains))) return false;
  return true;
}

function setItemActive(item, active){
  const container = document.querySelector(`[data-qid="${CSS.escape(item.id)}"]`);
  if(!container) return;
  container.classList.toggle("is-skipped", !active);
  container.querySelectorAll("input, textarea, select").forEach(field => {
    field.disabled = !active;
    if(!active){
      if(field.type === "radio" || field.type === "checkbox") field.checked = false;
      else field.value = "";
      field.required = false;
    }
  });
  if(active && item.required && item.type !== "note"){
    const name = idSafe(item.id);
    container.querySelectorAll(`[name="${CSS.escape(name)}"]`).forEach(field => field.required = true);
    (item.parts || []).forEach(part => {
      container.querySelectorAll(`[name="${CSS.escape(idSafe(part.id))}"]`).forEach(field => field.required = true);
    });
  }
}

function applySkipLogic(){
  allItems().forEach(item => setItemActive(item, conditionMet(item.showIf)));
  applyOtherInputs();
  applyExtraFields();
}

function applyOtherInputs(){
  document.querySelectorAll("input[type='radio'][data-other='1']").forEach(radio => {
    const other = radio.closest("label").querySelector(".other-input");
    if(!other) return;
    const enabled = radio.checked && !radio.disabled;
    other.disabled = !enabled;
    other.required = enabled;
    if(!enabled){
      other.value = "";
      other.setCustomValidity("");
      clearLiveValidation(other);
    } else {
      validateCustomRequiredField(other);
    }
  });
}

function applyFrequencyDetailInputs(){
  document.querySelectorAll("[data-frequency-detail-for]").forEach(field => {
    const itemId = field.dataset.frequencyDetailFor;
    const item = itemById(itemId);
    const selected = document.querySelector(`[name="${CSS.escape(idSafe(itemId))}"]:checked`);
    const shouldRequire = item && item.required && selected && !selected.value.includes("지난 한달 동안 없었다") && !field.disabled;
    field.required = !!shouldRequire;
    if(shouldRequire) validateCustomRequiredField(field);
    else {
      field.setCustomValidity("");
      clearLiveValidation(field);
    }
  });
}

function applyExtraFields(){
  document.querySelectorAll(".extra-field").forEach(extra => {
    const parentId = extra.dataset.parentId;
    const needle = extra.dataset.showIf || "";
    const parentContainer = document.querySelector(`[data-qid="${CSS.escape(parentId)}"]`);
    const visible = parentContainer && !parentContainer.classList.contains("is-skipped") && fieldValue(parentId).includes(needle);
    extra.classList.toggle("is-hidden", !visible);
    extra.querySelectorAll("input, textarea, select").forEach(field => {
      field.disabled = !visible;
      field.required = visible;
      if(!visible){
        if(field.type === "radio" || field.type === "checkbox") field.checked = false;
        else field.value = "";
      }
    });
  });
}

function makeResponseId(){
  if(window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  return `resp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function collectResponse(form){
  const fd = new FormData(form);
  if(!pendingResponseId) pendingResponseId = makeResponseId();
  const entry = {
    response_id: pendingResponseId,
    submitted_at: new Date().toISOString(),
    language: lang,
    participant_group: "",
    consent: fd.get("consent") ? "yes" : "no"
  };
  allItems().forEach(item => {
    if(item.type === "note") return;
    const name = idSafe(item.id);
    const container = document.querySelector(`[data-qid="${CSS.escape(item.id)}"]`);
    if(container && container.classList.contains("is-skipped")){
      entry[item.id] = "";
      entry[item.id + "__skipped"] = "yes";
      return;
    }
    if(item.type === "parts"){
      (item.parts || []).forEach(part => {
        entry[part.id] = fd.get(idSafe(part.id)) || "";
      });
      entry[item.id] = (item.parts || []).map(part => fd.get(idSafe(part.id)) || "").filter(Boolean).join(" ");
    } else {
      entry[item.id] = fd.get(name) || "";
    }
    if(isFrequencyDetailItem(item)){
      entry[item.id + "__detail"] = fd.get(name + "__detail") || "";
    }
    const other = fd.get(name + "__other");
    if(other) entry[item.id + "__other"] = other;
    (item.extraFields || []).forEach(extraField => {
      entry[extraField.id] = fd.get(idSafe(extraField.id)) || "";
    });
  });
  return entry;
}

function saveLocal(entry){
  const rows = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  rows.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

async function submitToSheet(entry){
  const url = (CONFIG.googleScriptUrl || "").trim();
  if(!url || url.includes("PASTE_")) return "local-only";
  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ source: "daejin_multilingual_health_survey", payload: entry })
  });
  return "sent";
}

async function saveResponse(e){
  e.preventDefault();
  applySkipLogic();
  applyOtherInputs();
  enforceFeasibleNumbers(e.target);
  const form = e.target;
  refreshFormValidationState(form);
  if(!form.reportValidity()) return;
  const button = document.getElementById("submitButton");
  const original = button.textContent;
  button.disabled = true;
  button.textContent = ui("sheetSubmitPending");
  const entry = collectResponse(form);
  saveLocal(entry);
  let shouldReset = false;
  try{
    const status = await submitToSheet(entry);
    shouldReset = true;
    showToast(status === "sent" ? ui("sheetSubmitSuccess") : ui("sheetSubmitLocalOnly"));
  }catch(err){
    showToast(ui("sheetSubmitError"));
  }finally{
    button.disabled = false;
    button.textContent = original;
  }
  if(shouldReset){
    pendingResponseId = null;
    form.reset();
    applySkipLogic();
    updateProgress();
  }
  renderResponseCount();
}

function activeRequiredGroups(){
  const form = document.getElementById("surveyForm");
  const fields = [...form.querySelectorAll("[required]")].filter(el => !el.disabled);
  const groups = new Map();
  fields.forEach(el => groups.set(el.name, true));
  return groups;
}

function updateProgress(){
  const form = document.getElementById("surveyForm");
  const groups = activeRequiredGroups();
  let done = 0;
  groups.forEach((_, name) => {
    const fields = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)].filter(el => !el.disabled);
    if(fields.some(f => (f.type === "radio" || f.type === "checkbox") ? f.checked : f.value.trim() && f.checkValidity())) done++;
  });
  const total = groups.size || 1;
  const pct = Math.round(done / total * 100);
  document.getElementById("progressLabel").textContent = `${ui("progress")}: ${pct}%`;
  document.getElementById("progressBar").style.width = `${pct}%`;
}

function responses(){ return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
function renderResponseCount(){
  const count = responses().length;
  document.getElementById("responseCount").textContent = count ? `${count}` : ui("noResponses");
}
function download(name, text, type){
  const blob = new Blob([text], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
function csvEscape(v){ return `"${String(v ?? "").replace(/"/g, '""')}"`; }
function responseHeaders(){
  const base = ["response_id","submitted_at","language","participant_group","consent"];
  const itemHeaders = [];
  allItems().forEach(item => {
    if(item.type === "note") return;
    itemHeaders.push(item.id);
    if(isFrequencyDetailItem(item)) itemHeaders.push(item.id + "__detail");
    (item.parts || []).forEach(part => itemHeaders.push(part.id));
    if((item.options || []).some(opt => opt.includes("\uAE30\uD0C0"))) itemHeaders.push(item.id + "__other");
    (item.extraFields || []).forEach(extraField => itemHeaders.push(extraField.id));
    if(item.showIf) itemHeaders.push(item.id + "__skipped");
  });
  return [...base, ...itemHeaders];
}
function downloadCsv(){
  const rows = responses();
  const headers = responseHeaders();
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => csvEscape(r[h])).join(","))].join("\n");
  download("survey_responses.csv", "\ufeff" + csv, "text/csv;charset=utf-8");
}
function downloadJson(){ download("survey_responses.json", JSON.stringify(responses(), null, 2), "application/json;charset=utf-8"); }
function downloadHtmlLink(){
  const a = document.getElementById("downloadHtml");
  a.href = "data:text/html;charset=utf-8," + encodeURIComponent(document.documentElement.outerHTML);
}
function showToast(msg){
  const div = document.createElement("div");
  div.className = "toast"; div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3200);
}
function showValidationToast(msg){
  document.querySelectorAll(".validation-toast").forEach(el => el.remove());
  const div = document.createElement("div");
  div.className = "toast validation-toast";
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3600);
}

function render(){
  document.body.classList.toggle("is-landing", !surveyStarted);
  renderUiText();
  initSelectors();
  document.querySelectorAll(".change-language").forEach(button => button.remove());
  if(surveyStarted){
    const landing = document.getElementById("landingPage");
    if(landing) landing.innerHTML = "";
    renderForm();
    const changeButton = document.createElement("button");
    changeButton.type = "button";
    changeButton.className = "secondary change-language";
    changeButton.textContent = lc("change");
    changeButton.onclick = () => { currentPage = 0; surveyStarted = false; render(); };
    document.querySelector(".controls").appendChild(changeButton);
  } else {
    document.getElementById("surveyForm").innerHTML = "";
    document.getElementById("progressLabel").textContent = "";
    document.getElementById("progressBar").style.width = "0";
    renderLanding();
  }
  renderResponseCount();
  downloadHtmlLink();
}
document.getElementById("downloadCsv").onclick = downloadCsv;
document.getElementById("downloadJson").onclick = downloadJson;
document.getElementById("clearResponses").onclick = () => { localStorage.removeItem(STORAGE_KEY); renderResponseCount(); };
render();
