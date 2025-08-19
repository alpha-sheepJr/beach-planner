import { beachKeyMap } from './beachesMap.js';
export class BeachRouter {
    constructor() {
        this.beachChoiceButton = null;
        this.beachInput = null;
        this.beachesMap = beachKeyMap;
    }
    init() {
        this.beachChoiceButton = document.getElementById('beach-choice-button');
        this.beachInput = document.getElementById('beach-input');
        this.beachChoiceButton?.addEventListener('click', () => this.handleBeachSelection());
    }
    handleBeachSelection() {
        if (!this.beachInput)
            return;
        const selectedLabel = this.beachInput.value.trim();
        const beachId = this.beachesMap[selectedLabel];
        if (beachId) {
            history.pushState(null, "", `/beach/${beachId}`);
            window.dispatchEvent(new PopStateEvent("popstate"));
        }
        else {
            alert("Please select a valid beach from the list.");
        }
    }
}
