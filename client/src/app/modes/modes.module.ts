import { NgModule } from '@angular/core';
import { ModesComponent } from './modes.component';
import { EditComponent } from './edit/edit.component';
import { QuizComponent } from './quiz/quiz.component';
import { StudyComponent } from './study/study.component';
import { DecksComponent } from './decks/decks.component';
import { DeckComponent } from './decks/deck/deck.component';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './edit/card/card.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@NgModule({
  imports: [FormsModule, RouterOutlet, RouterLink],
  declarations: [
    ModesComponent,
    EditComponent,
    QuizComponent,
    StudyComponent,
    DecksComponent,
    DeckComponent,
    CardComponent,
  ],
  exports: [ModesComponent],
})
export class ModesModule {}
