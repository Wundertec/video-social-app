import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController, NavController, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ModalNewPostPage } from '../modal-new-post/modal-new-post.page';
import { Storage } from '@ionic/storage';
import { SocialpostService } from '../../services/socialpost/socialpost.service';
import { ModalcommentsPage } from '../modalcomments/modalcomments.page';
import { AlertService } from 'src/app/services/alerts.service';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { NetworkserviceService } from 'src/app/services/networkservice/networkservice.service';
import { CargaReportesOfflineService } from 'src/app/services/carga-reportes-offline/carga-reportes-offline.service';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

const MEDIA_FOLDER_NAME = 'files';

@Component({
  selector: 'app-home',
  templateUrl: './socialHome.page.html',
  styleUrls: ['./socialHome.page.scss'],
})
export class SocialHomePage implements OnInit {

  arrayPublicaciones: any = [];
  imageNewPost: string;
  nombre: string;
  apellidoPaterno: string;
  token: any;
  idUsuario: number;
  horario:any;
  online= true;
  likenable='auto';
  page_number = 1;
  tooglescroll=false;
  videoFile:any;
  private play: Promise<any>;
  platformis:any;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    public navCtrl: NavController,
    private photoViewer: PhotoViewer,
    private camera: Camera,
    private modalCtrl: ModalController,
    private storage: Storage,
    private social: SocialpostService,
    private alertas: AlertService,
    private mediaCapture: MediaCapture,
    private file: File,
    private platform : Platform,
    private networkService: NetworkserviceService,
    private cargaDatosOffline: CargaReportesOfflineService,
    private videoEditor: VideoEditor,
    private androidPermissions: AndroidPermissions
  ) { }

  checkCameraPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(resulCamPerm => {
      console.log('resultado de permiso camera', resulCamPerm);
      if (resulCamPerm.hasPermission === true) {
        //ya tiene permiso
        this.checkStorageExternalPermission();
      } else {
        //pedir permiso
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA).then(() => {
          this.checkStorageExternalPermission();
        }, errorcamperm => {
          alert('requestPermission Error requesting Camera permissions ' + errorcamperm);
        });
      }
    });
  }
    
  checkStorageExternalPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(resulExtPerm => {
      console.log('resultado de permiso storage', resulExtPerm);
      if (resulExtPerm.hasPermission === true) {
        //ya tiene permiso
        this.recordVideo();
      } else {
        // pedir permiso
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(() => {
          this.recordVideo();
        }, errorextperm => {
          alert('requestPermission Error requesting Camera permissions ' + errorextperm);
        });
      }
    });
  }

  ngOnInit() {
    this.platform.ready().then(async () => {
      if (this.platform.is('ios')) {
        this.platformis = 'ios';

      } else if (this.platform.is('android')) {
        this.platformis = 'android'
      }
    });

    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      if (!connected) {
        this.online = false;
      } else {
        this.online = true;
        console.log('numero de la pagina olllle', this.page_number)
        this.alertas.presentLoading('Wait, please');
        this.storage.get('idUsuario').then((val) => {
          this.idUsuario = val;
        });

        // let path = this.file.dataDirectory;
        // this.file.checkDir(path, MEDIA_FOLDER_NAME).then(() => {
        //   this.loadFiles();
        //   console.log('Tengo datos')
        // },err => {
        //   this.file.createDir(path, MEDIA_FOLDER_NAME, false);
        //   console.log('No tengo nada')
        // });

        this.storage.get('token').then((val) => {
          this.token = val;
          this.social.catalogoSocial(val, 0).subscribe(res => {
            console.log(res, 'Catalogo')
            //this.online=true;
            console.log(res, 'dataservice')
            // this.arrayPublicaciones = res;
            console.log('Aqui cierra des pues de leer catalogo');
            this.alertas.dismissLoading();
            for (let i = 0; i < res.length; i++) {
              res[i].fechaPublicacionS2 = this.transformDate(res[i].fechaPublicacionS).substring(0, 12) + ' ' + ' ' + this.transformHour(res[i].fechaPublicacionS);
              if (res[i].reaccion === null || res[i].reaccion === undefined || res[i].reaccion.length === 0) {
                res[i].likedByMe = 'empty';
              } else {
                res[i].likedByMe = 'empty';
                const reacciones = res[i].reaccion
                for (let x = 0; x < reacciones.length; x++) {
                  if (reacciones[x].usuarioReaccion.idUsuario === this.idUsuario) {
                    res[i].likedByMe = 'full';
                  }
                }
              }
              this.arrayPublicaciones.push(res[i]);
              if (i === 4) { break; }
            }
            this.alertas.dismissLoading();
          }, err => {
            console.log(err, 'este es el error');
            this.alertas.dismissLoading();
            //this.online = false;
          })
        });
        this.alertas.dismissLoading();
        this.storage.get('nombre').then((val) => {
          this.nombre = val;
        });

        this.storage.get('apellidoPaterno').then((val) => {
          this.apellidoPaterno = val;
        });
      }
    });

    console.log('Aqui cierra completamente cuando se acaba todo');
    this.alertas.dismissLoading();


  }

  ionViewWillEnter(){
    console.log('lol will enter social');
    if(this.online === true){
      this.cargaDatosOffline.subirReportes();
    }
  }

  ionViewWillLeave(){
    const videoarray = document.querySelectorAll('video');
    for(let i = 0; i < videoarray.length; i++) {
      const estatusPause =videoarray[i].muted;
      if(estatusPause === false){
        videoarray[i].muted= true
      }
    }
  }

  transformHour(hrs){
    let hours= hrs.substring(11,13);
    let minuts=hrs.substring(14,16)
    let horario= this.hourNNumber(hours);
    if(hours >=13){
     this.horario = 'pm'
    }else{
      this.horario = 'am'
    }

    return horario  + ":" + minuts + " " + this.horario;
  }

  hourNNumber(monthS){
    
    let hrs = "";

    switch(monthS) {
      case "01":
        hrs = "01";
        break;
      case "02":
        hrs = "02";
        break;
      case "03":
        hrs = "03";
        break;
      case "04":
        hrs = "04";
        break;
      case "05":
        hrs = "05";
        break;
      case "06":
        hrs = "06";
        break;
      case "07":
        hrs = "07";
         break;
      case "08":
        hrs = "08";
        break;
      case "09":
        hrs = "09";
        break;
      case "10":
        hrs = "10";
        break;
      case "11":
        hrs = "11";
        break;
      case "12":
        hrs = "12";
        break;
        case "13":
        hrs = "01";
        break;
      case "14":
        hrs = "02";
        break;
      case "15":
        hrs = "03";
        break;
      case "16":
        hrs = "04";
        break;
      case "17":
        hrs = "05";
        break;
      case "18":
        hrs = "06";
        break;
      case "19":
        hrs = "07";
         break;
      case "20":
        hrs = "08";
        break;
      case "21":
        hrs = "09";
        break;
      case "22":
        hrs = "10";
        break;
      case "23":
        hrs = "11";
        break;
      case "24":
        hrs = "12";
        break;
      default:
        console.log("No available");
    }

    return hrs;
  }

  transformDate(dateS){
    let year = dateS.split("/")[2];
    let month = dateS.split("/")[1];
    let day = dateS.split("/")[0];
    let monthS = this.monthNNumberToText(month);
    return day + "/" + monthS + "/" + year;
  }

  monthNNumberToText(monthS){
    
    let monthName = "";

    switch(monthS) {
      case "01":
        monthName = "JAN";
        break;
      case "02":
        monthName = "FEB";
        break;
      case "03":
        monthName = "MAR";
        break;
      case "04":
        monthName = "APR";
        break;
      case "05":
        monthName = "MAY";
        break;
      case "06":
        monthName = "JUN";
        break;
      case "07":
        monthName = "JUL";
        break;
      case "08":
        monthName = "AUG";
        break;
      case "09":
        monthName = "SEP";
        break;
      case "10":
        monthName = "OCT";
        break;
      case "11":
        monthName = "NOV";
        break;
      case "12":
        monthName = "DEC";
        break;
      default:
        console.log("No available");
    }

    return monthName;
  }

  likePost(likestatus, post) {
    this.likenable ='none';
    let datetimeNow = new Date();
    let year = datetimeNow.getFullYear();
    let month = (datetimeNow.getMonth() + 1) < 10 ? '0' + (datetimeNow.getMonth() + 1) : (datetimeNow.getMonth() + 1);
    let day = datetimeNow.getDate();
    let hours = datetimeNow.getHours();
    let minutes = datetimeNow.getMinutes();
    let dateFormat = day + "/" + month + "/" + year;
    let timeFormat = hours + ":" + minutes; 
    let datetimeSend = dateFormat + " " + timeFormat;

    if(likestatus=== 'empty'){
      const idReaccion = 1;
      this.social.savereaction(this.token,post.idpublicacion,idReaccion,this.idUsuario,datetimeSend,post.likes).subscribe(res=>{
        post.likedByMe = 'full';
        post.reaccion.length++;
        this.likenable='auto';
      },err=>{
        console.log(err, 'del like')
      })
    } else{
      this.social.deleteraction(this.token,post.idpublicacion,this.idUsuario,post.likes).subscribe(res=>{
        post.likedByMe = 'empty';
        post.reaccion.length--;
        this.likenable='auto';
      },err=>{
        console.log(err, 'del quitar like')
      })
    }
  }

  getpost(){
    console.log('LEEEELLL')
    this.page_number=1;
    this.social.catalogoSocial(this.token,0).subscribe(res=>{
      this.online=true;
      this.arrayPublicaciones = res;
      for(let i = 0; i < res.length; i++) {
        res[i].fechaPublicacionS2=this.transformDate( res[i].fechaPublicacionS).substring(0,12) +'  '+ ' '+'  '+ ' '+ this.transformHour(res[i].fechaPublicacionS);
        if(res[i].reaccion === null || res[i].reaccion === undefined || res[i].reaccion.length === 0  ){
          res[i].likedByMe = 'empty';
        }else{
          res[i].likedByMe = 'empty';
          const reacciones = res[i].reaccion
          for(let x = 0; x < reacciones.length; x++) {
            if(reacciones[x].usuarioReaccion.idUsuario === this.idUsuario){
              res[i].likedByMe = 'full';
            }
          }
        }
      }
    },err=>{
      console.log(err,'este es el error');
      this.alertas.dismissLoading();
      this.online = false;
    })
  }

  viewPhoto(photo, user){
    this.photoViewer.show(photo, user, {share: true});
  }

  async getPhotos(){
    const videoarray = document.querySelectorAll('video');
    for(let i = 0; i < videoarray.length; i++) {
      const estatusPause =videoarray[i].muted;
      if(estatusPause === false){
        videoarray[i].muted= true
      }
    }
    // let cameraOptions: CameraOptions = {
    //   quality: 40,
    //   destinationType: this.camera.DestinationType.DATA_URL,
    //   encodingType: this.camera.EncodingType.JPEG,
    //   mediaType: this.camera.MediaType.PICTURE,
    //   targetHeight: 1000,
    //   saveToPhotoAlbum: true,
    //   sourceType: this.camera.PictureSourceType.CAMERA,
    //   correctOrientation: true
    // };

    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    }

    this.camera.getPicture(options).then(async (imageData) => {

      this.imageNewPost = "data:image/jpeg;base64," + imageData;

      const newPostModal = await this.modalCtrl.create({
        component: ModalNewPostPage,
        componentProps: { 
          'image': imageData,
          'type': 'camara'
        }
      });

      newPostModal.onDidDismiss()
        .then((data) => {
          if(data.data !== null){
            this.getpost();
          }
        });
      return await newPostModal.present();
    }, (err) => {
      console.log('Error al tomar foto: ',err);
    });
  }

  async getPhotosGallery(){
    const videoarray = document.querySelectorAll('video');
    for(let i = 0; i < videoarray.length; i++) {
      const estatusPause =videoarray[i].muted;
      if(estatusPause === false){
        videoarray[i].muted= true
      }
    }
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
      const newPostModal = await this.modalCtrl.create({
        component: ModalNewPostPage,
        componentProps: { 
          'image': imageData,
          'type': 'gallery'
        }
      });

      newPostModal.onDidDismiss()
        .then((data) => {
          if(data.data !== null){
            this.getpost();
          }
      });

      return await newPostModal.present();
      
    }, (err) => {
      console.log(err);
    });
  }

  doRefresh(event) {
    this.page_number=1;
    this.social.catalogoSocial(this.token,0).subscribe(res=>{
      if(this.tooglescroll===true){
        this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
      }else{
      }
      this.online=true;
      this.arrayPublicaciones = res;
      for(let i = 0; i < res.length; i++) {
        res[i].fechaPublicacionS2=this.transformDate( res[i].fechaPublicacionS).substring(0,12) +' '+ ' '+ this.transformHour(res[i].fechaPublicacionS);
        if(res[i].reaccion === null || res[i].reaccion === undefined || res[i].reaccion.length === 0  ){
          res[i].likedByMe = 'empty';
        }else{
          res[i].likedByMe = 'empty';
          const reacciones = res[i].reaccion
          for(let x = 0; x < reacciones.length; x++) {
            if(reacciones[x].usuarioReaccion.idUsuario === this.idUsuario){
              res[i].likedByMe = 'full';
            }
          }
        }
      }
      event.target.complete();
    },err=>{
      console.log(err,'este es el error');
      this.alertas.dismissLoading();
      this.online = false;
      event.target.complete();
    })
  }

  public back() {
    this.navCtrl.navigateBack('login');
  }

  // example
  async  openmodal(){
    this.getpost();
    const modal = await this.modalCtrl.create({
      component: ModalNewPostPage,
      backdropDismiss: false,
      componentProps: { 
        'type': 'video'
      } 
    });
    return await modal.present();
  }

  async  opencoments(post){
    const modal = await this.modalCtrl.create({
      component: ModalcommentsPage,
      mode: 'ios',
      keyboardClose: true,
      componentProps: { 
        'post': post,
      } 
    });
    modal.onDidDismiss()
        .then((data) => {
          if(data.data.length ===0){
          }else{
            for(let i = 0; i < data.data.length; i++) {
              post.comentario++;
            }
          }
        });
    return await modal.present();
  }

  loadData(event) {
    if(this.page_number <=7){
      this.social.catalogoSocial(this.token,this.page_number).subscribe(res=>{
        if(res.length=== 0){
          this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
          this.tooglescroll= true;
        }else{
          this.online=true;
          for(let i = 0; i < res.length; i++) {
            res[i].fechaPublicacionS2=this.transformDate( res[i].fechaPublicacionS).substring(0,12) +' '+ ' '+ this.transformHour(res[i].fechaPublicacionS);
            if(res[i].reaccion === null || res[i].reaccion === undefined || res[i].reaccion.length === 0  ){
              res[i].likedByMe = 'empty';
            }else{
              res[i].likedByMe = 'empty';
              const reacciones = res[i].reaccion
              for(let x = 0; x < reacciones.length; x++) {
                if(reacciones[x].usuarioReaccion.idUsuario === this.idUsuario){
                  res[i].likedByMe = 'full';
                }
              }
            }
            this.arrayPublicaciones.push(res[i]);
          }
          this.page_number++;
        }
        event.target.complete();
      },err=>{
        console.log(err,'este es el error');
        this.alertas.dismissLoading();
        this.online = false;
        event.target.complete();
      })
    }else{
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
      this.tooglescroll= true;
    }
  }

  loadFiles() {
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
      res => {
        if(res.length ===0){
          this.videoFile = res;
        }else{
          const path = res[0].nativeURL.substr(0, res[0].nativeURL.lastIndexOf('/') + 1);
          this.file.removeFile(path, res[0].name).then(() => {
          }, err => console.log('error remove: ', err));
        }
      },
      err => console.log('error loading files: ', err)
    );
  }

  async loadFilesModal(videURL) {
    console.log('Login de archivos');
    // this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
    //   async res => {
        // this.videoFile = res;
        this.videoFile = videURL;
        const newPostModalFiles = await this.modalCtrl.create({
          component: ModalNewPostPage,
          componentProps: { 
            'video': this.videoFile,
            'type': 'video',
            'mode': 'VideoCamera'
          }
        });
        newPostModalFiles.onDidDismiss()
          .then((data) => {
            if(data.data !== null){
              this.getpost();
              this.loadFiles();
            }
        });
  
        return await newPostModalFiles.present();
    //   },
    //   err => console.log('error loading files: ', err)
    // );
  }
  
  // infoVideo(pathVideo){
  //   this.videoEditor.getVideoInfo({
  //     fileUri: pathVideo, // the path to the video on the device
  //   }).then(resInfo => {
  //     console.log("Respuesta informacion del video: ", resInfo);
  //   })
  // }

  recordVideo() {
    const videoarray = document.querySelectorAll('video');
    console.log('videoarray: ',videoarray);
    for(let i = 0; i < videoarray.length; i++) {
      const estatusPause =videoarray[i].muted;
      if(estatusPause === false){
        videoarray[i].muted= true
      }
    }
    var options = { duration: 180, quality: 0 };
    this.mediaCapture.captureVideo(options).then(
      (data: MediaFile[]) => {
        console.log('data de video: ',data);
        if (data.length > 0) {
          // this.copyFileToLocalDir(data[0].fullPath);
          this.loadFilesModal(data[0].fullPath);
        }      
      },
      (err: CaptureError) => console.error('Error al capturar video: ',err)
    );
  }

  copyFileToLocalDir(fullPath) {
    console.log('Copiando al directorio local');
    let myPath = fullPath;
    console.log('fullpath que llega: ',fullPath);
    console.log('estes es el full path: ', myPath);
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }
    console.log('my path: ', myPath);
    const ext = myPath.split('.').pop();
    const d = Date.now();
    const newName = `${d}.${ext}`;
    const name: string = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom: string = myPath.substr(0, myPath.lastIndexOf('/'));
    //const copyFrom: string = myPath;
    const copyTo = this.file.dataDirectory;
    //const copyTo = this.file.applicationStorageDirectory + MEDIA_FOLDER_NAME;
    console.log('copyFrom: ', copyFrom);
    console.log('name: ', name);
    console.log('copyTo: ', copyTo);
    console.log('newName: ', newName);
    console.log('datos de app: ',this.file.dataDirectory);
    
    this.file.copyFile(copyFrom, name, copyTo, newName).then(success => {
      // this.loadFilesModal();
    },error => {
      console.log('error de copyFile: ', error);
    });
  }

  selectVideo() {
    const videoarray = document.querySelectorAll('video');
    for(let i = 0; i < videoarray.length; i++) {
      const estatusPause = videoarray[i].muted;
      if(estatusPause === false){
        videoarray[i].muted= true
      }
    }
    let cameraOptions : CameraOptions = {
      sourceType: 2,
      mediaType: 1,
    };

    this.camera.getPicture(cameraOptions).then(async (imageData) => {
      console.log(imageData,'Este es el data path')
      let data = imageData.substring(0, 37);
      console.log()
      if ( data === '/storage/emulated/0/Pictures/Facebook' || data === '/storage/emulated/0/Movies/Instagram/' ){
        this.alertas.presentAlertSimpleConfirm('', 'Video not allowed', '', 'Accept', () => {});
      } else {
        const newPostModalFiles = await this.modalCtrl.create({
          component: ModalNewPostPage,
          componentProps: {
            'video': imageData,
            'type': 'video',
            'mode': 'path'
          }
        });
        
        newPostModalFiles.onDidDismiss()
          .then((data) => {
            if(data.data !== null){
              this.getpost();
              this.loadFiles();
            }
        });
        return await newPostModalFiles.present();
      }
    }, (err) => {
      console.log(err);
    });
  }


  selectVideIOS() {
    const videoarray = document.querySelectorAll('video');
    for(let i = 0; i < videoarray.length; i++) {
      const estatusPause =videoarray[i].muted;
      if(estatusPause === false){
        videoarray[i].muted= true
      }
    }
    let cameraOptions : CameraOptions = {
      sourceType: 2,
      mediaType: 1,
    };

    this.camera.getPicture(cameraOptions).then(async (imageData) => {
      console.log(imageData,'Este es el data path')
      let data = imageData.substring(0, 37);
      console.log()
      if ( data === '/storage/emulated/0/Pictures/Facebook' || data === '/storage/emulated/0/Movies/Instagram/' ){
        this.alertas.presentAlertSimpleConfirm('', 'Video not allowed', '', 'Accept', () => {});
      } else {
        this.copyFileToLocalDirIOS(imageData);
      }
    }, (err) => {
      console.log(err);
    });

  }

  copyFileToLocalDirIOS(fullPath) {
    let myPath = fullPath;
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }
    const ext = myPath.split('.').pop();
    const d = Date.now();
    const newName = `${d}.${ext}`;
    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;
    this.file.copyFile(copyFrom, name, copyTo, newName).then(success => {
      // this.loadFilesModal();
    },error => {
      console.log('error: ', error);
    });
  }

  loadFilesModalIOS() {
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(
      async res => {
        this.videoFile = res;
        const newPostModalFiles = await this.modalCtrl.create({
          component: ModalNewPostPage,
          componentProps: {
            'video': this.videoFile,
            'type': 'video',
            'mode': 'path'
          }
        });
        
        newPostModalFiles.onDidDismiss()
          .then((data) => {
            if(data.data !== null){
              this.getpost();
              this.loadFiles();
            }
        });
        return await newPostModalFiles.present();
      },
      err => console.log('error loading files: ', err)
    );
  }
}
