import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalNewPostPage } from './modal-new-post.page';

const routes: Routes = [
  {
    path: '',
    component: ModalNewPostPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalNewPostPageRoutingModule {}
