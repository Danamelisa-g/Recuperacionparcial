import { AppDispatcher } from './Dispatcher';
import { Plant } from '../services/Plants';
//Define un objeto Actions que contiene métodos para despachar diferentes tipos de acciones al sistema.
export const Actions = {
    //Cada método utiliza AppDispatcher.dispatch() para enviar un objeto de acción con un type y un payload.
    //loadAllPlants: Carga todas las plantas en el store.
    loadAllPlants: (plants: Plant[]) => {
        AppDispatcher.dispatch({ type: 'LOAD_ALL_PLANTS', payload: plants });
    },
    //addToGarden: Añade una planta al jardín del usuario.
    addToGarden: (common_name: string) => {
        AppDispatcher.dispatch({ type: 'ADD_TO_GARDEN', payload: common_name });
    },
    //removeFromGarden: Elimina una planta del jardín.
    removeFromGarden: (common_name: string) => {
        AppDispatcher.dispatch({ type: 'REMOVE_FROM_GARDEN', payload: common_name });
    },
    //setGardenName: Establece el nombre del jardín.
    setGardenName: (name: string) => {
        AppDispatcher.dispatch({ type: 'SET_GARDEN_NAME', payload: name });
    },
    //setPage: Cambia la página actual de la aplicación
    setPage: (page: string) => {
        AppDispatcher.dispatch({ type: 'SET_PAGE', payload: page });
    },
    //editPlant: Actualiza la información de una planta existente
    editPlant: (plant: Plant) => {
        AppDispatcher.dispatch({ type: 'EDIT_PLANT', payload: plant });
    }
};
