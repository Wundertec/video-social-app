import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SocialHomePageRoutingModule } from './socialHome-routing.module';
import { SocialHomePage } from './socialHome.page';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
//import { VideoPlayer } from '@ionic-native/video-player/ngx';
import { ModalNewPostPage } from '../modal-new-post/modal-new-post.page';
import { ModalNewPostPageModule } from '../modal-new-post/modal-new-post.module';
import { ModalcommentsPage } from '../modalcomments/modalcomments.page';
import { ModalcommentsPageModule } from '../modalcomments/modalcomments.module';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@NgModule({
  entryComponents:[
    ModalNewPostPage,
    ModalcommentsPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SocialHomePageRoutingModule,
    ModalNewPostPageModule,
    ModalcommentsPageModule,
  ],
  //providers: [PhotoViewer, VideoPlayer],
  providers: [PhotoViewer, VideoEditor, AndroidPermissions],
  declarations: [SocialHomePage]
})
export class SocialHomePageModule {}
