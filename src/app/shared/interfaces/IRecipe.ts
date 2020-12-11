import { IProduct } from './IProduct';
import { IStep } from './IStep';

export interface IRecipe {
  recipeId?: string;
  creatorId: string;
  name: string;
  imageUrl: string;
  shortDesc: string;
  difficulty: string;
  products: IProduct[];
  steps: IStep[];
}
