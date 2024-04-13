import { Component, ElementRef, Input } from '@angular/core';
import { SimpleRank, SimpleSuit } from '../../../../models/types/card.model';
import {
  BettingHand,
  Proposition,
  HandCategory,
  BettingChoices,
  Selection,
  SelectionVariant,
  SpecificationAttribute,
} from './hand-picker.model';
import { HandName } from '../../../../models/types/hand.model';
import { DeckVariant } from '../../../../models/related-constants/deck.constant';
import { HandInstance } from '../../../../models/types/in-game-analysis.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { getChoiceSubSet, getEmptyBettingSlotsGroups, getEmptySlots, getPropositionsKeys } from './hand-picker.utils';
import { debounce, fromEvent, takeUntil, tap, timer } from 'rxjs';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import {
  SelectionPropositions,
  VariantPropositionsPoker,
  VariantPropositionsStraight,
  HandsCategories,
  RanksPropositions,
  SuitsPropositions,
} from './hand-picker.constant';
import { HandsDetails } from '@features/entertainment/asian-poker/models/related-constants/hand.constant';

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

  ranks = RanksPropositions;
  suits = SuitsPropositions;

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

  constructor(private el: ElementRef) {
    super('HandPickerComponent');
    this.listenToKeydown();
    this.listenToKeyup();
  }

  handleMainSteps(choice: Proposition<unknown>, step: 'selection' | 'variant') {
    if (step === 'selection') {
      this.handleSelectionStep(choice as Proposition<Selection>);
    }
    if (step === 'variant') {
      this.handleVariantStep(choice as Proposition<SelectionVariant>);
    }
  }

  private handleSelectionStep(choice: Proposition<Selection>) {
    this.choices.selection.picked = choice.name;

    switch (choice.name) {
      case 'poker':
        this.step = 'variant';
        this.choices.variant.propositions = VariantPropositionsPoker;
        break;
      case 'straight':
        this.step = 'variant';
        this.choices.variant.propositions = VariantPropositionsStraight;
        break;
      case 'color':
        this.step = 'specification';
        this.choices.specification.picked = 'suit';
        this.slotsGroups = this.getEmptyBettingSlotsGroupsAndUpdateForm(HandsDetails[choice.name].visualElements);
        break;
      case 'high-card':
      case 'pair':
      case 'three':
      case 'four':
        this.step = 'specification';
        this.choices.specification.picked = 'rank';
        this.slotsGroups = this.getEmptyBettingSlotsGroupsAndUpdateForm(HandsDetails[choice.name].visualElements);
        break;
      case 'double-pair':
      case 'full-house':
        this.step = 'specification';
        this.choices.specification.picked = 'double-rank';
        this.slotsGroups = this.getEmptyBettingSlotsGroupsAndUpdateForm(HandsDetails[choice.name].visualElements);
        break;
    }
  }

  private handleVariantStep(choice: Proposition<SelectionVariant>) {
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

  handleSpecificationStep(data: unknown, step: SpecificationAttribute) {
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
    if (this.canAccept) {
      this.accepted = true;
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
        debounce((event) => timer(['selection', 'variant'].includes(this.step) && event.key !== '-' ? 300 : 0)),
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

        if ([0, ...getPropositionsKeys('selection')].includes(+eventKey)) {
          if (this.step === 'selection') {
            const foundProposition = this.choices.selection.propositions.find((prop) => `${prop.key}` === eventKey);
            if (foundProposition) {
              this.handleSelectionStep(foundProposition);
              return;
            }
          }

          if (this.step === 'variant' && [...getPropositionsKeys('variant')].includes(+eventKey)) {
            const foundProposition = this.choices.variant.propositions.find((prop) => prop.key === +eventKey);
            if (foundProposition) {
              this.handleVariantStep(foundProposition);
              return;
            }
          }

          if (this.step === 'specification') {
            const option = this.choices.specification.picked;
            const foundSuit = Object.values(this.suits).find((val) => `${val.key}` === eventKey)?.name as SimpleSuit;
            const foundRank = Object.values(this.ranks).find((val) => `${val.key}` === eventKey)?.name as SimpleRank;
            if (option === 'suit' && foundSuit && [...getPropositionsKeys('suit')].includes(+eventKey)) {
              this.specifySuit(foundSuit);
            }
            if (option === 'rank' && foundRank && [...getPropositionsKeys('rank')].includes(+eventKey)) {
              this.specifyRank(foundRank);
            }
            if (option === 'double-rank' && [...getPropositionsKeys('rank')].includes(+eventKey)) {
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
