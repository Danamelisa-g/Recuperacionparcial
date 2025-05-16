// src/flux/Dispatcher.ts

import { Plant } from '../services/Plants';
//patrón Flux que distribuye las acciones a los stores.
export type Action =//Define un type Action usando TypeScript union types para tipar estrictamente todas las posibles acciones.
  | { type: "LOAD_ALL_PLANTS"; payload: Plant[] }
  | { type: "ADD_TO_GARDEN"; payload: string }
  | { type: "REMOVE_FROM_GARDEN"; payload: string }
  | { type: "SET_GARDEN_NAME"; payload: string }
  | { type: "SET_PAGE"; payload: string }
  | { type: "EDIT_PLANT"; payload: Plant };

type Callback = (action: Action) => void;

export class Dispatcher {
    private _listeners: Callback[] = [];
//Registra una función callback que se ejecutará cuando se despache una acción.
    register(callback: Callback): void {
        this._listeners.push(callback);
    }
//Envía una acción a todos los listeners registrados.
    dispatch(action: Action): void {
        for (const listener of this._listeners) {
            listener(action);
        }
    }
}//instancia única del Dispatcher que se exporta y utiliza en toda la aplicación.

export const AppDispatcher = new Dispatcher();
