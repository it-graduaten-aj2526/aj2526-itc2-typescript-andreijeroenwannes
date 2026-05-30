// language=HTML
import { displayAlert, getElementWrapper } from "../utils";
import { quiz, scoreboardPage } from "../globals.ts";

const html: string = `
    <div class="row">
        <div class="col">
            <p data-testid="intro">Try to score as many points as possible by answering the questions correctly. Good
                luck!</p>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div id="current-player-container" class="" data-testid="current-player-container">
                <p><span class="fw-bold">Current player: </span><span id="current-player-name"
                                                                      data-testid="current-player-name"></span></p>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div id="quiz-container" class="" data-testid="quiz-container">
                <p><span class="fw-bold">Question: </span><span id="question" data-testid="question"></span></p>
                <p class="fw-bold">Select the correct answer!</p>
                <div id="answer-container" class="mb-3" data-testid="answer-container"></div>
                <button id="btn-submit-answer" class="btn btn-success" data-testid="btn-submit-answer">
                    Submit Answer
                </button>
            </div>
        </div>
    </div>
`;

export class QuizPage {

    public constructor() {
    }

    public init(element: HTMLElement) {

        element.innerHTML = html;

        this.updatePlayerName();

        this.updateCurrentQuestion();

        getElementWrapper<HTMLButtonElement>('#btn-submit-answer')
            .addEventListener('click', () => this.submitAnswer());
    }

    private updatePlayerName() {

        const currentPlayer =
            getElementWrapper<HTMLSpanElement>('#current-player-name');

        currentPlayer.textContent =
            quiz.getCurrentPlayerName();
    }

    private submitAnswer() {

        const selected =
            document.querySelector<HTMLInputElement>(
                'input[name="answer"]:checked'
            );

        if (!selected) {
            displayAlert('Selecteer een antwoord');
            return;
        }

        const isCorrect =
            quiz.testIfAnswerIsCorrect(selected.value);

        if (isCorrect) {
            quiz.updateCurrentPlayerScore(1);
        }

        quiz.nextQuestion();

        if (!quiz.isRunning) {

            scoreboardPage.init(
                getElementWrapper<HTMLDivElement>('#content')
            );

            return;
        }

        this.updatePlayerName();

        this.updateCurrentQuestion();
    }

    private updateCurrentQuestion() {

        const currentQuestion = quiz.getCurrentQuestion();

        getElementWrapper<HTMLHeadingElement>('#question')
            .innerText = currentQuestion.question;

        const answers = currentQuestion.answers;

        const answerContainer =
            getElementWrapper<HTMLDivElement>('#answer-container');

        answerContainer.innerHTML = "";

        answers.forEach((answer) => {

            const formCheck = document.createElement("div");

            formCheck.className = "form-check";

            const radioInput = document.createElement("input");

            radioInput.type = "radio";
            radioInput.className = "form-check-input";
            radioInput.name = "answer";
            radioInput.value = answer.text;

            const label = document.createElement("label");

            label.className = "form-check-label";

            label.appendChild(radioInput);

            label.appendChild(
                document.createTextNode(answer.text)
            );

            formCheck.appendChild(label);

            answerContainer.appendChild(formCheck);
        });
    }
}