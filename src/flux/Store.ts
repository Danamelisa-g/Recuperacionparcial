// src/flux/Store.ts

import { AppDispatcher, Action } from './Dispatcher';
import { Plant } from '../services/Plants';

export type State = {
  plants: Plant[];
  gardenPlants: string[];
  gardenName: string;
  currentPage: string;
};

type Listener = (state: State) => void;

class Store {
  private _myState: State = {
    plants: [],
    gardenPlants: [],
    gardenName: 'Mi Jardín Virtual',
    currentPage: 'inicio'
  };

  private _listeners: Listener[] = [];

  constructor() {
    AppDispatcher.register(this._handleActions.bind(this));
  }

  getState(): State {
    return this._myState;
  }

  private _handleActions(action: Action): void {
    switch (action.type) {
      case 'LOAD_ALL_PLANTS':
        this._myState = {
          ...this._myState,
          plants: action.payload || []
        };
        this._emitChange();
        break;
      case 'ADD_TO_GARDEN':
        if (!this._myState.gardenPlants.includes(action.payload)) {
          this._myState = {
            ...this._myState,
            gardenPlants: [...this._myState.gardenPlants, action.payload]
          };
          this._emitChange();
        }
        break;
      case 'REMOVE_FROM_GARDEN':
        this._myState = {
          ...this._myState,
          gardenPlants: this._myState.gardenPlants.filter(name => name !== action.payload)
        };
        this._emitChange();
        break;
      case 'SET_GARDEN_NAME':
        this._myState = {
          ...this._myState,
          gardenName: action.payload
        };
        this._emitChange();
        break;
      case 'SET_PAGE':
        this._myState = {
          ...this._myState,
          currentPage: action.payload
        };
        this._emitChange();
        break;
      case 'EDIT_PLANT':
        const updatedPlants = this._myState.plants.map(plant =>
          plant.common_name === action.payload.common_name ? action.payload : plant
        );
        this._myState = {
          ...this._myState,
          plants: updatedPlants
        };
        this._emitChange();
        break;
    }
  }

  private _emitChange(): void {
    for (const listener of this._listeners) {
      listener(this._myState);
    }
  }

  subscribe(listener: Listener): void {
    this._listeners.push(listener);
  }

  unsubscribe(listener: Listener): void {
    this._listeners = this._listeners.filter(l => l !== listener);
  }
}

export const store = new Store();
