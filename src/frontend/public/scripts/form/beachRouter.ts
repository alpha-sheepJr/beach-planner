
import { beachKeyMap } from './beachesMap.js'

export class BeachRouter {
  private beachChoiceButton: HTMLButtonElement | null = null;
  private beachInput: HTMLInputElement | null = null;
  private beachesMap: Record<string, string>;


  constructor() {
    this.beachesMap = beachKeyMap;
  }

  init(): void {
    this.beachChoiceButton = document.getElementById('beach-choice-button') as HTMLButtonElement | null;
    this.beachInput = document.getElementById('beach-input') as HTMLInputElement | null;

    this.beachChoiceButton?.addEventListener('click', () => this.handleBeachSelection());
  }

  private handleBeachSelection(): void {
    if (!this.beachInput) return;

    const selectedLabel = this.beachInput.value.trim();
    const beachId = this.beachesMap[selectedLabel];

    if (beachId) {
      history.pushState(null, "", `/beach/${beachId}`);
      window.dispatchEvent(new PopStateEvent("popstate"));
    } else {
      alert("Please select a valid beach from the list.");
    }
  }
}