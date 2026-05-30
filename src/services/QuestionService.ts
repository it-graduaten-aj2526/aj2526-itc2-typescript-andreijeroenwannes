import Question from "../models/Question";
import { IApiQuestion } from "../types/interfaces/IApiQuestion.ts";
import { displayAlert } from "../utils";

export class QuestionService {
    baseUrl: string = 'https://opentdb.com/api.php?'
    categoryUrl: string = 'https://opentdb.com/api_category.php'

    constructor() {
    }

    getCategories = async () => {
        try {
            const response = await fetch(this.categoryUrl);

            if (!response.ok) {
                throw new Error("Categorieën konden niet worden opgehaald");
            }

            const data = await response.json();
            return data.trivia_categories;
        } catch (error) {
            displayAlert("Er ging iets mis bij het ophalen van de categorieën.");
            return [];
        }
    }

    getQuestions = async (amount: number, category: number, difficulty: string) => {
        try {
            let url = `${this.baseUrl}amount=${amount}`;

            if (category !== 0) {
                url += `&category=${category}`;
            }

            if (difficulty !== "") {
                url += `&difficulty=${difficulty}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Vragen konden niet worden opgehaald");
            }

            const data = await response.json();

            return this.mapQuestionsToQuestionModel(data.results);
        } catch (error) {
            displayAlert("Er ging iets mis bij het ophalen van de vragen.");
            return [];
        }
    }

    mapQuestionsToQuestionModel = (questions: IApiQuestion[]): Question[] => {
        let questionList: Question[] = [];

        for (const q of questions) {
            const question = new Question(q.question);
            question.addAnswer({ text: q.correct_answer, isCorrect: true });
            q.incorrect_answers.forEach(a => question.addAnswer({ text: a, isCorrect: false }));
            questionList.push(question);
        }

        return questionList;
    }
}