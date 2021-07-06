import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { SocialpostService } from '../../services/socialpost/socialpost.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { AlertService } from '../../services/alerts.service';
import { ClientService } from 'src/app/services/client/client.service';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { ModalselectvenuePage } from '../modalselectvenue/modalselectvenue.page';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { environment } from 'src/environments/environment';

const MEDIA_FOLDER_NAME = 'my_media';

@Component({
  selector: 'app-modal-new-post',
  templateUrl: './modal-new-post.page.html',
  styleUrls: ['./modal-new-post.page.scss'],
})
export class ModalNewPostPage implements OnInit {

  @Input () type;
  @Input () image;
  @Input () video;
  @Input () mode;
  imagecamara=[];
  description: string;
  numberCharacters = 0;
  hastagCatalogo =[];
  categoriasCatalogo: any;
  hastagSelect = [];
  categoriaSelect: any;
  imageNewPost: string;
  mediasend = [];
  mediaGallery=[];
  idUsuario:number;
  token:any;
  titleproject:any;
  numberCharacterstitle =0;
  numberRationale =0;
  numberResults =0;
  rationale ='';
  venuesCliente:any;
  venuesSelect:any;
  venuestype:any;
  brand:any;
  enable='auto';
  base64Video =[];
  size = 'Notfound';
  valueVenue = 0;
  VenuesName:any;
  hastagShow:any;
  string64:any;
  platformis:any;
  ClienteID:any;
  // Variables del FileTransfer
  uploadText: any;
  downloadText: any;
  fileTransfer: FileTransferObject;

  constructor(
    public modalController: ModalController,
    private social: SocialpostService,
    private camera: Camera,
    private storage: Storage,
    private alertas: AlertService,
    private clienteSer : ClientService,
    private file: File,
    private transfer: FileTransfer,
    private filepath: FilePath,
    private fileChooser: FileChooser,
    private streamingMedia: StreamingMedia,
    private b64: Base64,
    private modalCtrl: ModalController,
    private platform : Platform
  ) { 
    this.uploadText = "";
    this.downloadText = "";
  }

  ngOnInit() {
    this.alertas.presentLoading('Wait, please');
    this.platform.ready().then(async ()=>{
      if(this.platform.is('ios')){
        this.platformis='ios';
        console.log('**************IOS***************');
        if(this.video === undefined || this.video === null){
        }else{
          console.log('para abrir el video',this.video);
          console.log(this.mode,'Mode!!');
          if(this.mode === 'VideoCamera'){
            console.log('************************VideoCAmera IOS*****************************');
            // convertir bs64 VideoCamara 
            console.log("URL Video", this.video);
          }else{
            console.log('************************Path IOS*****************************');
            console.log("URL Video", this.video);
          }
        }
      }else if(this.platform.is('android')){
        this.platformis='android';
        console.log('**************android***************')
        if(this.video === undefined || this.video === null){
        }else{
          console.log('para abrir el video',this.video);
          console.log(this.mode,'Mode!!');
          if(this.mode === 'VideoCamera'){
            console.log('************************VideoCAmera*****************************');
            console.log("URL Video", this.video);
          }else{
            console.log('************************Path*****************************');
            console.log("URL Video", this.video);
          }
        }
      }
    });

   
    this.storage.get('idUsuario').then((val) => {
      this.idUsuario = val;
      this.clienteSer.getOnTradeClients(this.idUsuario).subscribe( res =>{
        console.log(res,'Venues')
        this.venuesCliente= res;
      })
    });

    this.storage.get('token').then((val) => {
      this.token = val;
    });

    this.social.catalogohastag().subscribe(res=>{
      this.hastagCatalogo = res;
      console.log(res,'hastag')
    });

    this.social.catalogocategorias().subscribe(res=>{
      console.log(res,'catalogo')
      this.categoriasCatalogo = res;
    });

    if(this.image === undefined && this.type === 'gallery' || this.type === 'camara' && this.image=== undefined){
      this.alertas.presentAlertSimpleConfirm('', 'Failed to upload', '', 'Accept', () => {
        this.dismiss();
      });
    }

    const mediaImg = {
      base64:this.image,contentType: "image/jpeg", 
      idPublicacion: 0,idReporteOn: 0,
      nombre: new Date().getTime() + ".jpeg",
      url: new Date().getTime() + ".jpeg"
    }
    
    this.mediasend.push(mediaImg);

    if (this.type === 'gallery') {
      this.mediaGallery.push('data:image/jpeg;base64,' + this.image);
      this.alertas.dismissLoading();
    } else {
      this.imagecamara.push('data:image/jpeg;base64,' + this.image);
      this.alertas.dismissLoading();
    }
    this.alertas.dismissLoading();
  }

  // ngOnInit() {
  //   this.alertas.presentLoading('Wait, please');
  //   this.platform.ready().then(async ()=>{
  //     if(this.platform.is('ios')){
  //       this.platformis='ios';
  //       console.log('**************IOS***************')
  //       if(this.video === undefined || this.video === null){
  //       }else{
  //         console.log('para abrir el video',this.video);
  //         console.log(this.mode,'Mode!!');
  //         if(this.mode === 'VideoCamera'){
  //           console.log('************************VideoCAmera IOS*****************************');
  //           // convertir bs64 VideoCamara 
  //           console.log("URL Video", this.video)
  //           this.getBase64StringByFilePath(this.video[0].nativeURL).then((val) => {
  //             this.string64 =val.substring(28);
  //             const size= val.length / 1000000;
  //             console.log(size,'SZE video')
  //             this.size = 'found';
  //             if(size >= 40){
  //               this.alertas.dismissLoading();
  //               // this.alertas.presentAlertSimpleConfirm('', 'You have exceeded the video limit of 40MB', '', 'Accept', () => {
  //               //   this.dismiss();
  //               // });
  //             }else{
              
  //               const mediaVideo = {
  //                 base64: this.string64,
  //                 contentType: "video/mp4", 
  //                 idPublicacion: 0,
  //                 idReporteOn: 0,
  //                 nombre: new Date().getTime() + ".mp4",
  //                 url: new Date().getTime() + ".mp4"
  //               }
              
  //               this.base64Video.push(mediaVideo);
  //               console.log('this.base64Video',this.base64Video)
  //             }
  //           });
            
  //           setTimeout(()=>{
  //             console.log('Settime!')
  //             if( this.size === 'Notfound'){
  //               this.alertas.dismissLoading();
  //               setTimeout(()=>{
  //                 // this.alertas.presentAlertSimpleConfirm('', 'You have exceeded the video limit of 40MB', '', 'Accept', () => {
  //                 //   this.dismiss();
  //                 // });
  //               },0)
  //             }else{
  //             }
  //           },3000)

  //         }else{
  //           console.log('************************Path IOS*****************************');
  //           this.getBase64StringByFilePath(this.video).then((val) => {
  //             this.string64 =val.substring(28);
  //             const size= val.length / 1000000;
  //             console.log(size,'SZE video')
  //             this.size = 'found';
  //             if(size >= 40){
  //               this.alertas.dismissLoading();
  //               // this.alertas.presentAlertSimpleConfirm('', 'You have exceeded the video limit of 40MB', '', 'Accept', () => {
  //               //   this.dismiss();
  //               // });
  //             }else{
              
  //               const mediaVideo = {
  //                 base64: this.string64,contentType: "video/mp4", 
  //                 idPublicacion: 0,idReporteOn: 0,
  //                 nombre: new Date().getTime() + ".mp4",
  //                 url: new Date().getTime() + ".mp4"
  //               }
              
  //               this.base64Video.push(mediaVideo);
  //               console.log('this.base64Video',this.base64Video)
  //             }
  //           });
            
  //           setTimeout(()=>{
  //             console.log('Settime!')
  //             if( this.size === 'Notfound'){
  //               this.alertas.dismissLoading();
  //               setTimeout(()=>{
  //                 // this.alertas.presentAlertSimpleConfirm('', 'You have exceeded the video limit of 40MB', '', 'Accept', () => {
  //                 //   this.dismiss();
  //                 // });
  //               },0)
  //             }else{
  //             }
  //           },3000)
  //         }
  //       }
  //     }else if(this.platform.is('android')){
  //       this.platformis='android';
  //       console.log('**************android***************')
  //       if(this.video === undefined || this.video === null){
  //       }else{
  //         console.log('para abrir el video',this.video);
  //         console.log(this.mode,'Mode!!');
  //         if(this.mode === 'VideoCamera'){
  //           console.log('************************VideoCAmera*****************************');
  //           // convertir bs64 VideoCamara
  //           console.log("URL Video", this.video)
  //           //this.video[0].nativeURL
  //           this.b64.encodeFile(this.video).then(Image64=>{
  //             let pictureFinal: string;
  //             if(Image64 === null || typeof Image64 === 'undefined'){
  //               Image64 = '';
  //             }else{
  //               pictureFinal = Image64;
  //             }
  //             // const size= Image64.length / 1000000;
  //             // this.size = 'found';
  //             // if(size >= 40){
  //             //   this.alertas.dismissLoading();
  //             //   this.alertas.presentAlertSimpleConfirm('', 'You have exceeded the video limit of 40MB', '', 'Accept', () => {
  //             //     this.dismiss();
  //             //   });
  //             // }else{
    
  //               const mediaVideo = {
  //                 base64: pictureFinal,contentType: "video/mp4", 
  //                 idPublicacion: 0,idReporteOn: 0,
  //                 nombre: new Date().getTime() + ".mp4",
  //                 url: new Date().getTime() + ".mp4"
  //               }
    
  //               this.base64Video.push(mediaVideo);
  //               console.log(pictureFinal,'Esto es la conversion captureimg')
  //               console.log(mediaVideo,'e.e lo haces o no lo haces 2')
  //               console.log('this.base64Video',this.base64Video)
  //             // }
  //           }, (err) => {
  //             console.log(err);
  //           })
  //           setTimeout(()=>{
  //             console.log('Settime!')
  //             if( this.size === 'Notfound'){
  //               this.alertas.dismissLoading();
  //               setTimeout(()=>{
  //                 // this.alertas.presentAlertSimpleConfirm('', 'You have exceeded the video limit of 40MB', '', 'Accept', () => {
  //                 //   this.dismiss();
  //                 // });
  //               },0)
  //             }else{
  //             }
  //           },3000)
  //         }else{
  //           console.log('************************Path*****************************');
  //           this.b64.encodeFile(this.video).then(Image64=>{
  //             const pictureFinal = Image64;
  //             // const size= Image64.length / 1000000;
  //             // this.size = 'found';
  //             // if(size >= 40){
  //             //   this.alertas.dismissLoading();
  //             //   this.alertas.presentAlertSimpleConfirm('', 'You have exceeded the video limit of 40MB', '', 'Accept', () => {
  //             //     this.dismiss();
  //             //   });
  //             // }else{
    
  //               const mediaVideo = {
  //                 base64: pictureFinal,contentType: "video/mp4", 
  //                 idPublicacion: 0,idReporteOn: 0,
  //                 nombre: new Date().getTime() + ".mp4",
  //                 url: new Date().getTime() + ".mp4"
  //               }
    
  //               this.base64Video.push(mediaVideo);
  //               console.log(pictureFinal,'Esto es la conversion captureimg')
  //               console.log(mediaVideo,'e.e lo haces o no lo haces 2')
  //               console.log('this.base64Video',this.base64Video)
  //             // }
  //           }, (err) => {
  //             console.log(err);
  //           })
  //           setTimeout(()=>{
  //             console.log('Settime!')
  //             if( this.size === 'Notfound'){
  //               this.alertas.dismissLoading();
  //               setTimeout(()=>{
  //                 // this.alertas.presentAlertSimpleConfirm('', 'You have exceeded the video limit of 40MB', '', 'Accept', () => {
  //                 //   this.dismiss();
  //                 // });
  //               },0)
  //             }else{
  //             }
  //           },3000)
  //         }
  //       }
  //     }
  //   });

   
  //   this.storage.get('idUsuario').then((val) => {
  //     this.idUsuario = val;
  //     this.clienteSer.getOnTradeClients(this.idUsuario).subscribe( res =>{
  //       console.log(res,'Venues')
  //       this.venuesCliente= res;
  //     })
  //   });

  //   this.storage.get('token').then((val) => {
  //     this.token = val;
  //   });

  //   this.social.catalogohastag().subscribe(res=>{
  //     this.hastagCatalogo = res;
  //     console.log(res,'hastag')
  //   });

  //   this.social.catalogocategorias().subscribe(res=>{
  //     console.log(res,'catalogo')
  //     this.categoriasCatalogo = res;
  //   });
  //   if(this.image === undefined && this.type === 'gallery' || this.type === 'camara' && this.image=== undefined){
  //     this.alertas.presentAlertSimpleConfirm('', 'Failed to upload', '', 'Accept', () => {
  //       this.dismiss();
  //     });
  //   }
  //   const mediaImg = {
  //     base64:this.image,contentType: "image/jpeg", 
  //     idPublicacion: 0,idReporteOn: 0,
  //     nombre: new Date().getTime() + ".jpeg",
  //     url: new Date().getTime() + ".jpeg"
  //   }
    
  //   this.mediasend.push(mediaImg);

  //   if (this.type === 'gallery') {
  //     this.mediaGallery.push('data:image/jpeg;base64,' + this.image);
  //     this.alertas.dismissLoading();
  //   } else {
  //     this.imagecamara.push('data:image/jpeg;base64,' + this.image);
  //     this.alertas.dismissLoading();
  //   }
  //   this.alertas.dismissLoading();
  // }

  // nuevo metodo de carga del video

  //cargar archivos de galeria
  

  AbortUpload() {
    this.fileTransfer.abort();
    alert("cargar cancelar.");
  }


  getBase64StringByFilePath(fileURL): Promise<string> {
    return new Promise((resolve, reject) => {
      let fileName = fileURL.substring(fileURL.lastIndexOf('/') + 1);
      let filePath = fileURL.substring(0, fileURL.lastIndexOf("/") + 1);
      this.file.readAsDataURL(filePath, fileName).then(file64 => {
        console.log(file64)
        resolve(file64);
      }).catch(err => {
        reject(err);
      });
    })
  }

  async dismiss() {
    if(this.mode=== undefined || this.mode === null || this.mode===''){
      await this.modalController.dismiss(null);
    }else if(this.mode==='path' && this.platformis==='android'){
      await this.modalController.dismiss(null);
    }else{
      // this.deleteFile();
      await this.modalController.dismiss(null);
    }
  }

  async share() {
    this.alertas.presentLoading('Wait, please');
    const usuarioEdito = {
      "apellidoMaterno": " ",
      "apellidoPaterno": " ",
      "email": " ",
      "idEstatus":0 ,
      "idUsuario": this.idUsuario,
    }
    let datetimeNow = new Date();
    let year = datetimeNow.getFullYear();
    let month = (datetimeNow.getMonth() + 1) < 10 ? '0' + (datetimeNow.getMonth() + 1) : (datetimeNow.getMonth() + 1);
    let day = datetimeNow.getDate();
    let hours = datetimeNow.getHours();
    let minutes = datetimeNow.getMinutes();

    let dateFormat = day + "/" + month + "/" + year;
    let timeFormat = hours + ":" + minutes; 
    let datetimeSend = dateFormat + " " + timeFormat;
    const idpublicacion=0;

    if(this.titleproject==undefined || this.titleproject==="" || this.titleproject===null || this.categoriaSelect ===undefined || this.hastagSelect === null || this.hastagSelect === undefined || this.hastagSelect.length === 0 ||this.venuestype === undefined || this.venuestype==='' || this.venuestype === null ){
      this.alertas.dismissLoading();
      this.alertas.presentAlertSimpleConfirm('', 'Enter the required data * to continue', '', 'Accept', () => {});
    }else {

      if(this.type === 'video'){
        const cliente ={
          'ciudad': this.venuesSelect.ciudad, 
          "direccion": this.venuesSelect.direccion, 
          "email": this.venuesSelect.email,
          'energy': this.venuesSelect.energy, 
          'idCliente': this.ClienteID
        };
        this.social.postNew(this.token,this.categoriaSelect,cliente,this.description,datetimeSend,this.base64Video,this.hastagSelect,idpublicacion,this.titleproject,usuarioEdito).subscribe(async res=>{
          console.log('data',res);
          const idPublicacion = res;
          //subir video
          if(this.mode==='path'){
            // await this.modalController.dismiss(this.description);
            this.alertas.dismissLoading();
            this.uploadVideoGaleryAndroid(idPublicacion);
          }else{
            // this.deleteFile();
            // await this.modalController.dismiss(this.description);
            this.alertas.dismissLoading();
            this.uploadVideo(idPublicacion);
          }
        },err=>{
          console.log('error',err);
          this.alertas.dismissLoading();
          this.alertas.presentAlertSimpleConfirm('Error', 'Connection error try again later', '', 'Accept', () => {});
        })
      }else{
        const cliente = { 
          'ciudad': this.venuesSelect.ciudad, 
          "direccion": this.venuesSelect.direccion, 
          "email": this.venuesSelect.email, 
          'energy': this.venuesSelect.energy, 
          'idCliente': this.ClienteID 
        };

        this.social.postNew(this.token,this.categoriaSelect,cliente,this.description,datetimeSend,this.mediasend,this.hastagSelect,idpublicacion,this.titleproject,usuarioEdito).subscribe(async res=>{
          console.log('data',res);
            await this.modalController.dismiss(this.description);
            this.alertas.dismissLoading();
        },err=>{
          console.log('error',err);
          this.alertas.dismissLoading();
          this.alertas.presentAlertSimpleConfirm('Error', 'Connection error try again later', '', 'Accept', () => {});
        })
      }
    }
  }

  uploadVideo(idPublicacion) {
    this.alertas.presentLoading('Wait, please');
    this.fileTransfer = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'video',
      fileName: new Date().getTime() + ".mp4",
      httpMethod: 'POST',
      // chunkedMode: false,
      headers: {
        "Content-Type": "multipart/form-data",
        'authorization': 'Bearer ' + this.token
      },
      mimeType: 'video/mp4'
    }
    this.uploadText = "uploading...";
    this.fileTransfer.upload(this.video,
      `http://ec2-54-167-83-212.compute-1.amazonaws.com:8080/jagersocial_back/api/social/uploadVideo?idPublicacion=${idPublicacion}` ,
      options).then(async (data) => {
        alert("transferencia hecha = " + JSON.stringify(data));
        this.uploadText = "";
        this.alertas.dismissLoading();
        await this.modalController.dismiss(this.description);
      }, (errorTransfer) => {
        console.log('Error de transfer: ', errorTransfer);
        this.uploadText = "";
        this.alertas.dismissLoading();
      });
  }

  uploadVideoGaleryAndroid(idPublicacion) {
    this.filepath.resolveNativePath(this.video).then(
      (nativepath) => {
        this.fileTransfer = this.transfer.create();
        let options: FileUploadOptions = {
          fileKey: 'video',
          fileName: new Date().getTime() + ".mp4",
          httpMethod: 'POST',
          chunkedMode: false,
          headers: {
            "Content-Type": "multipart/form-data",
            'authorization': 'Bearer ' + this.token
          },
          mimeType: 'video/mp4'
        }
        this.uploadText = "uploading...";
        this.fileTransfer.upload(nativepath,
          environment.servicesURL + environment.saveVideo + `?idPublicacion=${idPublicacion}`,
          options).then(async (data) => {
            alert("transferencia hecha = " + JSON.stringify(data));
            this.alertas.dismissLoading();
            this.uploadText = "";
            await this.modalController.dismiss(this.description);
          }, (errorTransfer) => {
            console.log('Error de transfer: ',errorTransfer);
            this.uploadText = "";
            this.alertas.dismissLoading();
          })
      }, (err) => {
        alert(JSON.stringify(err));
        this.alertas.dismissLoading();
      });
  }

  changeDescription(event) {
    this.description = event.detail.value;
    this.numberCharacters = this.description.length;
    if(this.numberCharacters >= 240){
      this.description = event.detail.value.slice(0,-1);
    }else{

    }
  }

  changeRationale(event) {
    this.numberRationale = event.detail.value.length;
    this.rationale=event.detail.value;
  }


  changeDescriptionTitle(event) {
    this.titleproject = event.detail.value;
    this.numberCharacterstitle = event.detail.value.length;
  }

  getItem(valueItem) {
    const Itemhastag = valueItem.detail.value;
    this.hastagShow =Itemhastag;
    this.hastagSelect = [];
    for (let i = 0; i < Itemhastag.length; i++) {
      for (let j = 0; j < this.hastagCatalogo.length; j++) {
        if(Itemhastag[i] === this.hastagCatalogo[j].hashtag){
          const ItemhastagSelect = { 'hashtag':  this.hastagCatalogo[j] , idPublicacionHashtag: 0};
          this.hastagSelect.push(ItemhastagSelect);
        }
      }
    }
  }

  getItemVenues(valueVenues) {
    const ItemVenues = valueVenues.detail.value;
    this.venuesSelect= ItemVenues;
    this.venuestype=ItemVenues.energy.energy;
    console.log('Venue',ItemVenues);
    console.log(ItemVenues.energy.energy)
    this.storage.get('region').then((val) => {
      if(val === 'ASIA'){
        this.brand=ItemVenues.tipoCliente.altname;
      }else{
        this.brand=ItemVenues.tipoCliente.tipoCliente;
      }
    });
  }

  getItemCategoria(valueCategory) {
    const ItemCategory = valueCategory.detail.value;
    this.categoriaSelect=ItemCategory;
    console.log(this.categoriaSelect);
  }

  remove(id: number, hastagValue) {
    let show= []
    const valueH = hastagValue.hashtag.hashtag;
    this.hastagSelect.splice(id, 1);
    for (let i = 0; i < this.hastagShow.length; i++) {
      if(valueH === this.hastagShow[i]){
      }else{
        show.push(this.hastagShow[i])
      }
    }
    this.hastagShow = show;
    console.log(this.hastagSelect,'slecte')
  }

  async getPhotosGallery(){
    this.enable='none';
    let cameraOptions: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true
    };
    this.camera.getPicture(cameraOptions).then(async (imageData) => {
      const mediaImg = {
        base64:imageData,
        contentType: "image/jpeg", 
        idPublicacion: 0,idReporteOn: 0,
        nombre: new Date().getTime() + ".jpeg",
        url: new Date().getTime() + ".jpeg"
      }
      this.mediasend.push(mediaImg);
      this.imageNewPost = "data:image/jpeg;base64," + imageData;
      this.mediaGallery.push(this.imageNewPost);
      this.enable='auto';
    }, (err) => {
      this.enable='auto';
      console.log(err);
    });
  }

  openFile() {
    if(this.mode==='VideoCamera'){
      if (this.video[0].name.indexOf('.MOV') > -1 || this.video[0].name.indexOf('.mp4') > -1) {
        this.streamingMedia.playVideo(this.video[0].nativeURL);
        console.log('para abrir el video')
      }
    }else{
      this.streamingMedia.playVideo(this.video);
    }
  }

  deleteFile() {
    const path = this.video[0].nativeURL.substr(0, this.video[0].nativeURL.lastIndexOf('/') + 1);
    this.file.removeFile(path, this.video[0].name).then(() => {
    }, err => console.log('error remove: ', err));
  }

  async openvenues(){
    const modal = await this.modalCtrl.create({
      component: ModalselectvenuePage,
      backdropDismiss: true,
      cssClass: 'alertModalCancel',
      animated: false,
      componentProps: {
        arrayvenues:this.venuesCliente ,
        valueVenue: this.valueVenue,
      }
    });
    modal.onDidDismiss()
    .then((data) => { 
      if(data.data !== null){
        console.log(data,'data')
        console.log(data.data)
        console.log(data.data.venue.idCliente,'********************')
        this.ClienteID= data.data.venue.idCliente;
        this.venuesSelect= data.data.venue;
        console.log(this.venuesSelect,'tupe')
        this.valueVenue=data.data.venue.idCliente;
        this.brand=data.data.brand;
        this.venuestype=data.data.type;
        this.VenuesName= data.data.venue.nombre;
        
      }
    });
 
   return await modal.present();
  }
}
