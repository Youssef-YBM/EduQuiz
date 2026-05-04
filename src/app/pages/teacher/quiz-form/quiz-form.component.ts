import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';
import { AuthService } from '../../../services/auth.service';
import { Quiz } from '../../../models/quiz.model';

@Component({
  selector: 'app-quiz-form',
  standalone: true,  // <-- Assurez-vous que c'est standalone
  imports: [CommonModule, ReactiveFormsModule],  // <-- AJOUTER ReactiveFormsModule
  templateUrl: './quiz-form.html',
  styleUrls: ['./quiz-form.css']
})
export class QuizFormComponent implements OnInit {
  quizForm: FormGroup;
  isEditMode: boolean = false;
  quizId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.quizForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      level: ['Débutant', Validators.required],
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('id');
    
    if (this.quizId && this.quizId !== 'new') {
      this.isEditMode = true;
      this.loadQuiz();
    } else {
      this.addQuestion();
    }
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  createQuestionForm(): FormGroup {
    return this.fb.group({
      text: ['', Validators.required],
      answers: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      correctIndex: [0, Validators.required],
      explanation: ['']
    });
  }

  getAnswers(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }

  addQuestion(): void {
    this.questions.push(this.createQuestionForm());
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  getLetter(index: number): string {
    return ['A', 'B', 'C', 'D'][index];
  }

  private loadQuiz(): void {
    const quiz = this.quizService.getQuizById(this.quizId!);
    if (quiz) {
      this.quizForm.patchValue({
        title: quiz.title,
        description: quiz.description,
        level: quiz.level
      });
      
      quiz.questions.forEach(question => {
        const questionForm = this.createQuestionForm();
        questionForm.patchValue({
          text: question.text,
          correctIndex: question.correctIndex,
          explanation: question.explanation || ''
        });
        
        const answersArray = questionForm.get('answers') as FormArray;
        question.answers.forEach((answer, index) => {
          if (answersArray.at(index)) {
            answersArray.at(index).setValue(answer);
          }
        });
        
        this.questions.push(questionForm);
      });
    }
  }

  onSubmit(): void {
    if (this.quizForm.invalid) {
      Object.values(this.quizForm.controls).forEach(c => c.markAsTouched());
      return;
    }
    
    const formValue = this.quizForm.value;
    const currentUser = this.authService.getCurrentUser();
    
    if (this.isEditMode && this.quizId) {
      this.quizService.updateQuiz(this.quizId, formValue);
    } else {
      const newQuiz: Omit<Quiz, 'id' | 'createdAt' | 'ownerName'> = {
        title: formValue.title,
        description: formValue.description,
        level: formValue.level,
        ownerId: currentUser?.id || '',
        questions: formValue.questions
      };
      this.quizService.createQuiz(newQuiz);
    }
    
    this.router.navigate(['/teacher/my-quizzes']);
  }
}