import { Component, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AlertService } from "../../alert/alert.service";
import { CARD, DECK } from "../../shared/shared.constants";
import { CardsService } from "../cards.service";
import { DecksService } from "../decks/decks.service";
import { CardComponent } from "./card/card.component";
import { Card, NewCard } from "./card/card.model";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.css"],
  imports: [FormsModule, CardComponent, RouterLink],
})
export class EditComponent implements OnInit {
  constructor(
    private readonly decksService: DecksService,
    private readonly alertsService: AlertService,
    public readonly cardsService: CardsService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  deck_name_old = "";
  deckTitle = signal("");
  decks = this.decksService.allDecks();

  cards = this.cardsService.cards;

  deckNameLength = DECK.DECK_NAME_LENGTH;
  cardTermLength = CARD.CARD_TERM_LENGTH;
  cardDefinitionLength = CARD.CARD_DEFINITION_LENGTH;

  ngOnInit(): void {
    this.cardsService.reset();
    this.cardsService.setCards(this.decksService.currentDeck?.cards ?? []);
    this.deckTitle.set(this.decksService.currentDeck?.deck_name ?? "");
  }

  hasIncompleteCards() {
    const incompleteCards = this.cards().some(
      (card) => card.term.trim() === "" || card.definition.trim() === "",
    );

    if (incompleteCards) {
      this.alertsService.setAlert("Card Term or Definitions cannot be empty");
    }
    return incompleteCards;
  }

  titleExceedsLength() {
    const exceedsLength = this.deckTitle.length > DECK.DECK_NAME_LENGTH;

    if (exceedsLength) {
      this.alertsService.setAlert(
        `Deck name cannot exceed ${DECK.DECK_NAME_LENGTH} characters`,
      );
    }

    return exceedsLength;
  }

  titleIsEmpty() {
    const trimmedTitle = this.deckTitle().trim();

    if (!trimmedTitle) {
      this.alertsService.setAlert(`Deck name must not be whitespace or empty`);
    }

    return !trimmedTitle;
  }

  termOrDefinitionExceedsLength() {
    let cardLengthExceeded = false;

    for (let card of this.cards()) {
      if (card.term.length > CARD.CARD_TERM_LENGTH) {
        cardLengthExceeded = true;
        this.alertsService.setAlert(
          `Card with term '${card.term}' exceeds the term length of ${CARD.CARD_TERM_LENGTH} `,
        );
        break;
      }

      if (card.definition.length > CARD.CARD_DEFINITION_LENGTH) {
        cardLengthExceeded = true;
        this.alertsService.setAlert(
          `Card with term '${card.term}' exceeds the defintion length of ${CARD.CARD_DEFINITION_LENGTH} `,
        );
        break;
      }
    }

    return cardLengthExceeded;
  }

  add() {
    if (this.hasIncompleteCards()) return;
    let newCard: Card = {
      card_id: -1,
      term: "",
      definition: "",
    };

    // For cases where we are patching from deleted cards
    if (this.cardsService.deletedSet.size > 0) {
      for (let id of this.cardsService.deletedSet) {
        this.cardsService.updatedSet.add(id);
        this.cardsService.deletedSet.delete(id);
        newCard.card_id = id;
        break;
      }
    }

    this.cardsService.madeChanges.set(true);
    this.cardsService.updateCards(newCard);
    this.router.navigate(["./"], {
      relativeTo: this.activatedRoute,
      onSameUrlNavigation: "reload",
    });
  }

  handleChange() {
    this.cardsService.madeChanges.set(true);
  }

  async update() {
    if (
      this.hasIncompleteCards() ||
      this.titleIsEmpty() ||
      this.titleExceedsLength() ||
      this.termOrDefinitionExceedsLength()
    )
      return;

    let created: NewCard[] = [];
    let updated: Card[] = [];
    let deleted: number[] = Array.from(this.cardsService.deletedSet);

    const deck_id = this.decksService.currentDeck?.deck_id ?? -1;

    for (let card of this.cards()) {
      if (card.card_id === -1) {
        created.push({
          deck_id,
          term: card.term,
          definition: card.definition,
        });
      } else if (this.cardsService.updatedSet.has(card.card_id)) {
        updated.push(card);
      }
    }

    const deckData = {
      deck_id,
      deck_name: this.deckTitle(),
      deck_name_old: this.deck_name_old,
    };
    await this.decksService.updateDecks({
      deckData,
      deleted,
      updated,
      created,
    });

    this.cardsService.reset();
  }
}
