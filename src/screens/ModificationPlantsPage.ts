import { store } from "../flux/Store";
import { AppDispatcher } from "../flux/Dispatcher";
import { Plant } from "../services/Plants";

class ModificatePlantsPage extends HTMLElement {
  shadow: ShadowRoot;
  state = store.getState();
  editingPlant: Plant | null = null;

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

  startEditing(common_name: string) {
    const plant = this.state.plants.find((p: Plant) => p.common_name === common_name);
    if (plant) {
      this.editingPlant = { ...plant };
      this.render();
      this.showModal();
    }
  }

  handleInputChange(field: keyof Plant, value: string) {
    if (this.editingPlant) {
      this.editingPlant = { ...this.editingPlant, [field]: value };
    }
  }

  saveChanges() {
    if (this.editingPlant) {
      AppDispatcher.dispatch({ type: "EDIT_PLANT", payload: this.editingPlant });
      this.editingPlant = null;
      this.hideModal();
      this.render();
    }
  }

  cancelEditing() {
    this.editingPlant = null;
    this.hideModal();
    this.render();
  }

  showModal() {
    const modal = this.shadow.querySelector('.modal-overlay') as HTMLElement;
    if (modal) {
      modal.style.display = 'flex';
      // Añadir animación de entrada
      setTimeout(() => {
        modal.style.opacity = '1';
        const modalContent = this.shadow.querySelector('.modal-content') as HTMLElement;
        if (modalContent) {
          modalContent.style.transform = 'translateY(0)';
        }
      }, 10);
    }
  }

  hideModal() {
    const modal = this.shadow.querySelector('.modal-overlay') as HTMLElement;
    if (modal) {
      modal.style.opacity = '0';
      const modalContent = this.shadow.querySelector('.modal-content') as HTMLElement;
      if (modalContent) {
        modalContent.style.transform = 'translateY(-20px)';
      }
      // Esperar a que termine la animación antes de ocultar completamente
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  }

  render() {
    const { plants } = this.state;

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Poppins', 'Segoe UI', sans-serif;
          color: #2e3a59;
          background: linear-gradient(to bottom, #f9f9f9, #edf3f8);
          min-height: 100vh;
          padding: 2rem;
          box-sizing: border-box;
        }

        h1 {
          text-align: center;
          font-size: 2.2rem;
          margin-bottom: 2rem;
          color: #3c4e6a;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
          position: relative;
          padding-bottom: 0.5rem;
        }

        h1:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background: linear-gradient(to right, #3498db, #6ab0de);
          border-radius: 2px;
        }

        .plant-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .plant-item {
          background: white;
          border-radius: 12px;
          padding: 1.2rem;
          box-shadow: 0 8px 16px rgba(0,0,0,0.06);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          border: 1px solid rgba(0,0,0,0.05);
          overflow: hidden;
          position: relative;
        }

        .plant-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.1);
          background-color: #f0f8ff;
        }

        .plant-item:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, #3498db, #9b59b6);
          transform: scaleY(0);
          transition: transform 0.3s ease;
          transform-origin: top;
        }

        .plant-item:hover:before {
          transform: scaleY(1);
        }

        .plant-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .plant-scientific {
          font-style: italic;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .edit-indicator {
          display: inline-block;
          margin-top: 0.8rem;
          font-size: 0.8rem;
          background-color: #3498db;
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }

        .plant-item:hover .edit-indicator {
          opacity: 1;
          transform: translateY(0);
        }

        /* Modal Styles */
        .modal-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1000;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(3px);
        }

        .modal-content {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          max-width: 550px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          transform: translateY(-20px);
          transition: transform 0.3s ease;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.8rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 1rem;
        }

        .modal-title {
          font-size: 1.6rem;
          font-weight: 600;
          margin: 0;
          color: #3c4e6a;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.8rem;
          cursor: pointer;
          color: #95a5a6;
          padding: 0.5rem;
          transition: color 0.2s ease;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: #e74c3c;
          background-color: #f9f9f9;
        }

        .edit-form label {
          display: block;
          margin-top: 1.2rem;
          font-weight: 500;
          color: #34495e;
          font-size: 0.95rem;
        }

        .edit-form input {
          width: 100%;
          padding: 0.8rem;
          margin-top: 0.4rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-sizing: border-box;
          font-size: 1rem;
          transition: all 0.2s ease;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
        }

        .edit-form input:focus {
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
          outline: none;
        }

        .edit-form input:disabled {
          background-color: #f5f7fa;
          color: #7f8c8d;
          cursor: not-allowed;
        }

        .buttons {
          margin-top: 2.5rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        button {
          padding: 0.8rem 1.5rem;
          font-size: 1rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        button.save {
          background-color: #2980b9;
          color: white;
          box-shadow: 0 4px 10px rgba(41, 128, 185, 0.3);
        }

        button.save:hover {
          background-color: #206592;
          transform: translateY(-2px);
          box-shadow: 0 6px 14px rgba(41, 128, 185, 0.4);
        }

        button.cancel {
          background-color: #ecf0f1;
          color: #7f8c8d;
        }

        button.cancel:hover {
          background-color: #d5dbdb;
          color: #2c3e50;
        }

        /* Responsive adjustments */
        @media (max-width: 900px) {
          .plant-list {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .plant-list {
            grid-template-columns: 1fr;
          }
          
          h1 {
            font-size: 1.8rem;
          }
          
          .modal-content {
            padding: 1.5rem;
          }
        }
      </style>

      <h1>Modificar Plantas (Modo Admin)</h1>

      <div class="plant-list">
        ${plants
          .map(
            (plant: Plant) => `
              <div class="plant-item" data-name="${plant.common_name}">
                <div class="plant-name">${plant.common_name}</div>
                <div class="plant-scientific">${plant.scientific_name}</div>
                <div class="edit-indicator">Editar planta</div>
              </div>
            `
          )
          .join("")}
      </div>

      <!-- Modal para editar plantas -->
      <div class="modal-overlay">
        <div class="modal-content">
          ${
            this.editingPlant
              ? `
              <div class="modal-header">
                <h2 class="modal-title">Editar: ${this.editingPlant.common_name}</h2>
                <button class="close-button">&times;</button>
              </div>
              <form class="edit-form">
                <label>Nombre Común</label>
                <input type="text" value="${this.editingPlant.common_name}" disabled />

                <label>Nombre Científico</label>
                <input type="text" id="scientific_name" value="${this.editingPlant.scientific_name}" />

                <label>Tipo</label>
                <input type="text" id="type" value="${this.editingPlant.type}" />

                <label>Origen</label>
                <input type="text" id="origin" value="${this.editingPlant.origin}" />

                <label>Temporada de Floración</label>
                <input type="text" id="flowering_season" value="${this.editingPlant.flowering_season}" />

                <label>Exposición al Sol</label>
                <input type="text" id="sun_exposure" value="${this.editingPlant.sun_exposure}" />

                <label>Riego</label>
                <input type="text" id="watering" value="${this.editingPlant.watering}" />

                <label>Imagen URL</label>
                <input type="text" id="img" value="${this.editingPlant.img}" />

                <div class="buttons">
                  <button type="button" class="save">Guardar Cambios</button>
                  <button type="button" class="cancel">Cancelar</button>
                </div>
              </form>
              `
              : ""
          }
        </div>
      </div>
    `;

    this.shadow.querySelectorAll(".plant-item").forEach((el) =>
      el.addEventListener("click", () => {
        const name = el.getAttribute("data-name");
        if (name) this.startEditing(name);
      })
    );

    // Eventos para el modal
    const closeButton = this.shadow.querySelector(".close-button");
    closeButton?.addEventListener("click", () => this.cancelEditing());
    
    // Evento para cerrar haciendo clic fuera del contenido del modal
    const modalOverlay = this.shadow.querySelector(".modal-overlay");
    modalOverlay?.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        this.cancelEditing();
      }
    });

    if (this.editingPlant) {
      const fields: (keyof Plant)[] = [
        "scientific_name",
        "type",
        "origin",
        "flowering_season",
        "sun_exposure",
        "watering",
        "img",
      ];

      fields.forEach((field) => {
        const input = this.shadow.querySelector(`#${field}`) as HTMLInputElement;
        input?.addEventListener("input", (e: Event) => {
          this.handleInputChange(field, (e.target as HTMLInputElement).value);
        });
      });

      this.shadow.querySelector(".save")?.addEventListener("click", () => this.saveChanges());
      this.shadow.querySelector(".cancel")?.addEventListener("click", () => this.cancelEditing());
    }
  }
}

export default ModificatePlantsPage;