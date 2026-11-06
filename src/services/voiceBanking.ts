import { CustomVoiceBankCard, GhanaianLanguage, AACTile } from '../types';

const STORAGE_KEY_VOICEBANK = 'yenkasa_voicebank_cards_v1';

class VoiceBankingService {
  private cards: CustomVoiceBankCard[] = [];

  constructor() {
    this.loadCards();
  }

  private loadCards(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VOICEBANK);
      if (saved) {
        this.cards = JSON.parse(saved);
        return;
      }
    } catch (e) {
      console.warn('Failed to load custom voicebank cards', e);
    }

    // Default starter custom phrases
    this.cards = [
      {
        id: 'custom-bank-name',
        icon: '⭐',
        category: 'greetings',
        english: 'My name is Kofi Selorm',
        translations: {
          'twi-asante': 'Me din de Kofi Selorm',
          'twi-akuapem': 'Me din de Kofi Selorm',
          'fante': 'Me dzin dze Kofi Selorm',
          'ga': 'Migbɛi ji Kofi Selorm',
          'ewe': 'Nye ŋkɔe nye Kofi Selorm',
          'dagbani': 'N-yuli n-nyɛ Kofi Selorm'
        },
        createdAt: new Date().toISOString()
      },
      {
        id: 'custom-bank-momo-pin',
        icon: '🔒',
        category: 'market',
        english: 'Please confirm the MoMo transaction on my phone',
        translations: {
          'twi-asante': 'Mepaakyɛw yɛ confirm wɔ me fon no so',
          'twi-akuapem': 'Mepaakyɛw yɛ confirm wɔ me fon no so',
          'fante': 'Mepawkyɛw yɛ confirm wɔ me fon no do',
          'ga': 'Ofaine feemɔ confirm yɛ mifone nɔ',
          'ewe': 'Meɖekuku confirm le nye ka la dzi',
          'dagbani': 'M-bɔri mi, niŋmi confirm n-fɔn maa zuɣu'
        },
        createdAt: new Date().toISOString()
      }
    ];
  }

  public getCards(): CustomVoiceBankCard[] {
    return [...this.cards];
  }

  public getAsAACTiles(): AACTile[] {
    return this.cards.map(c => ({
      id: c.id,
      icon: c.icon,
      category: c.category,
      colorKey: 'pink',
      translations: c.translations,
      english: c.english,
      isCustom: true
    }));
  }

  public addCard(
    english: string,
    translations: Record<GhanaianLanguage, string>,
    icon: string,
    audioDataUrl?: string
  ): CustomVoiceBankCard {
    const newCard: CustomVoiceBankCard = {
      id: `custom-${Date.now()}`,
      icon: icon || '💬',
      category: 'needs',
      english,
      translations,
      recordedAudioDataUrl: audioDataUrl,
      createdAt: new Date().toISOString()
    };

    this.cards.unshift(newCard);
    this.save();
    return newCard;
  }

  public deleteCard(id: string): void {
    this.cards = this.cards.filter(c => c.id !== id);
    this.save();
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY_VOICEBANK, JSON.stringify(this.cards));
    } catch (e) {
      console.error('Failed to save custom voicebank cards', e);
    }
  }

  public exportBackup(): string {
    return JSON.stringify(this.cards, null, 2);
  }

  public importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        this.cards = parsed;
        this.save();
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }
}

export const voiceBankingService = new VoiceBankingService();
