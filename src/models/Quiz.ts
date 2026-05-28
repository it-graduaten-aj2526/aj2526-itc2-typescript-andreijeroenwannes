import Question from "./Question";
import Player from "./Player";
import {QuestionMode} from "../types/enum/QuestionMode";
import {GameMode} from "../types/enum/GameMode.ts";
import player from "./Player";

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
        this.numberOfPlayers = 1;
    }

    public getGameMode() {
        return this.gameMode;
    }

    public getQuestionMode(): QuestionMode
    {
        return this.questionMode;
    }

    public getNumberOfPlayers(): number { return this.numberOfPlayers; }

    //public getCurrentPlayerName(): string {  }

    public getCurrentQuestion() { return this.questions }

    public updateCurrentPlayerScore(amount: number)
    {

    }

    public setQuestionMode(mode: QuestionMode) { this.questionMode = mode; }

    private updateTotalAmountOfQuestionToBeAsked() { this.totalAmountOfQuestionToBeAsked = this.questions.length * this.numberOfPlayers; }

    public addQuestion(q: Question) { this.questions.push(q) }

    public addPlayer(name: string) { let player = new Player(name);
    this.players.push(player);}

    private getAmountOfPlayers() { return this.players.length }

    public removePlayer(name: string)
    {
        let removeName = this.players.filter((player) => player.name !== name);
        return this.players = removeName;
    }

    public startQuiz() {
        this.isRunning = true;
        this.getAmountOfPlayers();
        this.updateTotalAmountOfQuestionToBeAsked();
    }

    /*public testIfAnswerIsCorrect(answer: string) {
        if () {

        }
    }*/

    //public nextQuestion() {}

    /*private shuffleAnswersInQuestions() {
        for (const question in this.questions) {

        }
    }*/

    private endQuiz() { this.isRunning = false; }

    public setGameMode(gameMode: GameMode, amountOfPlayers: number)
    {
        this.gameMode = gameMode;
        this.numberOfPlayers = amountOfPlayers;
        this.currentPlayerIndex = 0;
        this.currentQuestionIndex = 0;
    }

    //public sortPlayersByScore() {}

    public resetGame() {
        this.isRunning = false;
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