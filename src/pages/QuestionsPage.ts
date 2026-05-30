import { quiz, quizPage } from "../globals.ts";
import { QuestionMode } from "../types/enum/QuestionMode.ts";
import { QuestionService } from "../services/QuestionService.ts";
import { ICategory } from "../types/interfaces/ICategory.ts";
import { Difficulty } from "../types/enum/Difficulty.ts";
import { disableEl, displayAlert, enableEl, getElementWrapper } from "../utils";
import Question from "../models/Question.ts";

const questionService = new QuestionService();

const apiModeHtml: string = `
    <h2>API questions</h2>
    <p>Configure the API for retrieving questions</p>
    <select class="form-select" id="input-difficulty" data-testid="input-difficulty"></select>
    <select class="form-select mt-2" id="input-category" data-testid="input-category"></select>
    <button id="btn-fetch-questions" class="btn btn-primary mt-2" data-testid="btn-fetch-questions">Fetch questions</button>`;

const customModeHtml: string = `
    <h2>Custom questions</h2>
    <div class="row mb-3">
        <label for="input-question" class="col-sm-2 col-form-label">Question</label>
        <div class="col-sm-10">
            <input class="form-control" id="input-question" data-testid="input-question">
        </div>
    </div>
    <div class="row mb-3">
        <label for="input-correct-answer" class="col-sm-2 col-form-label">Correct answer</label>
        <div class="col-sm-10">
            <input class="form-control" id="input-correct-answer" data-testid="input-correct-answer">
        </div>
    </div>
    <div class="row mb-3">
        <label for="input-incorrect-answer" class="col-sm-2 col-form-label">Incorrect answer</label>
        <div class="col-sm-10">
            <div class="input-group">
                <input id="input-incorrect-answer" type="text" class="form-control"
                       data-testid="input-incorrect-answer">
                <button class="btn btn-outline-secondary" type="button" id="btn-add-incorrect-answer"
                        data-testid="btn-add-incorrect-answer">Add</button>
            </div>
        </div>
    </div>
    <table class="table table-bordered">
        <thead>
        <tr>
            <th scope="col">Question</th>
            <th scope="col">Correct answer</th>
            <th scope="col">Incorrect answers</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td id="output-question" data-testid="output-question"></td>
            <td><ul id="output-correct-answer" data-testid="output-correct-answer"></ul></td>
            <td><ul id="output-incorrect-answers" data-testid="output-incorrect-answers"></ul></td>
        </tr>
        </tbody>
    </table>
    <button type="submit" class="btn btn-primary" id="btn-submit-question" data-testid="btn-submit-question">Submit question</button>
`;

const questionsHtml: string = `
    <h2 class="mt-2">Confirmed questions <span id="question-counter" data-testid="question-counter">(0/0)</span></h2>
    <div id="questions" data-testid="questions">No questions to display</div>
`;

const fillCategories = async () => {
    const select = getElementWrapper<HTMLSelectElement>("#input-category");
    const categories = await questionService.getCategories();

    categories.forEach((c: ICategory) => {
        const option = document.createElement("option");
        option.value = c.id.toString();
        option.text = c.name;
        select.appendChild(option);
    });
};

const fillDifficulty = async () => {
    const select = getElementWrapper<HTMLSelectElement>("#input-difficulty");

    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.text = "Any difficulty";
    select.appendChild(emptyOption);

    Object.values(Difficulty).forEach(difficulty => {
        const option = document.createElement("option");
        option.value = difficulty;
        option.text = difficulty;
        select.appendChild(option);
    });
};

const updateQuestionList = () => {
    const questionsElement = getElementWrapper<HTMLDivElement>("#questions");
    const questionCounter = getElementWrapper<HTMLSpanElement>("#question-counter");
    const startButton = getElementWrapper<HTMLButtonElement>("#btn-start-quiz");

    questionCounter.textContent = `${quiz.questions.length}/${quiz.quizDuration}`;

    if (quiz.questions.length === 0) {
        questionsElement.textContent = "No questions to display";
    } else {
        questionsElement.innerHTML = "";

        quiz.questions.forEach(question => {
            const p = document.createElement("p");
            p.textContent = question.question;
            questionsElement.appendChild(p);
        });
    }

    if (quiz.questions.length >= quiz.quizDuration) {
        enableEl(startButton);
    } else {
        disableEl(startButton);
    }
};

export class QuestionsPage {
    private tempQuestion = new Question("");

    public constructor() {
    }

    public init(contentElement: HTMLElement) {
        const htmlToShow = quiz.getQuestionMode() === QuestionMode.Api ? apiModeHtml : customModeHtml;

        const fullHtml = `
            <div class="row">
                <div class="col">
                    <p data-testid="intro">A quiz can not start without questions. Add questions to the quiz by fetching them from an API or by adding them manually.</p>
                </div>
            </div>
            <div class="row">
                <div class="col">${htmlToShow}</div>
                <div class="col">${questionsHtml}</div>
            </div>
            <hr>
            <div class="row">
                <div class="col">
                    <button class="btn btn-success w-100" id="btn-start-quiz" data-testid="btn-start-quiz" disabled>Start quiz</button>
                </div>
            </div>
        `;

        contentElement.innerHTML = fullHtml;
        updateQuestionList();

        if (quiz.getQuestionMode() === QuestionMode.Api) {
            fillDifficulty();
            fillCategories();

            const fetchButton = getElementWrapper<HTMLButtonElement>("#btn-fetch-questions");

            fetchButton.addEventListener("click", async () => {
                const category = Number(getElementWrapper<HTMLSelectElement>("#input-category").value);
                const difficulty = getElementWrapper<HTMLSelectElement>("#input-difficulty").value;

                const questions = await questionService.getQuestions(quiz.quizDuration, category, difficulty);

                questions.forEach(question => quiz.addQuestion(question));
                updateQuestionList();
            });
        }

        if (quiz.getQuestionMode() === QuestionMode.Custom) {
            const questionInput = getElementWrapper<HTMLInputElement>("#input-question");
            const correctAnswerInput = getElementWrapper<HTMLInputElement>("#input-correct-answer");
            const incorrectAnswerInput = getElementWrapper<HTMLInputElement>("#input-incorrect-answer");

            const outputQuestion = getElementWrapper<HTMLTableCellElement>("#output-question");
            const outputCorrectAnswer = getElementWrapper<HTMLUListElement>("#output-correct-answer");
            const outputIncorrectAnswers = getElementWrapper<HTMLUListElement>("#output-incorrect-answers");

            const addIncorrectAnswerButton = getElementWrapper<HTMLButtonElement>("#btn-add-incorrect-answer");
            const submitQuestionButton = getElementWrapper<HTMLButtonElement>("#btn-submit-question");

            addIncorrectAnswerButton.addEventListener("click", () => {
                const incorrectAnswer = incorrectAnswerInput.value.trim();

                if (incorrectAnswer === "") {
                    displayAlert("Incorrect answer can not be empty");
                    return;
                }

                this.tempQuestion.addAnswer({ text: incorrectAnswer, isCorrect: false });

                const li = document.createElement("li");
                li.textContent = incorrectAnswer;
                outputIncorrectAnswers.appendChild(li);

                incorrectAnswerInput.value = "";
            });

            submitQuestionButton.addEventListener("click", () => {
                const questionText = questionInput.value.trim();
                const correctAnswer = correctAnswerInput.value.trim();

                const wordCount = questionText.split(/\s+/).filter(word => word !== "").length;

                if (wordCount < 4) {
                    displayAlert("Question should contain at least 4 words");
                    return;
                }

                outputQuestion.textContent = questionText;
                this.tempQuestion.question = questionText;

                if (correctAnswer === "") {
                    displayAlert("Question should contain at least 1 correct answer which can not be empty");
                    return;
                }

                outputCorrectAnswer.innerHTML = "";

                const correctAnswerItem = document.createElement("li");
                correctAnswerItem.textContent = correctAnswer;
                outputCorrectAnswer.appendChild(correctAnswerItem);

                const incorrectAnswers = this.tempQuestion.answers.filter(answer => !answer.isCorrect);

                if (incorrectAnswers.length < 2) {
                    displayAlert("Question should contain at least 2 incorrect answers");
                    return;
                }

                const question = new Question(questionText);
                question.addAnswer({ text: correctAnswer, isCorrect: true });

                incorrectAnswers.forEach(answer => {
                    question.addAnswer(answer);
                });

                quiz.addQuestion(question);

                this.tempQuestion = new Question("");

                questionInput.value = "";
                correctAnswerInput.value = "";
                incorrectAnswerInput.value = "";

                outputQuestion.textContent = "";
                outputCorrectAnswer.innerHTML = "";
                outputIncorrectAnswers.innerHTML = "";

                updateQuestionList();
            });
        }

        const startButton = getElementWrapper<HTMLButtonElement>("#btn-start-quiz");

        startButton.addEventListener("click", () => {
            quiz.startQuiz();
            quizPage.init(contentElement);
        });
    }
}