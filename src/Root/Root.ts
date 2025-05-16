// src/Root/Root.ts

import { store } from '../flux/Store';
import { getPlants } from '../services/Plants';
import { AppDispatcher } from '../flux/Dispatcher';
import '../screens/PrincipalPage';
import '../screens/ModificateGrdenPage';
import '../screens/ModificationPlantsPage';

class Root extends HTMLElement {
  shadow: ShadowRoot;
  state = store.getState();

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const plants = await getPlants();
    AppDispatcher.dispatch({ type: 'LOAD_ALL_PLANTS', payload: plants });

    store.subscribe(this.handleStateChange.bind(this));
    this.render();
  }

  handleStateChange(newState: any) {
    this.state = newState;
    this.render();
  }

  navigateTo(page: string) {
    AppDispatcher.dispatch({ type: 'SET_PAGE', payload: page });
  }

  render() {
    if (!this.shadow) return;

    const { currentPage } = this.state;

    this.shadow.innerHTML = `
      <style>
        h1 {
          font-size: 2em;
          font-family: 'Poppins', sans-serif;
          text-align: center;
          margin-top: 20px;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          margin-bottom: 20px;
        }
        nav {
          display: flex;
          gap: 20px;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border: none;
          border-radius: 5px;
          background-color:rgb(22, 0, 146);
          color: white;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color:rgb(69, 93, 160);
        }
        button.active {
          background-color:rgb(0, 222, 214);
        }
      </style>

      <header>
        <h1>MI JARDINCITO</h1>
        <nav>
          <button id="inicio" class="${currentPage === 'inicio' ? 'active' : ''}">HOME</button>
          <button id="modificar-jardin" class="${currentPage === 'modificar-jardin' ? 'active' : ''}">MODIFICATE GARDEN</button>
          <button id="modificar-plantas" class="${currentPage === 'modificar-plantas' ? 'active' : ''}">MODIFICATE PLANTS</button>
        </nav>
      </header>
      <div id="page-container"></div>
    `;

    const container = this.shadow.querySelector('#page-container');
    if (!container) return;

    container.innerHTML = '';
    switch (currentPage) {
      case 'inicio':
        container.appendChild(document.createElement('pantalla-inicio'));
        break;
      case 'modificar-jardin':
        container.appendChild(document.createElement('modificar-jardin-page'));
        break;
      case 'modificar-plantas':
        container.appendChild(document.createElement('modificar-plantas-page'));
        break;
      default:
        container.appendChild(document.createElement('pantalla-inicio'));
    }

    const buttons = this.shadow.querySelectorAll('nav button');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        this.navigateTo(button.id);
      });
    });
  }
}

export default Root

