import { store } from "../flux/Store";
import { AppDispatcher } from "../flux/Dispatcher";
import "../Components/CardPlants";

class ModificateGrdenPage extends HTMLElement {
  shadow: ShadowRoot;
  state = store.getState();
  searchTerm: string = "";

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

  addPlant(common_name: string) {
    AppDispatcher.dispatch({ type: "ADD_TO_GARDEN", payload: common_name });
  }

  removePlant(common_name: string) {
    AppDispatcher.dispatch({ type: "REMOVE_FROM_GARDEN", payload: common_name });
  }

  setGardenName(name: string) {
    AppDispatcher.dispatch({ type: "SET_GARDEN_NAME", payload: name });
  }

  handleSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.render();
  }

  render() {
    if (!this.shadow) return;

    const { plants, gardenPlants, gardenName } = this.state;
    
    // Filtrar plantas según el término de búsqueda
    const filteredPlants = plants.filter((plant: any) => 
      plant.common_name.toLowerCase().includes(this.searchTerm) || 
      plant.scientific_name.toLowerCase().includes(this.searchTerm)
    );

    this.shadow.innerHTML = `
      <style>
        :host {
          font-family: 'Poppins', sans-serif;
          color:rgb(0, 98, 210);
          display: block;
          background: linear-gradient(to bottom,rgb(0, 81, 143), #ffffff);
          min-height: 100vh;
          padding: 2rem;
        }

        h1 {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 1rem;
          color:rgb(253, 253, 253);
        }

        .garden-inputs {
          max-width: 900px;
          margin: 0 auto 2rem auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .garden-inputs {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .garden-name-input, .search-input {
          font-size: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 2px solid rgb(6, 139, 210);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(5px);
          outline: none;
          transition: border-color 0.3s;
        }

        .garden-name-input {
          flex: 1;
          max-width: 320px;
        }

        .search-input {
          flex: 1;
          max-width: 320px;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgb(6, 139, 210)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>');
          background-repeat: no-repeat;
          background-position: 95% center; 
          padding-right: 40px;
        }

        .garden-name-input:focus, .search-input:focus {
          border-color:rgb(103, 102, 187);
        }

        .plant-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);  /* Establecer 3 columnas fijas */
          gap: 1.5rem;
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .plant-list {
            grid-template-columns: repeat(2, 1fr);  /* 2 columnas en tabletas */
          }
        }

        @media (max-width: 600px) {
          .plant-list {
            grid-template-columns: 1fr;  /* 1 columna en móviles */
          }
        }

        .plant-card-wrapper {
          position: relative;
          background: rgba(255, 255, 255, 0.65);
          border-radius: 16px;
          padding: 1rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(6px);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .plant-card-wrapper:hover {
          transform: scale(1.02);
        }

        .button-container {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }

        button {
          padding: 0.4rem 0.8rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.3s ease;
          color: white;
        }

        button.add {
          background-color:rgb(14, 150, 222);
        }

        button.add:hover {
          background-color:rgb(0, 58, 175);
        }

        button.remove {
          background-color:rgb(53, 126, 229);
          position: absolute;
          right: 12px;
          top: 12px;
        }

        button.remove:hover {
          background-color:rgb(40, 87, 198);
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 16px;
          color: rgb(0, 98, 210);
          font-size: 1.2rem;
        }
      </style>

      <h1>MODIFICATE GARDEN</h1>
      
      
        
        <input 
          class="search-input" 
          type="text" 
          placeholder="Buscar plantas..." 
          value="${this.searchTerm}"
        />
      </div>
      
      <div class="plant-list">
        ${filteredPlants.length > 0 ? 
          filteredPlants
            .map(
              (plant: any) => `
              <div class="plant-card-wrapper">
                <plant-card 
                  data-name="${plant.common_name}"
                  data-image="${plant.img}"
                  data-type="${plant.scientific_name}">
                </plant-card>
                ${
                  gardenPlants.includes(plant.common_name)
                    ? `<button class="remove" data-name="${plant.common_name}">Eliminar</button>`
                    : `<div class="button-container">
                        <button class="add" data-name="${plant.common_name}">Añadir</button>
                      </div>`
                }
              </div>
            `
            ).join("") 
          : `<div class="no-results">No se encontraron plantas que coincidan con tu búsqueda</div>`
        }
      </div>
    `;

    // Eventos
    const nameInput = this.shadow.querySelector(".garden-name-input") as HTMLInputElement;
    nameInput?.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.setGardenName(target.value);
    });

    const searchInput = this.shadow.querySelector(".search-input") as HTMLInputElement;
    searchInput?.addEventListener("input", (e: Event) => {
      const target = e.target as HTMLInputElement;
      this.handleSearch(target.value);
    });

    this.shadow.querySelectorAll("button.add").forEach((btn) =>
      btn.addEventListener("click", (e: Event) => {
        const name = (e.currentTarget as HTMLButtonElement).dataset.name;
        if (name) this.addPlant(name);
      })
    );

    this.shadow.querySelectorAll("button.remove").forEach((btn) =>
      btn.addEventListener("click", (e: Event) => {
        const name = (e.currentTarget as HTMLButtonElement).dataset.name;
        if (name) this.removePlant(name);
      })
    );
  }
}

export default ModificateGrdenPage;