import Question from "./Question";
import Player from "./Player";
import {QuestionMode} from "../types/enum/QuestionMode";
import {GameMode} from "../types/enum/GameMode.ts";

export class Quiz {
    public isRunning: boolean = false;
    public questions: Question[] = [];
    public quizDuration: number = 0;
    public players: Player[] = [];
    private currentQuestionIndex: number;
    private currentPlayerIndex: number;
    private gameMode: GameMode;
    public questionMode: QuestionMode;
    private numberOfPlayers: number = 1;
    private totalAmountOfQuestionToBeAsked: number = 0;
    private amountOfQuestionsAlreadyAsked: number = 0;

    public constructor(duration: number) {
        this.quizDuration = duration;
        this.currentPlayerIndex = 0;
        this.currentQuestionIndex = 0;
        this.gameMode = GameMode.Single;
        this.questionMode = QuestionMode.Custom;
    }

    public getGameMode() { return this.gameMode }

    public getQuestionMode(): QuestionMode { return this.questionMode; }

    public getNumberOfPlayers(): number { return this.numberOfPlayers; }

    public getCurrentPlayerName(): string { return this.players[this.currentPlayerIndex].name; }

    public getCurrentQuestion()
    {
        return this.questions[this.currentQuestionIndex];
    }

    public updateCurrentPlayerScore(amount: number)
    {
        return this.players[this.currentPlayerIndex].score += amount;
    }

    public setQuestionMode(mode: QuestionMode) { this.questionMode = mode; }

    private updateTotalAmountOfQuestionToBeAsked() { this.totalAmountOfQuestionToBeAsked = this.questions.length * this.numberOfPlayers; }

    public addQuestion(q: Question) { this.questions.push(q) }

    public addPlayer(name: string)
    {
        let player = new Player(name);
        this.players.push(player);
    }

    private getAmountOfPlayers() { return this.players.length }

    public removePlayer(name: string)
    {
        let removeName = this.players.filter((player) => player.name !== name);
        return this.players = removeName;
    }

    public startQuiz() {
        this.isRunning = true;
        this.getAmountOfPlayers();
        this.shuffleAnswersInQuestions();
        this.updateTotalAmountOfQuestionToBeAsked();
    }

    public testIfAnswerIsCorrect(answer: string) {
        let currentQuestion = this.getCurrentQuestion();
        let correctAnswer = currentQuestion.answers.find(possibleAnswer => possibleAnswer.text === answer && possibleAnswer.isCorrect);
        return !!correctAnswer;
    }

    public nextQuestion()
    {
        this.amountOfQuestionsAlreadyAsked++;
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex >= this.questions.length) {
            this.currentQuestionIndex = 0;
            this.currentPlayerIndex++;
        }

        if (this.amountOfQuestionsAlreadyAsked >= this.totalAmountOfQuestionToBeAsked){
            this.endQuiz();
        }
    }

    private shuffleAnswersInQuestions()
    {
        for (const question of this.questions) {
            for (let i = question.answers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [question.answers[i], question.answers[j]] = [question.answers[j], question.answers[i]];
            }
        }
    }

    private endQuiz()
    {
        this.isRunning = false;
    }

    public setGameMode(gameMode: GameMode, amountOfPlayers: number)
    {
        this.gameMode = gameMode;
        this.numberOfPlayers = amountOfPlayers;
        this.currentPlayerIndex = 0;
        this.currentQuestionIndex = 0;
    }

    public sortPlayersByScore()
    {
        return this.players.sort((player1, player2) => player2.score - player1.score);
    }

    public resetGame() {
        this.endQuiz();
        this.questionMode = QuestionMode.Custom;
        this.questions = [];
        this.players = [];
        this.gameMode = GameMode.Single;
        this.numberOfPlayers = 1;
        this.currentQuestionIndex = 0;
        this.currentPlayerIndex = 0;
        this.totalAmountOfQuestionToBeAsked = 0;
        this.amountOfQuestionsAlreadyAsked = 0;
    }
}