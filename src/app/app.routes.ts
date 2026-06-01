import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Lineas } from './pages/lineas/lineas';
import { EstacionesComponent } from './pages/estaciones/estaciones';
import { Accesos } from './pages/accesos/accesos';
import { UnidadesComponent } from './pages/buses/buses';
import { Asignaciones } from './pages/asignaciones/asignaciones';
import { Parqueos } from './pages/parqueos/parqueos';
import { Empleados } from './pages/empleados/empleados';
import { Tarjetas } from './pages/tarjetas/tarjetas';
import { Municipalidades } from './pages/municipalidades/municipalidades';
import { Distancias } from './pages/distancias/distancias';
import { Alertas } from './pages/alertas/alertas';
import { Recargas } from './pages/recargas/recargas';

export const routes: Routes = [
    { path: 'lineas', component: Lineas },
    { path: '', redirectTo: 'lineas', pathMatch: 'full' },


    { path: 'dashboard', component: Dashboard},
    { path: 'lineas', component: Lineas},
    { path: 'estaciones', component: EstacionesComponent},
    { path: 'accesos', component: Accesos},
    { path: 'buses', component: UnidadesComponent},
    { path: 'asignaciones', component: Asignaciones},
    { path: 'parqueos', component: Parqueos},
    { path: 'empleados', component: Empleados},
    { path: 'tarjetas', component: Tarjetas},
    { path: 'municipalidades', component: Municipalidades},
    { path: 'distancias', component: Distancias},
    { path: 'alertas', component: Alertas},
    { path: 'recargas', component: Recargas},

    { path: '**', redirectTo: 'dashboard'}

];
