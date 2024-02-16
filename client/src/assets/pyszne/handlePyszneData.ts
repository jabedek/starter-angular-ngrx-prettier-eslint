// import data.json
import data from './data.json';
import { PyszneLocaLJSON, PyszneLocaLJSONFile, Pyszne_Restaurants } from './pyszne-data-real.model';

export function handlePyszneData() {
  const { requested, restaurants } = data as unknown as PyszneLocaLJSONFile;
  if (!requested || !restaurants) {
    throw new Error('Brak danych w pliku JSON!');
  }
  const restaurantsFromFile: Pyszne_Restaurants = restaurants;
  const requestedFromFile: number = requested;
  console.log(requestedFromFile, restaurantsFromFile);

  return { restaurants: restaurantsFromFile, requested: requestedFromFile } as PyszneLocaLJSON;
  // return data as ;
}
