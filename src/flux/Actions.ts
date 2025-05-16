import { AppDispatcher } from './Dispatcher';
import { Plant } from '../services/Plants';

export const Actions = {
    loadAllPlants: (plants: Plant[]) => {
        AppDispatcher.dispatch({ type: 'LOAD_ALL_PLANTS', payload: plants });
    },
    addToGarden: (common_name: string) => {
        AppDispatcher.dispatch({ type: 'ADD_TO_GARDEN', payload: common_name });
    },
    removeFromGarden: (common_name: string) => {
        AppDispatcher.dispatch({ type: 'REMOVE_FROM_GARDEN', payload: common_name });
    },
    setGardenName: (name: string) => {
        AppDispatcher.dispatch({ type: 'SET_GARDEN_NAME', payload: name });
    },
    setPage: (page: string) => {
        AppDispatcher.dispatch({ type: 'SET_PAGE', payload: page });
    },
    editPlant: (plant: Plant) => {
        AppDispatcher.dispatch({ type: 'EDIT_PLANT', payload: plant });
    }
};
