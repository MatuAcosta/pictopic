import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { AlbumComponent } from '../images/album/album.component';
import { PictureService } from '../services/picture.service';
import { PictureDTO, UserDTO } from '../models/types';
import { TopicService } from '../services/topic.service';
import { RouterLink } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { KeyValuePipe, NgClass } from '@angular/common';
import { UserService } from '../services/user.service';
import { Store, select } from '@ngrx/store';
import { selectAuthLogged } from '../ngrx/auth/auth.selector';
import { colorsToastify } from '../utils/constants';
import Toastify from 'toastify-js';
import { PicturedetailComponent } from '../images/picturedetail/picturedetail.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgClass, PicturedetailComponent, AlbumComponent, RouterLink, KeyValuePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private store: Store<any> = inject(Store<any>);
  public authLogged$: Observable<boolean> = this.store.pipe(select(selectAuthLogged));
  private pictureService: PictureService = inject(PictureService);
  private destroy$ = new Subject<void>();
  private userService: UserService = inject(UserService);
  private platformId: any = inject(PLATFORM_ID);
  public pictures: {[key: string]: PictureDTO} = {};
  public picturesToShow: PictureDTO[] = [];
  public topicService: TopicService = inject(TopicService);
  public showDetail: boolean = false;
  public selectedPicture: any  = null;

  constructor() { 
  }
  async ngOnInit() {
    this.pictureService.pictures$.pipe(takeUntil(this.destroy$)).subscribe((pictures: PictureDTO[]) => {
      this.pictures = this.indexPictures(pictures);
      this.picturesToShow = Object.values(this.pictures); //object indexed sorts key alphabetically
    });
    if(!this.topicService.topicOfTheDay){
      await this.getTopicOfTheDay();
    }
    this.getPictures();
  }

  dateLocalStorage(){
    if (this.platformId === 'browser'){
      localStorage.setItem('date', JSON.stringify(this.topicService.topicOfTheDay?.['date']));
    }

  }

  async getTopicOfTheDay(){
    try {
      await this.topicService.getTopicOfTheDay();
    } catch (error) {
      
    }
  }


  indexLikesOfAPicture(userLikes: string[]){
    let copyUsername = JSON.parse(JSON.stringify(userLikes));
    let likesIndexed = copyUsername.reduce((acc: any, username: string) => {
      acc[username] = username;
      return acc
    }, {});
    return likesIndexed;
  }
  /**
   * 
   * @param picturesArray 
   * @returns {[key: username]: PictureDTO} object of pictures indexed by username
   */
  indexPictures(picturesArray: PictureDTO[]) : {[key: string]: PictureDTO}{
    let pcituresIndexed = picturesArray.reduce((acc: any, picture: PictureDTO) => {
      //console.log('picture', picture);
      acc[picture.username] = picture;
      return acc
    }, {});    
    return pcituresIndexed;
  }


  async getPictures(){
    try {
      await this.pictureService.getPictures();
    } catch (error) {
      //console.log('error in getPictures', error);
    }
  }

  toggleDetail(pictureSelected?: PictureDTO){
    this.selectedPicture = this.selectedPicture ? null : pictureSelected;
    this.showDetail = !this.showDetail;
  }


  async likePicture(event: any){
    let userDTO: UserDTO | null |any = null;
    let subLogged = this.userService.userDTO$.subscribe((user: UserDTO | null) => {
      userDTO = user
    });
    if (!userDTO){
      subLogged.unsubscribe();
      return this.toastify('You must be logged in to like a photo', true);
    } 
    let pictureLikes = this.pictures[event.username as keyof typeof this.pictures].likes;
    let indexLikes = this.indexLikesOfAPicture(pictureLikes);
    if(indexLikes[userDTO.username as keyof typeof indexLikes]){ 
      
      this.pictures[event.username as keyof typeof this.pictures].likes = pictureLikes.filter((username: string) => username !== userDTO.username);
    } else {
      this.pictures[event.username as keyof typeof this.pictures].likes.push(userDTO.username);
    }
    pictureLikes = this.pictures[event.username as keyof typeof this.pictures].likes;
    if(this.selectedPicture){
      this.selectedPicture.likes = pictureLikes;
    }
    try {
      await this.pictureService.likePicture(event.username , pictureLikes);
    } catch (error) {
      //console.log('error likePicture', error);
    } finally {
      subLogged.unsubscribe();
    }
  }



  toastify(text: string, error?: boolean){
    return Toastify({
      text,
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: error ? `linear-gradient(to right,${colorsToastify.error[0]},${colorsToastify.error[1]})` 
        : `linear-gradient(to right, ${colorsToastify.success[0]}, ${colorsToastify.success[1]})`
      },
      onClick: function(){} // Callback after click
    }).showToast();
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}
