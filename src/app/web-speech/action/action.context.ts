import { Injectable } from "@angular/core";
import { ActionStrategy } from "./action.strategy";

@Injectable({
  providedIn: 'root',
})
export class ActionContext {
  private currentStrategy?: ActionStrategy;
}