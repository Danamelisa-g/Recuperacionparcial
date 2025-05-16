// src/screens/PantallaInicio.ts

import { store } from "../flux/Store";
import { Plant } from "../services/Plants";
import "../Components/CardPlants"; // Asegúrate de tener este componente

class PrincipalPage extends HTMLElement {
  private shadow: ShadowRoot;
  private state = store.getState();

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    store.subscribe(this.handleStateChange.bind(this));
    this.render();
  }

  handleStateChange(newState: any) {
    this.state = newState;
    this.render();
  }

  render() {
    if (!this.shadow) return;

    const sortedPlants = [...(this.state.plants || [])].sort((a: Plant, b: Plant) =>
      a.common_name.localeCompare(b.common_name)
    );

    this.shadow.innerHTML = `
      <style>
        .plant-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 20px;
        }
        
        /* Estilos responsivos opcionales */
        @media (max-width: 768px) {
          .plant-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 480px) {
          .plant-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
      <div class="plant-grid">
        ${sortedPlants
          .map(
            (plant: Plant) => `<plant-card 
              data-name="${plant.common_name}"
              data-image="${plant.img}"
              data-type="${plant.type}">
            </plant-card>`
          )
          .join("")}
      </div>
    `;
  }
}

export default PrincipalPage