import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export type PizzaBasicInfo = {
  type: string;
  slug: string;
  size: any;
  price: any;
};

export type PizzaCalcInput = {
  name: any;
  size: any;
  price: any;
};

export type PizzaComparability = {
  name: any;
  size: any;
  price: any;
  area: any;
  priceAvg: any;
  valueRating: any;
};

@Component({
  selector: 'app-pizza-calculator',
  templateUrl: './pizza-calculator.component.html',
  styleUrls: ['./pizza-calculator.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PizzaCalculatorComponent extends BaseComponent implements OnInit {
  @Input() set data(data: PizzaBasicInfo[]) {
    this._data = data;
    this.dataOnSet(data);
  }
  get data(): PizzaBasicInfo[] {
    return this._data;
  }
  private _data: PizzaBasicInfo[] = [];
  private dataOnSet(data: PizzaBasicInfo[]) {
    if (data?.length > 0) {
      data.forEach((pizza) =>
        this.addRow({ name: `${pizza.type} ${pizza.size}cm \n(${pizza.slug})`, size: pizza.size, price: pizza.price }),
      );
    }
    return;
  }

  // ng form controls array to store the pizza sizes and prices
  form = this.fb.group({
    pizzas: this.fb.array([]),
  });

  formChanges = this.form.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.__destroy));

  constructor(private fb: FormBuilder) {
    super('PizzaCalculatorComponent');
  }

  ngOnInit(): void {
    this.addRow();
    this.formChanges.subscribe(({ pizzas }) => {
      if (pizzas) {
        pizzas.forEach((control, index: number) => {
          const { size, price } = control as PizzaBasicInfo;
          if (size && price) {
            const area = this.computeArea(size);
            const value = this.computeValue(price, area);
            this.form.controls.pizzas['controls'][index].patchValue({ area: `${area} cm²` }, { emitEvent: false });
            this.form.controls.pizzas['controls'][index].patchValue({ priceAvg: `${value} zł` }, { emitEvent: false });
          }
        });
      }
    });
  }

  private computeArea(size: number) {
    const r = size / 2;
    const area = Math.PI * (r * r);
    return Number(area.toFixed(2)) * 1.0;
  }

  private computeValue(price: number, area: number) {
    // compute Value Per 100cm Squared
    return Number(((price / area) * 100).toFixed(2)) * 1.0;
  }

  trackByInputs = this.__getTrackByFn('inputs');

  addRow(info: PizzaCalcInput = { name: '', size: '', price: '' }) {
    const pizzas = this.form.controls.pizzas as FormArray;
    pizzas.push(
      this.fb.group({
        name: info.name,
        size: info.size,
        price: info.price,
        area: { value: '', disabled: true },
        priceAvg: { value: '', disabled: true },
      }),
    );

    setTimeout(() => {
      const inputs = document.querySelectorAll('input');
      const lastInput = inputs[inputs.length - 6] as HTMLInputElement;
      lastInput?.focus();

      setTimeout(() => {
        const container = document.querySelector('.calc-container') as HTMLElement;
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }, 50);
    }, 0);
  }

  removeRow(index: number) {
    const pizzas = this.form.controls.pizzas as FormArray;
    console.log(pizzas.length);
    pizzas.removeAt(index);
    console.log(pizzas.length, pizzas);
  }

  reset() {
    this.form.controls.pizzas = this.fb.array([]);
    this.addRow();
  }
}
