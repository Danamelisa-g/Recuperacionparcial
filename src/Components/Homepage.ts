// src/components/InicioPage.ts

import { store } from "../flux/Store";
import { Plant } from "../services/Plants";

class InicioPage extends HTMLElement {
    shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        //Utiliza un patrón Flux/Redux para gestionar el estado de la aplicación mediante un staore
        //Se suscribe a cambios en el store para volver a renderizar automáticamente cuando el estado cambie.
        store.subscribe(() => this.render());
    }
//lo renderiza 
    connectedCallback() {
        this.render();
    }
//Obtiene el estado actual del store.
    render() {
        const state = store.getState();
        const { plants, gardenPlants, gardenName } = state;

        if (!plants || !gardenPlants) return;

        const selectedPlants = plants
        //Filtra las plantas para mostrar solo las que estén incluidas en gardenPlants
            .filter((p: Plant) => gardenPlants.includes(p.common_name))
            //Ordena las plantas alfabéticamente por nombre común.
            .sort((a: Plant, b: Plant) => a.common_name.localeCompare(b.common_name));
//estilo
        this.shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    min-height: 100vh;
                    background: url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1350&q=80') no-repeat center center/cover;
                    font-family: 'Poppins', sans-serif;
                    color:rgb(94, 113, 255);
                    position: relative;
                }

                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-thumb {
                    background:rgb(140, 173, 255);
                    border-radius: 4px;
                }

                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(13, 53, 210, 0.4);
                    backdrop-filter: blur(6px);
                    z-index: 0;
                }

                h1 {
                    text-align: center;
                    font-size: 2.5rem;
                    margin: 2rem 0 1rem;
                    color:rgb(38, 19, 175);
                    text-shadow: 1px 1px 2pxrgb(88, 174, 244);
                    position: relative;
                    z-index: 1;
                }

                .plant-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 2rem;
                    padding: 2rem;
                    position: relative;
                    z-index: 1;
                }

                .plant-card {
                    background: rgba(31, 205, 224, 0.75);
                    border-radius: 10px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                    overflow: hidden;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    backdrop-filter: blur(5px);
                    border: 1px solidrgb(200, 200, 230);
                }

                .plant-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
                }

                img {
                    width: 100%;
                    height: 160px;
                    object-fit: cover;
                    border-top-left-radius: 20px;
                    border-top-right-radius: 20px;
                }

                .plant-info {
                    padding: 1rem;
                    text-align: center;
                }

                .name {
                    font-weight: 600;
                    font-size: 1.2rem;
                    color:rgb(56, 93, 142);
                    margin-bottom: 0.4rem;
                }

                .sci-name {
                    font-style: italic;
                    font-size: 0.95rem;
                    color:rgb(0, 44, 176);
                }
            </style>

            
            <h1>🌼 Jardín: ${gardenName || ''} 🌷</h1>
            <div class="plant-list">
                ${selectedPlants.map((p: Plant) => `
                    <div class="plant-card">
                        <img src="${p.img}" alt="${p.common_name}">
                        <div class="plant-info">
                            <div class="name">${p.common_name}</div>
                            <div class="sci-name">${p.scientific_name}</div>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;
    }
}

export default InicioPage;
