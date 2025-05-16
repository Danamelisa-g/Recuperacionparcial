// src/flux/Dispatcher.ts

import { Plant } from '../services/Plants';

export type Action =
  | { type: "LOAD_ALL_PLANTS"; payload: Plant[] }
  | { type: "ADD_TO_GARDEN"; payload: string }
  | { type: "REMOVE_FROM_GARDEN"; payload: string }
  | { type: "SET_GARDEN_NAME"; payload: string }
  | { type: "SET_PAGE"; payload: string }
  | { type: "EDIT_PLANT"; payload: Plant };

type Callback = (action: Action) => void;

export class Dispatcher {
    private _listeners: Callback[] = [];

    register(callback: Callback): void {
        this._listeners.push(callback);
    }

    dispatch(action: Action): void {
        for (const listener of this._listeners) {
            listener(action);
        }
    }
}

export const AppDispatcher = new Dispatcher();
