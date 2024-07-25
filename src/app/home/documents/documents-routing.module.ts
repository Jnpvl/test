import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentsPage } from './documents.page';

const routes: Routes = [
  {
    path: '',
    component: DocumentsPage,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./list/list.module').then((m) => m.ListPageModule),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./document/document.module').then(
            (m) => m.DocumentPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsPageRoutingModule {}
