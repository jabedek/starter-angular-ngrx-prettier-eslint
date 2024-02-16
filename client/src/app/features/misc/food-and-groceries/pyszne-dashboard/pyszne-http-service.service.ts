import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, map } from 'rxjs';
import { PizzaVariant, SimpleProduct, SimpleProductsData } from './restaurant-products.model';

export type RestaurantsPizzasData = {
  slug: string;
  margarita: PizzaVariant[];
  pepperoni: PizzaVariant[];
  salame: PizzaVariant[];
};

@Injectable({
  providedIn: 'root',
})
export class PyszneHttpService {
  constructor(private http: HttpClient) {}

  scrapRestaurantsPizzas(slugs: string[]): Observable<RestaurantsPizzasData[]> {
    return this.http.post<SimpleProductsData[]>(`http://localhost:4200/api/scrap/pyszne`, slugs).pipe(
      map((res: SimpleProductsData[]) => {
        return res.map((restaurant) => {
          Object.values(restaurant.products).forEach((product) => (product.name = product.name.toLowerCase()));
          const pizzaProducts = Object.values(restaurant.products).filter((product) => product.name.includes('pizza'));

          // Regex for margarita - "marg" + "ta" in order, in text like: "pizza margherita" (variants of word 'margarita': margarita,margharita, margerita, margherita, margaritta, margharitta , margeritta, margheritta)
          const margaritaRegex = new RegExp(`marg.*ta`, 'i');

          // Regex for pepperoni - "pep" + "roni" in order, in text like: "pizza pepperoni"
          const pepperoniRegex = new RegExp(`pep.*roni`, 'i');

          // Regex for salame - "sal" + "am" in order, in text like: "pizza salame/salami"
          const salameRegex = new RegExp(`sal.*am`, 'i');

          // Per restaurant - Out of all pizza products, filter out only margarita and pepperoni, if pepperoni is not present, filter out salame, put them into object {margarita: ..., pepperoni: ..., salame: ...}

          const data: RestaurantsPizzasData = {
            slug: restaurant.slug,
            margarita: [],
            pepperoni: [],
            salame: [],
          };

          pizzaProducts.forEach((product) => {
            const items: PizzaVariant[] = [];

            product.variants.forEach((variant) =>
              items.push({
                ...variant,
                productName: product.name,
                name: variant.name || '',
              }),
            );

            if (margaritaRegex.test(product.name)) {
              data.margarita = items;
            } else if (pepperoniRegex.test(product.name)) {
              data.pepperoni = items;
            } else if (salameRegex.test(product.name)) {
              data.salame = items;
            }
          });

          return { ...data };
        }) as RestaurantsPizzasData[];
      }),
    );
  }
}
