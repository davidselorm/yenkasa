import { GhanaianLanguage, LanguageInfo, CategoryInfo, AACCategory } from '../types';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    id: 'twi-asante',
    name: 'Asante Twi',
    localName: 'Asante Twi',
    dialect: 'Akan (Ashanti)',
    region: 'Ashanti, Ahafo & Eastern Regions',
    sampleGreeting: 'Mema wo akye (Good Morning)'
  },
  {
    id: 'twi-akuapem',
    name: 'Akuapem Twi',
    localName: 'Akuapem Twi',
    dialect: 'Akan (Akuapem Ridge)',
    region: 'Eastern Region (Akropong, Aburi)',
    sampleGreeting: 'Mema wo akye (Good Morning)'
  },
  {
    id: 'fante',
    name: 'Fante (Mfantse)',
    localName: 'Mfantse',
    dialect: 'Akan (Coastal)',
    region: 'Central & Western Regions (Cape Coast, Takoradi)',
    sampleGreeting: 'Me ma wo akye / Me kyea wo'
  },
  {
    id: 'ga',
    name: 'Gã',
    localName: 'Gã',
    dialect: 'Kwa (Accra Plains)',
    region: 'Greater Accra (Accra, Tema, Osu, Jamestown)',
    sampleGreeting: 'Minge Oyiwala donn / Awula nyoŋmɔ'
  },
  {
    id: 'ewe',
    name: 'Ewe (Èʋegbe)',
    localName: 'Èʋegbe',
    dialect: 'Gbe language group',
    region: 'Volta Region (Ho, Keta, Aflao, Hohoe)',
    sampleGreeting: 'Ndi na wò / Ŋdi na mi'
  },
  {
    id: 'dagbani',
    name: 'Dagbani (Dagbanli)',
    localName: 'Dagbanli',
    dialect: 'Gur (Mole-Dagbani)',
    region: 'Northern Region (Tamale, Yendi)',
    sampleGreeting: 'Desiba / Antire'
  }
];

export const AAC_CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    englishName: 'All Cards',
    name: {
      'twi-asante': 'Nyinaa',
      'twi-akuapem': 'Ne Nyinaa',
      'fante': 'Nyinara',
      'ga': 'Fɛɛ',
      'ewe': 'Wo katã',
      'dagbani': 'Zaayuma'
    },
    icon: 'Grid',
    color: 'bg-slate-700 text-white'
  },
  {
    id: 'emergency',
    englishName: 'Emergency / Safety',
    name: {
      'twi-asante': 'Ntɛmntɛm / Ahoɔhiahia',
      'twi-akuapem': 'Ntɛmntɛm / Ahoɔhiahia',
      'fante': 'Ntsɛm / Ahoɔhia',
      'ga': 'Oya oya / Gbefaŋ',
      'ewe': 'Kaba kaba / Dɔmedzoe',
      'dagbani': 'Yoma yoma / Kpibu'
    },
    icon: 'AlertTriangle',
    color: 'bg-red-600 text-white'
  },
  {
    id: 'greetings',
    englishName: 'Greetings & Politeness',
    name: {
      'twi-asante': 'Nkɔmmɔbɔ & Nkyia',
      'twi-akuapem': 'Nkɔmmɔ & Nkyia',
      'fante': 'Nkɔmbɔ & Nkyia',
      'ga': 'Ngmami & Weku',
      'ewe': 'Gbedoname & Fafadodo',
      'dagbani': 'Puhigu & Zoligu'
    },
    icon: 'Smile',
    color: 'bg-pink-600 text-white'
  },
  {
    id: 'food',
    englishName: 'Food & Drinks',
    name: {
      'twi-asante': 'Aduane & Nsuo',
      'twi-akuapem': 'Aduane & Nsuo',
      'fante': 'Edziban & Nsu',
      'ga': 'Niyelii & Nu',
      'ewe': 'Nuɖuɖu & Tsi',
      'dagbani': 'Bindirigu & Kom'
    },
    icon: 'Utensils',
    color: 'bg-amber-600 text-white'
  },
  {
    id: 'health',
    englishName: 'Health, Pain & Body',
    name: {
      'twi-asante': 'Ayaresa & Ahoɔden',
      'twi-akuapem': 'Ayaresa & Ahoɔden',
      'fante': 'Ayaresa & Nyimdzee',
      'ga': 'Helamɔ & Gbɔmɔtso',
      'ewe': 'Lãmesẽ & Dɔléle',
      'dagbani': 'Alaafee & Dɔro'
    },
    icon: 'HeartPulse',
    color: 'bg-emerald-600 text-white'
  },
  {
    id: 'needs',
    englishName: 'Daily Needs & Wants',
    name: {
      'twi-asante': 'Nneɛma a Me Hia',
      'twi-akuapem': 'Nneɛma a Me Hia',
      'fante': 'Ndzɛmba a Me Hia',
      'ga': 'Nibii ni Me Hia',
      'ewe': 'Nusiawo mehiã',
      'dagbani': 'N bɔrimini bɔbigu'
    },
    icon: 'Hand',
    color: 'bg-sky-600 text-white'
  },
  {
    id: 'transit',
    englishName: 'Trotro & Places',
    name: {
      'twi-asante': 'Trotro & Akwantuo',
      'twi-akuapem': 'Trotro & Akwantuo',
      'fante': 'Trotro & Akwantukɔ',
      'ga': 'Trotro & Gbɛfaa',
      'ewe': 'Trotro & Mɔzɔzɔ',
      'dagbani': 'Loori & Chandi'
    },
    icon: 'Bus',
    color: 'bg-indigo-600 text-white'
  },
  {
    id: 'market',
    englishName: 'Market & Money',
    name: {
      'twi-asante': 'Gua so & Sika',
      'twi-akuapem': 'Gua so & Sika',
      'fante': 'Gua do & Sika',
      'ga': 'Jaa nɔ & Shika',
      'ewe': 'Asi me & Ga',
      'dagbani': 'Daa & Liɣiri'
    },
    icon: 'ShoppingBag',
    color: 'bg-teal-600 text-white'
  },
  {
    id: 'family',
    englishName: 'Family & People',
    name: {
      'twi-asante': 'Abusua & Nnipa',
      'twi-akuapem': 'Abusua & Nnipa',
      'fante': 'Ebusua & Nyimpa',
      'ga': 'Weku & Gbɔmɛi',
      'ewe': 'Ƒome & Amewo',
      'dagbani': 'Daŋ & Ninsalinima'
    },
    icon: 'Users',
    color: 'bg-purple-600 text-white'
  }
];
