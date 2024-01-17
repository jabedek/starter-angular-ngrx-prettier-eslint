import { Component, ElementRef, Input } from '@angular/core';
import { Ranks, SimpleRank, SimpleSuit, Suit, SuitsWithHierarchy } from '../../../../models/card.model';
import {
  BettingHand,
  BettingSpecificationData,
  Proposition,
  HandCategory,
  HandsCategories,
  PokerSubChoice,
  SuitBasedScheme,
  RankBasedScheme,
  DoubleRankBasedScheme,
  StraightSubChoice,
  SelectionPropositions,
  BettingChoices,
  SuitsPropositionsRecord,
  RanksPropositionsRecord,
  SelectionChoice,
  SelectionVariantChoice,
  AttributeSpecification,
} from '../../../../models/betting-process';
import { HandName, HandsDetails, getChoiceSubSet } from '../../../../models/hand.model';
import { DeckVariant } from '../../../../models/deck.model';
import { HandInstance } from '../../../../models/hand-analysis.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getEmptyBettingSlotsGroups, getEmptySlots } from './hand-picker.utils';
import { debounce, debounceTime, fromEvent, takeUntil, tap, timer } from 'rxjs';
import { BaseComponent } from '@shared/abstracts/base/base.component';

@Component({
  selector: 'app-hand-picker',
  templateUrl: './hand-picker.component.html',
  styleUrls: ['./hand-picker.component.scss'],
})
export class HandPickerComponent extends BaseComponent {
  @Input() set deckVariant(deckVariant: DeckVariant) {
    this._deckVariant = deckVariant;
    this.deckVariantOnSet(deckVariant);
  }
  get deckVariant(): DeckVariant | undefined {
    return this._deckVariant;
  }
  private _deckVariant: DeckVariant | undefined = undefined;
  private deckVariantOnSet(deckVariant: DeckVariant) {
    // this.categoriesChoices = this.getAvailableHandsInDeckVariant(deckVariant);
  }

  step: 'selection' | 'variant' | 'specification' | 'finalization' = 'selection';
  activeKey = -1;

  choices: BettingChoices = {
    selection: { propositions: SelectionPropositions, picked: undefined },
    variant: { propositions: [], picked: undefined },
    specification: { propositions: [], picked: undefined, pickedData: [] },
    // finalization: { propositions: [], picked: undefined, pickedData: [], accepted: false },
  };

  slotsGroups: { slots: BettingHand[]; value: BettingHand | undefined }[] = [];
  attributeForm = new FormGroup({
    valueA: new FormControl<BettingHand | undefined>(undefined),
    valueB: new FormControl<BettingHand | undefined>(undefined),
  });

  get valueA() {
    return this.attributeForm.controls.valueA.value?.rank;
  }

  get partOfDoubleRank() {
    return ['double-pair', 'full-house'].includes(this.choices.selection.picked || '');
  }

  canAccept = false;
  accepted = false;
  acceptedHand: HandInstance | undefined;

  Suits = [
    { name: 'fillerE', symbol: '3' },
    SuitsWithHierarchy[0], // ♠
    { name: 'fillerD', symbol: '1' },
    SuitsWithHierarchy[1], // ♥
    { name: 'fillerC', symbol: '5' },
    SuitsWithHierarchy[3], // ♦
    { name: 'fillerB', symbol: '8' },
    SuitsWithHierarchy[2], // ♣
    { name: 'fillerA', symbol: '7' },
  ].reverse();
  Ranks = ['fillerB', ...Ranks, 'fillerA'].reverse() as string[];

  suitsPropositionsRecord = {
    ...SuitsPropositionsRecord,
    fillerE: { key: -1, name: 'filler' },
    fillerD: { key: -1, name: 'filler' },
    fillerC: { key: -1, name: 'filler' },
    fillerB: { key: -1, name: 'filler' },
    fillerA: { key: -1, name: 'filler' },
  } as unknown as Record<string, Proposition<string>>;

  ranksPropositionsRecord = {
    fillerB: { key: -1, name: 'filler' },
    ...RanksPropositionsRecord,
    fillerA: { key: -1, name: 'filler' },
  } as unknown as Record<string, Proposition<string>>;

  constructor(private el: ElementRef) {
    super('HandPickerComponent');
    this.listenToKeydown();
    this.listenToKeyup();
  }

  handleMainSteps(choice: Proposition<unknown>, step: 'selection' | 'variant') {
    if (step === 'selection') {
      this.handleSelectionStep(choice as Proposition<SelectionChoice>);
    }
    if (step === 'variant') {
      this.handleVariantStep(choice as Proposition<SelectionVariantChoice>);
    }
  }

  handleSpecificationStep(data: unknown, step: AttributeSpecification) {
    if (step === 'suit') {
      this.specifySuit(data as SimpleSuit);
    }

    if (step === 'rank') {
      this.specifyRank(data as SimpleRank);
    }
    if (step === 'double-rank') {
      this.specifyDoubleRank(data as SimpleRank);
    }
  }

  handleFinalizationStep(pickedData: BettingHand[]) {
    // if (this.choices.finalization.propositions) {
    //   this.choices.finalization.pickedData = pickedData;
    // }
  }

  stepBack() {
    if (this.step === 'variant') {
      this.clearStep('variant');
      this.step = 'selection';
      this.choices.selection.picked = undefined;
    }

    if (this.step === 'specification') {
      this.clearStep('specification');

      if (this.choices.selection.picked === 'straight' || this.choices.selection.picked === 'poker') {
        this.step = 'variant';
        this.choices.variant.picked = undefined;
      } else {
        this.step = 'selection';
        this.choices.selection.picked = undefined;
      }
    }

    // if (this.step === 'finalization') {
    //   this.clearStep('finalization');
    //   if (this.choices.selection.picked === 'straight') {
    //     this.clearStep('specification');
    //     this.step = 'variant';
    //     this.choices.variant.picked = undefined;
    //   } else {
    //     this.step = 'specification';
    //     this.choices.specification.picked = undefined;
    //   }
    // }
  }

  accept() {
    this.accepted = true;
  }

  private handleSelectionStep(choice: Proposition<SelectionChoice>) {
    this.choices.selection.picked = choice.name;

    switch (choice.name) {
      case 'poker':
        this.step = 'variant';
        this.choices.variant.propositions = PokerSubChoice;
        break;
      case 'straight':
        this.step = 'variant';
        this.choices.variant.propositions = StraightSubChoice;
        break;
      case 'color':
        this.step = 'specification';
        this.choices.specification.propositions = SuitBasedScheme;
        this.choices.specification.picked = 'suit';
        this.slotsGroups = this.getEmptyBettingSlotsGroupsAndUpdateForm(HandsDetails[choice.name].visualElements);
        break;
      case 'high-card':
      case 'pair':
      case 'three':
      case 'four':
        this.step = 'specification';
        this.choices.specification.propositions = RankBasedScheme;
        this.choices.specification.picked = 'rank';
        this.slotsGroups = this.getEmptyBettingSlotsGroupsAndUpdateForm(HandsDetails[choice.name].visualElements);
        break;
      case 'double-pair':
      case 'full-house':
        this.step = 'specification';
        this.choices.specification.propositions = DoubleRankBasedScheme;
        this.choices.specification.picked = 'double-rank';
        this.slotsGroups = this.getEmptyBettingSlotsGroupsAndUpdateForm(HandsDetails[choice.name].visualElements);
        break;
    }
  }

  private handleVariantStep(choice: Proposition<SelectionVariantChoice>) {
    if (this.choices.selection.picked) {
      const name = choice.name as HandName;

      if (name.includes('poker')) {
        const pokerSubChoices = getChoiceSubSet(name);
        const groups = this.getEmptyBettingSlotsGroupsAndUpdateForm(HandsDetails[name].visualElements).map((gr) => {
          gr.slots.forEach((slot, i) => (slot.rank = pokerSubChoices[i] as any));
          return gr;
        });

        this.slotsGroups = groups;
        this.choices.variant.picked = name as any;
        this.step = 'specification';
        this.choices.specification.propositions = SuitBasedScheme;
        this.choices.specification.picked = 'suit';
      }

      if (name.includes('straight')) {
        const cards: BettingHand[] = getChoiceSubSet(name).map((val) => ({ rank: val }) as BettingHand);
        const groups = this.getEmptyBettingSlotsGroupsAndUpdateForm(HandsDetails[name].visualElements);
        groups[0].slots = cards;

        this.slotsGroups = groups;
        this.choices.variant.picked = name as any;
        this.step = 'specification';
        this.canAccept = true;
        // this.choices.finalization = {
        //   ...this.choices.finalization,
        //   propositions: cards,
        // };
      }
    }
  }

  private specifySuit(suit: SimpleSuit) {
    const handName = this.choices.selection.picked;
    const variantName = this.choices.variant.picked;

    if (handName) {
      this.choices.specification.picked = 'suit';
      this.choices.specification.pickedData = [{ suit }];

      if (handName === 'poker' && variantName) {
        this.slotsGroups[0].slots = getChoiceSubSet(variantName).map((rank) => ({ rank, suit }) as BettingHand);
      }

      if (handName === 'color') {
        this.slotsGroups[0].slots = this.slotsGroups[0].slots.map(() => ({ suit }));
      }

      this.canAccept = true;
    }
  }

  private specifyRank(rank: SimpleRank) {
    const handName = this.choices.selection.picked;
    if (handName) {
      this.choices.specification.picked = 'rank';
      this.choices.specification.pickedData = [{ rank }];
      const rankEl = { rank };

      switch (handName) {
        case 'high-card':
          this.slotsGroups[0].slots = [rankEl];
          break;
        case 'pair':
          this.slotsGroups[0].slots = [rankEl, rankEl];
          break;
        case 'three':
          this.slotsGroups[0].slots = [rankEl, rankEl, rankEl];
          break;
        case 'four':
          this.slotsGroups[0].slots = [rankEl, rankEl, rankEl, rankEl];
          break;
      }
    }

    this.canAccept = true;
  }

  private specifyDoubleRank(rank: SimpleRank) {
    const handName = this.choices.selection.picked;

    if (handName) {
      this.choices.specification.picked = 'double-rank';

      const { valueA: ctrlA, valueB: ctrlB } = this.attributeForm.controls;
      const [groupA, groupB] = this.slotsGroups;
      const valueA: BettingHand | undefined = ctrlA.value as BettingHand;
      const valueB: BettingHand | undefined = ctrlB.value as BettingHand;

      const empty = getEmptySlots(1)[0];
      const rankEl = { rank };

      if (!valueA && !valueB) {
        groupA.slots = [rankEl, rankEl];
        groupB.slots = handName === 'full-house' ? [empty, empty, empty] : [empty, empty];

        ctrlA.setValue(rankEl);
        this.choices.specification.pickedData = [rankEl];
        this.canAccept = false;
      }

      if (valueA && !valueB) {
        groupB.slots = handName === 'full-house' ? [rankEl, rankEl, rankEl] : [rankEl, rankEl];

        ctrlA.setValue(undefined);
        ctrlB.setValue(undefined);
        this.choices.specification.pickedData = [...this.choices.specification.pickedData, rankEl];
        this.canAccept = true;
      }
    }
  }

  private clearStep(which: 'selection' | 'variant' | 'specification') {
    this.choices[which].propositions = [];
    this.choices[which].picked = undefined;

    const handName = (this.choices.variant.picked || this.choices.selection.picked) as HandName;

    if (which === 'specification') {
      this.choices.specification.pickedData = [];
      this.choices.specification.picked = undefined;
      this.slotsGroups = this.getEmptyBettingSlotsGroupsAndUpdateForm(HandsDetails[handName].visualElements);
      this.attributeForm.reset({ valueA: undefined, valueB: undefined }); //.setValue({ valueA: undefined, valueB: undefined });
      this.canAccept = false;
      this.accepted = false;
    }

    // if (which === 'finalization') {
    //   this.choices.finalization.pickedData = [];
    //   this.choices.finalization.accepted = false;
    // }
  }

  private getEmptyBettingSlotsGroupsAndUpdateForm(slotsData: { slots: number; distinctGroups: number }) {
    const groups = getEmptyBettingSlotsGroups(slotsData);
    if (groups.length === 2) {
      this.attributeForm.controls['valueB'].addValidators([Validators.required]);
    } else {
      this.attributeForm.controls['valueB'].removeValidators([Validators.required]);
    }
    this.attributeForm.updateValueAndValidity();

    return groups;
  }

  private getAvailableHandsInDeckVariant(deckVariant: DeckVariant | undefined) {
    if (!deckVariant) {
      return [];
    }

    const hands: HandCategory[] = [...HandsCategories];

    if (deckVariant === 'standard') {
      const pokerRoot = hands.find((h) => h.topCategory === 'poker-root');
      if (pokerRoot) {
        pokerRoot.subCategories = pokerRoot.subCategories?.splice(0, 2);
      }

      const straightRoot = hands.find((h) => h.topCategory === 'straight-root');
      if (straightRoot) {
        straightRoot.subCategories = straightRoot.subCategories?.splice(0, 2);
      }
    }

    if (deckVariant === 'extended') {
      //
    }

    if (deckVariant === 'finale') {
      const pokerRoot = hands.find((h) => h.topCategory === 'poker-root');
      if (pokerRoot) {
        pokerRoot.subCategories = pokerRoot.subCategories?.splice(0, 1);
      }

      const straightRoot = hands.find((h) => h.topCategory === 'straight-root');
      if (straightRoot) {
        straightRoot.subCategories = straightRoot.subCategories?.splice(0, 1);
      }
    }

    return hands;
  }

  private listenToKeyup() {
    fromEvent<KeyboardEvent>(window, 'keyup')
      .pipe(takeUntil(this.__destroy))
      .subscribe((event) => (this.activeKey = -1));
  }

  private listenToKeydown() {
    fromEvent<KeyboardEvent>(window, 'keydown')
      .pipe(
        tap((event) => (this.activeKey = +event.key)),
        debounce((event) => timer(['selection', 'variant'].includes(this.step) && event.key !== '-' ? 350 : 0)),
        takeUntil(this.__destroy),
      )
      .subscribe((event) => {
        const eventKey = event.key;
        this.activeKey = +eventKey;

        if (['-'].includes(eventKey)) {
          this.stepBack();
        }

        if (['Enter'].includes(eventKey)) {
          this.accept();
        }

        if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(+eventKey)) {
          if (this.step === 'selection') {
            const foundProposition = this.choices.selection.propositions.find((prop) => `${prop.key}` === eventKey);
            if (foundProposition) {
              this.handleSelectionStep(foundProposition);
              return;
            }
          }

          if (this.step === 'variant' && [4, 5, 6].includes(+eventKey)) {
            const foundProposition = this.choices.variant.propositions.find((prop) => prop.key === +eventKey);
            if (foundProposition) {
              this.handleVariantStep(foundProposition);
              return;
            }
          }

          if (this.step === 'specification') {
            const option = this.choices.specification.picked;
            const foundSuit = Object.values(SuitsPropositionsRecord).find((val) => `${val.key}` === eventKey)?.name as SimpleSuit;
            const foundRank = Object.values(RanksPropositionsRecord).find((val) => `${val.key}` === eventKey)?.name as SimpleRank;
            if (option === 'suit' && foundSuit && [2, 4, 6, 8].includes(+eventKey)) {
              this.specifySuit(foundSuit);
            }
            if (option === 'rank' && foundRank && [1, 2, 4, 5, 6, 8, 9].includes(+eventKey)) {
              this.specifyRank(foundRank);
            }
            if (option === 'double-rank' && [1, 2, 4, 5, 6, 8, 9].includes(+eventKey)) {
              const disabled = this.partOfDoubleRank && foundRank === this.valueA;
              if (!disabled) {
                this.specifyDoubleRank(foundRank);
              }
            }
            return;
          }
        }
      });
  }
}
