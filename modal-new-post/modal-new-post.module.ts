import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { ModalNewPostPageRoutingModule } from './modal-new-post-routing.module';

import { ModalNewPostPage } from './modal-new-post.page';
import { ModalselectvenuePage } from '../modalselectvenue/modalselectvenue.page';
import { ModalselectvenuePageModule } from '../modalselectvenue/modalselectvenue.module';
import { Base64 } from '@ionic-native/base64/ngx';
import { File } from '@ionic-native/file/ngx';

import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';


@NgModule({
  entryComponents:[
    ModalselectvenuePage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalselectvenuePageModule,
  ],
  declarations: [ModalNewPostPage],
  providers: [
    Base64,
    File,
    FileTransfer,
    FileChooser,
    FilePath,
    
  ]
})
export class ModalNewPostPageModule {}
