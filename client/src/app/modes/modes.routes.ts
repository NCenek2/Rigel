import { Routes } from '@angular/router';
import { DecksComponent } from './decks/decks.component';
import { QuizComponent } from './quiz/quiz.component';
import { StudyComponent } from './study/study.component';
import { EditComponent } from './edit/edit.component';

export const modesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'decks',
    pathMatch: 'full',
  },
  {
    path: 'decks',
    pathMatch: 'full',
    component: DecksComponent,
    title: 'Decks',
  },
  {
    path: 'quiz',
    pathMatch: 'full',
    component: QuizComponent,
    title: 'Quiz Mode',
  },
  {
    path: 'study',
    pathMatch: 'full',
    component: StudyComponent,
    title: 'Study Mode',
  },
  {
    path: 'edit',
    pathMatch: 'full',
    component: EditComponent,
    title: 'Edit Mode',
  },
];
