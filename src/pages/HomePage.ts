import { playersPage, quiz } from "../globals.ts";
import { GameMode } from "../types/enum/GameMode.ts";
import { QuestionMode } from "../types/enum/QuestionMode.ts";
import { displayAlert, getElementWrapper, hideEl, showEl } from "../utils";

// language=HTML
const html: string = `
    <div class="row">
        <p data-testid="intro">Welcome to the happy coding quiz! This quiz can be played solo or with multiple players. Please start by configuring
            your quiz settings.</p>
    </div>
    <div class="row g-3">
        <div class="col-md-12">
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="input-game-mode" data-testid="input-game-mode"/>
                <label class="form-check-label" for="input-game-mode"><span
                        id="lbl-game-mode" data-testid="lbl-game-mode">Single player</span></label>
            </div>
        </div>
        <div class="col-md-12 d-none" id="rowAmountPlayers">
            <input class="form-control" id="input-amount-players" data-testid="input-amount-players" placeholder="Enter the amount of players">
        </div>
        <div class="col-md-12">
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="input-question-mode" data-testid="input-question-mode"/>
                <label class="form-check-label" for="input-question-mode"><span
                        id="lbl-question-mode" data-testid="lbl-question-mode">Free input</span></label>
            </div>
        </div>
        <div class="col-md-12">
            <input class="form-control" id="input-question-amount" data-testid="input-question-amount" placeholder="Enter the amount of questions">
        </div>
    </div>
    <hr>
    <div class="row">
        <div class="col">
            <button id="btn-save-configuration" class="btn btn-success w-100" data-testid="btn-save-configuration">Save configuration</button>
            
        </div>
    </div>
`;

export class HomePage {
    public constructor() {
    }

    public init(contentElement: HTMLElement) {
        contentElement.innerHTML = html;
        getElementWrapper<HTMLButtonElement>('#btn-save-configuration').addEventListener('click', () => this.saveConfiguration());
        getElementWrapper<HTMLInputElement>('#input-game-mode').addEventListener('change', () => this.toggleGameModeLabel());
        getElementWrapper<HTMLInputElement>('#input-question-mode').addEventListener('change', () => this.toggleQuestionModeLabel());
    }

private validateFields = (): boolean => {

    const inputQuestionAmount = getElementWrapper<HTMLInputElement>('#input-question-amount');

    if (inputQuestionAmount.value.trim() === '') {
        displayAlert('Geef het aantal vragen in');
        return false;
    }

    const amountQuestions = parseInt(inputQuestionAmount.value);

    if (isNaN(amountQuestions) || amountQuestions <= 0) {
        displayAlert('Aantal vragen moet groter zijn dan 0');
        return false;
    }

    const inputGameMode = getElementWrapper<HTMLInputElement>('#input-game-mode');

    if (inputGameMode.checked) {

        const inputAmountPlayers = getElementWrapper<HTMLInputElement>('#input-amount-players');

        if (inputAmountPlayers.value.trim() === '') {
            displayAlert('Geef het aantal spelers in');
            return false;
        }

        const amountPlayers = parseInt(inputAmountPlayers.value);

        if (isNaN(amountPlayers) || amountPlayers < 2) {
            displayAlert('Multiplayer vereist minstens 2 spelers');
            return false;
        }
    }

    return true;
}

    private saveConfiguration = () => {
        if (!this.validateFields()) {
            return;
        }
        const inputGameMode = getElementWrapper<HTMLInputElement>('#input-game-mode');
        const gameMode = inputGameMode.checked ? GameMode.Multi : GameMode.Single;
        const inputQuestionMode = getElementWrapper<HTMLInputElement>('#input-question-mode');
        const questionMode = inputQuestionMode.checked ? QuestionMode.Api : QuestionMode.Custom;
        const inputAmountQuestions = getElementWrapper<HTMLInputElement>('#input-question-amount');
        const amountQuestions = parseInt(inputAmountQuestions.value);
        let amountOfPlayers = 1;

        if (gameMode === GameMode.Multi) {
            const inputAmountPlayers = getElementWrapper<HTMLInputElement>('#input-amount-players');
            amountOfPlayers = parseInt(inputAmountPlayers.value);
        }

        quiz.setGameMode(gameMode, amountOfPlayers);
        quiz.setQuestionMode(questionMode);
        quiz.quizDuration = amountQuestions;

        playersPage.init(getElementWrapper<HTMLDivElement>('#content'))
    }
private toggleQuestionModeLabel = () => {

    const inputQuestionMode = getElementWrapper<HTMLInputElement>('#input-question-mode');

    const label = getElementWrapper<HTMLSpanElement>('#lbl-question-mode');

    if (inputQuestionMode.checked) {
        label.textContent = 'API';
    } else {
        label.textContent = 'Free input';
    }
}
private toggleGameModeLabel = () => {

    const inputGameMode = getElementWrapper<HTMLInputElement>('#input-game-mode');

    const label = getElementWrapper<HTMLSpanElement>('#lbl-game-mode');

    const rowPlayers = getElementWrapper<HTMLDivElement>('#rowAmountPlayers');

    if (inputGameMode.checked) {
        label.textContent = 'Multiplayer';
        showEl(rowPlayers);
    } else {
        label.textContent = 'Single player';
        hideEl(rowPlayers);
    }
}
}