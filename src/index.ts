import Root from './Root/Root';
import InicioPage from './Components/Homepage';
import ModificarPlantasPage from './screens/ModificationPlantsPage';
import PantallaInicio from './screens/PrincipalPage';
import ModificateGrdenPage from './screens/ModificateGrdenPage';
import CardPlants from './Components/CardPlants';
import PrincipalPage from './screens/PrincipalPage';

customElements.define('main-root', Root);
customElements.define('inicio-page', InicioPage);
customElements.define("plant-card",CardPlants);
customElements.define("modificar-jardin-page",ModificateGrdenPage);
customElements.define("modificar-plantas-page", ModificarPlantasPage);
customElements.define("pantalla-inicio", PrincipalPage);

