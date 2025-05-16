// src/services/Plants.ts
import plantsData from './Plants.json';

export interface Plant {
    common_name: string;
    scientific_name: string;
    img: string;
    type: string;
    origin: string;
    flowering_season: string;
    sun_exposure: string;
    watering: string;
  }
  
  export async function getPlants(): Promise<Plant[]> {
    
    return plantsData;
    // try {
    //   const response = await fetch('./Plants.json');
    //   if (!response.ok) throw new Error('No se pudo cargar el archivo de plantas');
    //   const data: Plant[] = await response.json();
    //   return data;
    // } catch (error) {
    //   console.error('Error al obtener las plantas:', error);
    //   return [];
    // }
  }
  