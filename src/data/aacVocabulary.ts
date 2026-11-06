import { AACTile } from '../types';

export const INITIAL_AAC_VOCABULARY: AACTile[] = [
  // --- EMERGENCY & SAFETY (RED) ---
  {
    id: 'emg-help-now',
    icon: '🚨',
    category: 'emergency',
    colorKey: 'red',
    english: 'Help me right now!',
    translations: {
      'twi-asante': 'Boa me ntɛm ara!',
      'twi-akuapem': 'Boa me ntɛm ara!',
      'fante': 'Boa me ntsɛmara!',
      'ga': 'Waami amrɔ nɛ!',
      'ewe': 'Kpe ɖe ŋunye enumake!',
      'dagbani': 'Sɔŋ mi yoma!'
    },
    phonetics: {
      'twi-asante': 'bwah mee n-tem ah-rah',
      'ga': 'wah-mee ahm-rohn-neh',
      'ewe': 'kpeh deh ngoon-yeh eh-noo-mah-keh'
    },
    quickCode: '911'
  },
  {
    id: 'emg-fall',
    icon: '⚠️',
    category: 'emergency',
    colorKey: 'red',
    english: 'I fell down / I need assistance',
    translations: {
      'twi-asante': "M'ahwe fam, boa me!",
      'twi-akuapem': "M'ahwe fam, boa me!",
      'fante': "M'ahwe famu, boa me!",
      'ga': 'Minyɔ shi, waami!',
      'ewe': 'Mede anyi, kpe ɖe ŋunye!',
      'dagbani': 'N lu ya tiŋa, sɔŋ mi!'
    },
    quickCode: 'FALL'
  },
  {
    id: 'emg-choke',
    icon: '🫁',
    category: 'emergency',
    colorKey: 'red',
    english: "I cannot breathe well",
    translations: {
      'twi-asante': 'Mentumi nnye me home yie',
      'twi-akuapem': 'Mentumi nnye me home yie',
      'fante': 'Montumi nnye m’ahome yie',
      'ga': 'Minyɛɛ mimu mumɔ jogbaŋŋ',
      'ewe': 'Nyemete ŋu le gbɔgbɔm nyuie o',
      'dagbani': 'N ku too vɔhimsa viɛnyɛla'
    },
    quickCode: 'BREATHE'
  },
  {
    id: 'emg-stop',
    icon: '🛑',
    category: 'emergency',
    colorKey: 'red',
    english: 'Stop that! Leave me alone',
    translations: {
      'twi-asante': 'Gyae me! Gyae saa!',
      'twi-akuapem': 'Gyae me! Gyae saa!',
      'fante': 'Gyaa me! Gyaa dɛm!',
      'ga': 'Kpa kɛkɛ! Shi mi!',
      'ewe': 'Tɔ! Dzudzɔ na nye!',
      'dagbani': 'Cheli! Bahim ma!'
    },
    quickCode: 'STOP'
  },

  // --- GREETINGS & SOCIAL (PINK) ---
  {
    id: 'greet-morning',
    icon: '🌅',
    category: 'greetings',
    colorKey: 'pink',
    english: 'Good Morning',
    translations: {
      'twi-asante': 'Mema wo akye',
      'twi-akuapem': 'Mema wo akye',
      'fante': 'Me kyea wo',
      'ga': 'Awula nyoŋmɔ / Oyiwala',
      'ewe': 'Ndi na wò',
      'dagbani': 'Desiba'
    },
    phonetics: {
      'twi-asante': 'meh-mah woh ah-chyeh',
      'ga': 'ah-woo-lah nyohn-moh',
      'ewe': 'n-dee nah woh',
      'dagbani': 'deh-see-bah'
    }
  },
  {
    id: 'greet-afternoon',
    icon: '☀️',
    category: 'greetings',
    colorKey: 'pink',
    english: 'Good Afternoon',
    translations: {
      'twi-asante': 'Mema wo aha',
      'twi-akuapem': 'Mema wo aha',
      'fante': 'Me ma wo aha',
      'ga': 'Mane oyiwala',
      'ewe': 'Ŋdɔ na wò',
      'dagbani': 'Antire'
    }
  },
  {
    id: 'greet-evening',
    icon: '🌙',
    category: 'greetings',
    colorKey: 'pink',
    english: 'Good Evening',
    translations: {
      'twi-asante': 'Mema wo adwo',
      'twi-akuapem': 'Mema wo adwo',
      'fante': 'Me ma wo adwo',
      'ga': 'Gbɛkɛ oyiwala',
      'ewe': 'Fiẽ na wò',
      'dagbani': 'Aninula'
    }
  },
  {
    id: 'greet-welcome',
    icon: '🤝',
    category: 'greetings',
    colorKey: 'pink',
    english: 'Welcome!',
    translations: {
      'twi-asante': 'Akwaaba!',
      'twi-akuapem': 'Akwaaba!',
      'fante': 'Akwaaba!',
      'ga': 'Atuu / Baa jogbaŋŋ!',
      'ewe': 'Woezɔ!',
      'dagbani': 'Marhaba!'
    }
  },
  {
    id: 'greet-thank-you',
    icon: '🙏',
    category: 'greetings',
    colorKey: 'pink',
    english: 'Thank you very much',
    translations: {
      'twi-asante': 'Medase pa ara',
      'twi-akuapem': 'Medase pa ara',
      'fante': 'Medaase pii',
      'ga': 'Minge Oyiwala donn',
      'ewe': 'Akpe na wò ŋutɔ',
      'dagbani': 'M-pua pam / Naa'
    },
    phonetics: {
      'twi-asante': 'meh-dah-see pah ah-rah',
      'ga': 'meen-geh oh-yee-wah-lah don',
      'ewe': 'ahk-peh nah woh ngoo-toh'
    }
  },
  {
    id: 'greet-please',
    icon: '🤲',
    category: 'greetings',
    colorKey: 'pink',
    english: 'Please / Excuse me',
    translations: {
      'twi-asante': 'Me paakyɛw',
      'twi-akuapem': 'Me paakyɛw',
      'fante': 'Mepawkyɛw',
      'ga': 'Ofaine',
      'ewe': 'Meɖekuku',
      'dagbani': 'M-bɔri mi'
    }
  },
  {
    id: 'greet-how-are-you',
    icon: '😊',
    category: 'greetings',
    colorKey: 'pink',
    english: 'How are you doing?',
    translations: {
      'twi-asante': 'Wo ho te sɛn?',
      'twi-akuapem': 'Wo ho te sɛn?',
      'fante': 'Wo ho tse dɛn?',
      'ga': 'Teŋ tɛŋ oyɔɔ?',
      'ewe': 'Aleke nte le wò me?',
      'dagbani': 'Wula nyiri?'
    }
  },
  {
    id: 'greet-fine',
    icon: '✨',
    category: 'greetings',
    colorKey: 'pink',
    english: 'I am fine / All is well',
    translations: {
      'twi-asante': 'Me ho yɛ, asomdwoe',
      'twi-akuapem': 'Me ho yɛ, asomdwoe',
      'fante': 'Me ho yɛ, asomdwee',
      'ga': 'Miyɛ jogbaŋŋ, hejɔlɛ',
      'ewe': 'Meli nyuie, fafa le eme',
      'dagbani': 'Alaafee bɛni, suhudoo'
    }
  },
  {
    id: 'greet-yes',
    icon: '👍',
    category: 'greetings',
    colorKey: 'green',
    english: 'Yes',
    translations: {
      'twi-asante': 'Aane',
      'twi-akuapem': 'Aane',
      'fante': 'Nyew',
      'ga': 'Hee / Hɛɛ',
      'ewe': 'Ɛ̃ɛ̃',
      'dagbani': 'Iyi'
    }
  },
  {
    id: 'greet-no',
    icon: '👎',
    category: 'greetings',
    colorKey: 'red',
    english: 'No',
    translations: {
      'twi-asante': 'Dabi',
      'twi-akuapem': 'Dabi',
      'fante': 'Oho / Dabi',
      'ga': 'Dabi / Kpao',
      'ewe': 'Ao / Gbeɖe',
      'dagbani': 'A-a'
    }
  },

  // --- FOOD & DRINKS (AMBER/ORANGE) ---
  {
    id: 'food-water',
    icon: '💧',
    category: 'food',
    colorKey: 'orange',
    english: 'Water to drink',
    translations: {
      'twi-asante': 'Nsuo a mɛnom',
      'twi-akuapem': 'Nsuo a mɛnom',
      'fante': 'Nsu a menom',
      'ga': 'Nu ni manu',
      'ewe': 'Tsi mano',
      'dagbani': 'Kom ni n-nyu'
    }
  },
  {
    id: 'food-cold-water',
    icon: '🧊',
    category: 'food',
    colorKey: 'orange',
    english: 'Chilled / Cold Water',
    translations: {
      'twi-asante': 'Nsuo nwunu',
      'twi-akuapem': 'Nsuo nwunu',
      'fante': 'Nsu nwun',
      'ga': 'Nu fɛɔɔ',
      'ewe': 'Tsi faafĩ',
      'dagbani': 'Kom maasim'
    }
  },
  {
    id: 'food-waakye',
    icon: '🍛',
    category: 'food',
    colorKey: 'orange',
    english: 'Waakye with Shito & Egg',
    translations: {
      'twi-asante': 'Waakye ne shito ne kɔsʊa',
      'twi-akuapem': 'Waakye ne shito ne kɔsʊa',
      'fante': 'Waakye na shito na nkesua',
      'ga': 'Waakye kɛ shito kɛ wolo',
      'ewe': 'Waakye kple shito kple azi',
      'dagbani': 'Waakye mini shito mini gala'
    }
  },
  {
    id: 'food-jollof',
    icon: '🍲',
    category: 'food',
    colorKey: 'orange',
    english: 'Ghana Jollof Rice',
    translations: {
      'twi-asante': 'Ghana Jollof ne nam',
      'twi-akuapem': 'Ghana Jollof ne nam',
      'fante': 'Ghana Jollof na nam',
      'ga': 'Ghana Jollof kɛ loo',
      'ewe': 'Ghana Jollof kple lã',
      'dagbani': 'Ghana Jollof mini nim'
    }
  },
  {
    id: 'food-fufu',
    icon: '🥣',
    category: 'food',
    colorKey: 'orange',
    english: 'Fufu and Light Soup / Abenkwan',
    translations: {
      'twi-asante': 'Fufu ne nkrakra / abenkwan',
      'twi-akuapem': 'Fufu ne nkrakra / abenkwan',
      'fante': 'Fufuw na nkrakra',
      'ga': 'Fufu kɛ wonu',
      'ewe': 'Fufu kple detsĩ',
      'dagbani': 'Fufu mini saɣim tiim'
    }
  },
  {
    id: 'food-banku',
    icon: '🐟',
    category: 'food',
    colorKey: 'orange',
    english: 'Banku and Grilled Tilapia',
    translations: {
      'twi-asante': 'Banku ne Tilapia',
      'twi-akuapem': 'Banku ne Tilapia',
      'fante': 'Banku na Tilapia',
      'ga': 'Banku kɛ Tilapia gbalamɔ',
      'ewe': 'Akple kple Tilapia mimie',
      'dagbani': 'Banku mini zahim yuma'
    }
  },
  {
    id: 'food-koko',
    icon: '☕',
    category: 'food',
    colorKey: 'orange',
    english: 'Hausa Koko & Koose / Bofrot',
    translations: {
      'twi-asante': 'Hausa Koko ne Koose',
      'twi-akuapem': 'Hausa Koko ne Koose',
      'fante': 'Hausa Koko na Koose',
      'ga': 'Hausa Koko kɛ Koose',
      'ewe': 'Hausa Koko kple Koose',
      'dagbani': 'Koko mini Koose'
    }
  },
  {
    id: 'food-hungry',
    icon: '🍽️',
    category: 'food',
    colorKey: 'blue',
    english: 'I am hungry / I want to eat',
    translations: {
      'twi-asante': 'Kɔm de me, mepɛ aduane',
      'twi-akuapem': 'Kɔm de me, mepɛ aduane',
      'fante': 'Kɔm dze me, mepɛ edziban',
      'ga': 'Hɔmɔ miiyemi, miitao niyenii',
      'ewe': 'Dɔ le wuyem, medi nuɖuɖu',
      'dagbani': 'Kum mali ma, m-bɔri bindirigu'
    }
  },

  // --- HEALTH & BODY (GREEN/EMERALD) ---
  {
    id: 'hlth-headache',
    icon: '🤕',
    category: 'health',
    colorKey: 'blue',
    english: 'I have a severe headache',
    translations: {
      'twi-asante': 'Me ti pae me dodo',
      'twi-akuapem': 'Me ti pae me dodo',
      'fante': 'Me tsir pae me papaapa',
      'ga': 'Miyiitso eegbami naakpa',
      'ewe': 'Ta le veyem ŋutɔ',
      'dagbani': 'N-zuɣu dɔrimi pam'
    }
  },
  {
    id: 'hlth-stomach',
    icon: '🤢',
    category: 'health',
    colorKey: 'blue',
    english: 'My stomach / tummy hurts',
    translations: {
      'twi-asante': 'Me yafunu yɛ me ya',
      'twi-akuapem': 'Me yafunu yɛ me ya',
      'fante': 'Me yafun yɛ me ya',
      'ga': 'Mimusɔŋ eedɔmi',
      'ewe': 'Dɔme le veyem',
      'dagbani': 'M-pulor dɔrimi'
    }
  },
  {
    id: 'hlth-medicine',
    icon: '💊',
    category: 'health',
    colorKey: 'green',
    english: 'It is time for my medication',
    translations: {
      'twi-asante': 'Ɛberɛ aso sɛ menom aduro',
      'twi-akuapem': 'Ɛberɛ aso sɛ menom aduro',
      'fante': 'Aber aso dɛ menom edur',
      'ga': 'Be eshɛ ni manu tsofa',
      'ewe': 'Ɣeyiɣi ɖo be mano atike',
      'dagbani': 'Saha paagi ni n-nyu tilaa'
    }
  },
  {
    id: 'hlth-doctor',
    icon: '🩺',
    category: 'health',
    colorKey: 'green',
    english: 'Call the doctor / nurse',
    translations: {
      'twi-asante': 'Frɛ dɔkota anaa nɛɛse no ma me',
      'twi-akuapem': 'Frɛ dɔkota anaa nɛɛse no ma me',
      'fante': 'Frɛ dɔketa anaa nɛɛse no ma me',
      'ga': 'Tsɛ dɔkita loo nɛɛsi lɛ ohalami',
      'ewe': 'Yɔ dɔketa alo dɔyɔla la nam',
      'dagbani': 'Boli dɔketa bee dɔɣiri tiim ma'
    }
  },
  {
    id: 'hlth-dizzy',
    icon: '🌀',
    category: 'health',
    colorKey: 'blue',
    english: 'I feel dizzy / weak',
    translations: {
      'twi-asante': "M'ani so yɛ me tumm, ahoɔden asa",
      'twi-akuapem': "M'ani so yɛ me tumm, ahoɔden asa",
      'fante': "M'anyi do yɛ me kusuu",
      'ga': 'Mihingmɛi huŋhuŋ, hegbalamɔ',
      'ewe': 'Ŋkume do biɖibiɖi, ŋusẽ vɔ lem',
      'dagbani': 'N-nini lebgimi, n-kpaŋmaŋ gbarigiya'
    }
  },
  {
    id: 'hlth-sleep',
    icon: '😴',
    category: 'health',
    colorKey: 'blue',
    english: 'I need to rest and sleep',
    translations: {
      'twi-asante': 'Mepɛ sɛ me kɔda gye m’ahome',
      'twi-akuapem': 'Mepɛ sɛ me kɔda gye m’ahome',
      'fante': 'Mepɛ dɛ mokɔda gye m’ahome',
      'ga': 'Miitao mawɔ koni majɔ mihe',
      'ewe': 'Medi be mamlɔ anyi aɖe ɖeɖi',
      'dagbani': 'M-bɔri ni n-gbihim biɛla'
    }
  },

  // --- DAILY NEEDS (SKY BLUE) ---
  {
    id: 'need-washroom',
    icon: '🚻',
    category: 'needs',
    colorKey: 'blue',
    english: 'I need to use the washroom / toilet',
    translations: {
      'twi-asante': 'Mepɛ sɛ mekɔ agyananbea / tiafi',
      'twi-akuapem': 'Mepɛ sɛ mekɔ agyananbea / tiafi',
      'fante': 'Mepɛ dɛ mokɔ fie / agyananbea',
      'ga': 'Miitao maya kɔɔlet / tiafi',
      'ewe': 'Medi be mayi afɔɖiƒe / kɔdzi',
      'dagbani': 'M-bɔri duɣu chandi'
    }
  },
  {
    id: 'need-cold',
    icon: '🥶',
    category: 'needs',
    colorKey: 'blue',
    english: 'I am feeling cold / cover me',
    translations: {
      'twi-asante': 'Awɔ de me, kata me so',
      'twi-akuapem': 'Awɔ de me, kata me so',
      'fante': 'Awɔw dze me, kata mo do',
      'ga': 'Fɛi miiyemi, ha amoo mi',
      'ewe': 'Vuvɔ le wuyem, tsɔ kɔnu tsyɔ dzinye',
      'dagbani': 'Maasim mali ma, lim ma'
    }
  },
  {
    id: 'need-hot',
    icon: '🥵',
    category: 'needs',
    colorKey: 'blue',
    english: 'I feel very hot / turn on fan',
    translations: {
      'twi-asante': 'Ahuhuro de me, bue fan no',
      'twi-akuapem': 'Ahuhuro de me, bue fan no',
      'fante': 'Hyehyew dze me, bue mframa adaka no',
      'ga': 'La miiyemi, tswaa fan lɛ',
      'ewe': 'Dzo le wuyem, si fan la',
      'dagbani': 'Tulim mali ma, kpuɣi fan maa'
    }
  },
  {
    id: 'need-phone',
    icon: '📱',
    category: 'needs',
    colorKey: 'orange',
    english: 'Pass me my phone',
    translations: {
      'twi-asante': 'Fa me fon ma me',
      'twi-akuapem': 'Fa me fon ma me',
      'fante': 'Fa me fon brɛ me',
      'ga': 'Ha mi mifone',
      'ewe': 'Tsɔ nye ka la nam',
      'dagbani': 'Ti ma n-fɔn'
    }
  },

  // --- TRANSIT & TROTRO (INDIGO) ---
  {
    id: 'tr-mate-stop',
    icon: '🚐',
    category: 'transit',
    colorKey: 'orange',
    english: 'Mate, I will alight here! Stop!',
    translations: {
      'twi-asante': 'Mate! Mesi ha! Gyina ha!',
      'twi-akuapem': 'Mate! Mesi ha! Gyina ha!',
      'fante': 'Kɔndɔktɔ! Mobi si ha! Gyina ha!',
      'ga': 'Mate! Makpɛ bi! Damɔ bi!',
      'ewe': 'Mate! Maɖi afisia! Tɔ ɖe afisia!',
      'dagbani': 'Gbanzaba! N yɛn shee la kpe! Zaŋmi!'
    },
    phonetics: {
      'twi-asante': 'mah-tay! meh-see hah! jee-nah hah!',
      'ga': 'mah-teh! mah-kpeh bee! dah-moh bee!'
    }
  },
  {
    id: 'tr-drop-front',
    icon: '⏩',
    category: 'transit',
    colorKey: 'orange',
    english: 'Move a bit forward before stopping',
    translations: {
      'twi-asante': 'Kɔ w’anim kakra',
      'twi-akuapem': 'Kɔ w’anim kakra',
      'fante': 'Kɔ w’enyim kakra',
      'ga': 'Yaa hiɛ fioo',
      'ewe': 'Yi ŋgɔ vie',
      'dagbani': 'Chaŋ tooni biɛla'
    }
  },
  {
    id: 'tr-fare-howmuch',
    icon: '💵',
    category: 'transit',
    colorKey: 'orange',
    english: 'How much is the trotro fare?',
    translations: {
      'twi-asante': 'Sika no yɛ ahe?',
      'twi-akuapem': 'Sika no yɛ ahe?',
      'fante': 'Sika no yɛ ahen?',
      'ga': 'Shika lɛ enyɛ?',
      'ewe': 'Ga la nye nenie?',
      'dagbani': 'Liɣiri maa nyɛla ala?'
    }
  },
  {
    id: 'tr-circle',
    icon: '🏙️',
    category: 'transit',
    colorKey: 'orange',
    english: 'Circle / Kwame Nkrumah Interchange',
    translations: {
      'twi-asante': 'Circle / Nkrumah Interchange',
      'twi-akuapem': 'Circle / Nkrumah Interchange',
      'fante': 'Circle / Nkrumah Interchange',
      'ga': 'Circle / Sakumo',
      'ewe': 'Circle / Nkrumah Interchange',
      'dagbani': 'Circle / Tamale Station'
    }
  },
  {
    id: 'tr-change',
    icon: '🪙',
    category: 'transit',
    colorKey: 'orange',
    english: 'I have small money / exact change',
    translations: {
      'twi-asante': 'Mewɔ sika nketenkete pɛpɛɛpɛ',
      'twi-akuapem': 'Mewɔ sika nketenkete pɛpɛɛpɛ',
      'fante': 'Mowɔ sika ntsentsen pɛpɛɛpɛ',
      'ga': 'Miyɛ shika bibii pɛpɛɛpɛ',
      'ewe': 'Ga suewo le asinye pɛpɛɛpɛ',
      'dagbani': 'N mali liɣiri bihi pɛpɛɛpɛ'
    }
  },

  // --- MARKET & COMMERCE (TEAL) ---
  {
    id: 'mkt-howmuch',
    icon: '🏷️',
    category: 'market',
    colorKey: 'orange',
    english: 'How much does this cost?',
    translations: {
      'twi-asante': 'Eyi boɔ yɛ ahe?',
      'twi-akuapem': 'Eyi boɔ yɛ ahe?',
      'fante': 'Iyi bo yɛ ahen?',
      'ga': 'Enɛ ji enyɛ?',
      'ewe': 'Esia nye nenie?',
      'dagbani': 'Ŋɔ bɔla ala?'
    }
  },
  {
    id: 'mkt-reduce',
    icon: '✂️',
    category: 'market',
    colorKey: 'green',
    english: 'Please discount or reduce the price',
    translations: {
      'twi-asante': 'Tee so kakra ma me, mepaakyɛw',
      'twi-akuapem': 'Tee so kakra ma me, mepaakyɛw',
      'fante': 'Tse do kakra ma me, mepawkyɛw',
      'ga': 'Gblaa nɔ fioo ohalami, ofaine',
      'ewe': 'Ɖe edzi vie nam meɖekuku',
      'dagbani': 'Filim biɛla ti ma, m-bɔri mi'
    }
  },
  {
    id: 'mkt-momo',
    icon: '📲',
    category: 'market',
    colorKey: 'orange',
    english: 'Can I pay you via MTN MoMo / Telecel Cash?',
    translations: {
      'twi-asante': 'Metumi de Mobile Money (MoMo) atua?',
      'twi-akuapem': 'Metumi de Mobile Money (MoMo) atua?',
      'fante': 'Mobotum mede MoMo atua?',
      'ga': 'Mabaanyɛ makɛ MoMo awo?',
      'ewe': 'Mate ŋu aɖo MoMo na wòa?',
      'dagbani': 'N ni tooi yo MoMo?'
    }
  },

  // --- FAMILY & PEOPLE (PURPLE/YELLOW) ---
  {
    id: 'fam-mother',
    icon: '👩',
    category: 'family',
    colorKey: 'yellow',
    english: 'Mother / Mom',
    translations: {
      'twi-asante': 'Maame / Ɛna',
      'twi-akuapem': 'Maame / Ɛna',
      'fante': 'Maame / Naa',
      'ga': 'Awo / Mami',
      'ewe': 'Da / Dada / Nɔnye',
      'dagbani': 'M-ma'
    }
  },
  {
    id: 'fam-father',
    icon: '👨',
    category: 'family',
    colorKey: 'yellow',
    english: 'Father / Dad',
    translations: {
      'twi-asante': 'Papa / Agya',
      'twi-akuapem': 'Papa / Agya',
      'fante': 'Egya / Papa',
      'ga': 'Ataa / Tsɛ',
      'ewe': 'Tɔ / Tɔnye / Papa',
      'dagbani': 'M-ba'
    }
  },
  {
    id: 'fam-child',
    icon: '🧒',
    category: 'family',
    colorKey: 'yellow',
    english: 'My Child / Baby',
    translations: {
      'twi-asante': 'Me ba',
      'twi-akuapem': 'Me ba',
      'fante': 'Me ba',
      'ga': 'Mibii',
      'ewe': 'Vinye',
      'dagbani': 'M-bia'
    }
  },
  {
    id: 'fam-caregiver',
    icon: '🧑‍⚕️',
    category: 'family',
    colorKey: 'yellow',
    english: 'My Caregiver / Assistant',
    translations: {
      'twi-asante': 'Me boafo',
      'twi-akuapem': 'Me boafo',
      'fante': 'Me boafo',
      'ga': 'Miwaalɔ',
      'ewe': 'Kpedenunyetɔ',
      'dagbani': 'N-sɔŋda'
    }
  }
];
