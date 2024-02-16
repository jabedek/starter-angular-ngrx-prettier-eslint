import { AfterViewInit, Component, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { handlePyszneData } from '@assets/pyszne/handlePyszneData';
import { Pyszne_SimpleRestaurant } from '@assets/pyszne/pyszne-data-real.model';
import { RestaurantsPizzasData, PyszneHttpService } from './pyszne-http-service.service';
import { PizzaBasicInfo } from './components/pizza-calculator/pizza-calculator.component';
import { PizzaVariant } from './restaurant-products.model';

type PyszneItemData = {
  id: string;
  brand: string;
  rating: string;
  popularity: string;
  cuisineTypes: string;
  location: string;
  deliveryFee: string;
  minOrderValue: string;
};

type TablePyszneRecord = {
  slug: string;
  cells: TablePyszneCell[];
};

type TablePyszneCell = {
  key: keyof PyszneItemData;
  value: string;
};

@Component({
  selector: 'app-pyszne-dashboard',
  templateUrl: './pyszne-dashboard.component.html',
  styleUrls: ['./pyszne-dashboard.component.scss'],
})
export class PyszneDashboardComponent {
  table: { headers: TablePyszneRecord; data: TablePyszneRecord[] } = {
    headers: { slug: '', cells: [] },
    data: [],
  };

  sorting = {
    id: { mode: 'none' },
    brand: { mode: 'none' },
    cuisineTypes: { mode: 'none' },
    location: { mode: 'none' },
    rating: { mode: 'none' },
    popularity: { mode: 'none' },
    deliveryFee: { mode: 'none' },
    minOrderValue: { mode: 'none' },
  };

  allRestaurants: TablePyszneRecord[] = [];
  restaurantsWithPizza: TablePyszneRecord[] = [];
  restaurantsWithPizzaSizes: TablePyszneRecord[] = [];

  withPizza = false;
  withSizes = false;

  pizzasComparison = {
    selectingActive: false,
    selectedSlugs: new Set<string>(),
    selectedSlugsProducts: [] as RestaurantsPizzasData[],
    selectedSlugsCalcs: [] as PizzaBasicInfo[],
  };

  get selectedSlugs() {
    return [...this.pizzasComparison.selectedSlugs.values()];
  }

  constructor(
    private pyszneHttpService: PyszneHttpService,
    private render: Renderer2,
  ) {
    this.prepareTableData();
  }

  prepareTableData() {
    const data = handlePyszneData();

    const restaurants: TablePyszneRecord[] = [];

    Object.entries(data.restaurants).forEach(([key, value]) => {
      const restaurant = value as Pyszne_SimpleRestaurant;
      const { isOpenForOrder, deliveryFeeDefault, minOrderValue } = restaurant.shippingInfo.delivery;
      if (isOpenForOrder && restaurant.supports.delivery) {
        const record: TablePyszneRecord = {
          slug: restaurant.primarySlug,
          cells: [
            { key: 'id', value: restaurant.id },
            { key: 'brand', value: restaurant.brand.name },
            // { key: '',value: `https://www.pyszne.pl/menu/${restaurant.primarySlug}`, styleClasses: 'link' },
            {
              key: 'cuisineTypes',
              value: this.prepareCuisines(restaurant.cuisineTypes),
            },
            { key: 'location', value: restaurant.location.streetAddress },
            {
              key: 'rating',
              value: `${restaurant.rating.score}\n (${restaurant.rating.votes})`,
            },
            { key: 'popularity', value: `${restaurant.popularity}` },
            {
              key: 'deliveryFee',
              value: `(PLN) ${this.getToFixed(deliveryFeeDefault / 100)}`,
            },
            {
              key: 'minOrderValue',
              value: `(PLN) ${this.getToFixed(minOrderValue / 100)}`,
            },
          ],
        };
        restaurants.push(record);
      }
    });

    this.allRestaurants = [...restaurants];

    const cuisinesIndex = restaurants[0].cells.findIndex((c) => c.key === 'cuisineTypes');
    this.restaurantsWithPizza = [...restaurants].filter((r) => r.cells[cuisinesIndex].value.includes('pizza'));

    this.table.data = this.allRestaurants;
  }

  getToFixed(num: number) {
    return (Math.round(num * 100) / 100).toFixed(2);
  }

  prepareCuisines(cuisines: string[]) {
    const cuisineTypes = cuisines.map((s) => s.split('_')[0]).filter((s) => s !== '2600');

    // If cuisines includes pizza, put it in first place, rest in alphabetical order
    const sorted = cuisineTypes.sort((a, b) => {
      if (a === 'pizza') {
        return -1;
      }
      if (b === 'pizza') {
        return 1;
      }
      return a.localeCompare(b);
    });

    return sorted.join(', ');
  }

  handlePizzaSizes() {
    if (this.pizzasComparison.selectedSlugsProducts.length > 0) {
      this.withSizes = !this.withSizes;
      // filter out restaurants with pizza but without sizes (either in 'name' or  'metric' fields)
      const arr = this.table.data.filter((r) => {
        const slug = r.slug;
        const restaurant = this.pizzasComparison.selectedSlugsProducts.find((p) => p.slug === slug);
        console.log(slug, this.pizzasComparison.selectedSlugsProducts, restaurant);

        if (restaurant) {
          const margarita = restaurant.margarita;
          const pepperoni = restaurant.pepperoni;
          const salame = restaurant.salame;

          const hasSizes = (pizza: PizzaVariant[]) =>
            pizza.every((p: any) => p.name.includes('cm') || (p.metric.unit === 'cm' && p.metric.quantity));

          return hasSizes(margarita) && hasSizes(pepperoni.length ? pepperoni : salame);
        }

        return false;
      });

      console.log(arr);

      this.table.data = this.withSizes ? arr : this.withPizza ? this.restaurantsWithPizza : this.allRestaurants;
    }
  }

  handlePizza() {
    this.withPizza = !this.withPizza;
    this.table.data = this.withPizza ? this.restaurantsWithPizza : this.allRestaurants;
  }

  sortData(key: keyof PyszneItemData, mode: 'asc' | 'desc' | 'none', valueType: 'number' | 'string' | 'date') {
    // if (key === 'link') {
    //   return;
    // }
    // Switch mode in circular fashion
    if (mode === 'none') {
      mode = 'asc';
    } else if (mode === 'asc') {
      mode = 'desc';
    } else {
      mode = 'none';
    }

    // Sort according to mode and valueType
    if (mode === 'none') {
      this.table.data = this.withPizza ? this.restaurantsWithPizza : this.allRestaurants;
    } else {
      this.table.data = this.table.data.sort((a, b) => {
        const aValue = a.cells.find((c) => c.key === key)?.value;
        const bValue = b.cells.find((c) => c.key === key)?.value;

        if (aValue !== undefined && bValue !== undefined) {
          if (valueType === 'string') {
            return mode === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
          } else if (valueType === 'number') {
            return mode === 'asc' ? +aValue - +bValue : +bValue - +aValue;
          } else {
            return mode === 'asc'
              ? new Date(aValue).getTime() - new Date(bValue).getTime()
              : new Date(bValue).getTime() - new Date(aValue).getTime();
          }
        }

        return 0;
      });
    }

    this.sorting[key].mode = mode;
  }

  handleClickRow(el: HTMLElement, record: TablePyszneRecord) {
    console.log(el);

    if (this.pizzasComparison.selectingActive) {
      const slugs = this.pizzasComparison.selectedSlugs;

      if (!slugs.has(record.slug)) {
        this.pizzasComparison.selectedSlugs.add(record.slug);
        this.render.addClass(el, 'selected-for-comparison');
      } else {
        this.pizzasComparison.selectedSlugs.delete(record.slug);
        this.render.removeClass(el, 'selected-for-comparison');
      }
    }
  }

  handleComparison() {
    this.pizzasComparison.selectingActive = !this.pizzasComparison.selectingActive;
    if (this.pizzasComparison.selectingActive) {
      this.handlePizza();
      this.handlePizzaSizes();
    } else {
      this.pizzasComparison.selectedSlugs.clear();
      this.table.data = this.allRestaurants;
    }
  }

  getSelectedData() {
    this.pyszneHttpService.scrapRestaurantsPizzas(this.selectedSlugs).subscribe((data) => {
      console.log(data);
      this.pizzasComparison.selectedSlugsProducts = data;
      this.handleComparison();
      this.mapToComparables(data);
    });
  }

  mapToComparables(data: RestaurantsPizzasData[]) {
    const result: PizzaBasicInfo[] = [];

    //for each item in data, map to PizzaBasicInfo but doing it like so:
    // {name: `${slug}-margarita-firstSize`,  size: [first size value], price: [first size value] },
    // {name: `${slug}-margarita-secondSize`,  size: [second size value], price: [second size value] },
    // {name: `${slug}-pepperoni-firstSize`,  size: [first size value], price: [first size value] },
    // {name: `${slug}-pepperoni-secondSize`,  size: [second size value], price: [second size value] },
    // if pepperoni is not present, use salame

    data.forEach((restaurant) => {
      console.log('restaurant', restaurant);

      const slug = restaurant.slug;
      const margarita = restaurant.margarita;
      const pepperoni = restaurant.pepperoni;
      const salame = restaurant.salame;

      //regex to match number in string and get it. everything else is discarded
      const numberRegex = /\d+/;

      const margaritaSizes = margarita.map((m) => m.name.match(numberRegex)?.[0]);
      const margaritaPrices = margarita.map((m) => m.prices.delivery / 100);

      const pepperoniSizes = pepperoni.map((m) => m.name.match(numberRegex)?.[0]);
      const pepperoniPrices = pepperoni.map((m) => m.prices.delivery / 100);

      const salameSizes = salame.map((m) => m.name.match(numberRegex)?.[0]);
      const salamePrices = salame.map((m) => m.prices.delivery / 100);

      margaritaSizes.forEach((size, index) => {
        result.push({
          type: 'margarita',
          slug: slug,
          size: size,
          price: margaritaPrices[index],
        });
      });

      pepperoniSizes.forEach((size, index) => {
        result.push({
          type: 'pepperoni',
          slug: slug,
          size: size,
          price: pepperoniPrices[index],
        });
      });

      if (pepperoniSizes.length === 0) {
        salameSizes.forEach((size, index) => {
          result.push({
            type: 'salame',
            slug: slug,
            size: size,
            price: salamePrices[index],
          });
        });
      }
    });

    console.log(result);

    this.pizzasComparison.selectedSlugsCalcs = result;
  }
}
