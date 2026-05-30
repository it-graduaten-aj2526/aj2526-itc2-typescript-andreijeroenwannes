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
            const data = await response.json();

            return data.trivia_categories;
        } catch (error) {
            displayAlert('Categorieën konden niet opgehaald worden');
            return [];
        }
    }

    getQuestions = async (amount: number, category: number, difficulty: string) => {
        try {
            const url =
                `${this.baseUrl}amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;

            const response = await fetch(url);
            const data = await response.json();

            return this.mapQuestionsToQuestionModel(data.results);
        } catch (error) {
            displayAlert('Vragen konden niet opgehaald worden');
            return [];
        }
    }

    mapQuestionsToQuestionModel = (questions: IApiQuestion[]): Question[] => {
        let questionList: Question[] = [];

        for (const q of questions) {
            const question = new Question(q.question);

            question.addAnswer({
                text: q.correct_answer,
                isCorrect: true
            });

            q.incorrect_answers.forEach(a =>
                question.addAnswer({
                    text: a,
                    isCorrect: false
                })
            );

            questionList.push(question);
        }

        return questionList;
    }
}