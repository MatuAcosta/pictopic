import './polyfills.server.mjs';
import{a as f,b as D,d as S,f as j,g as w}from"./chunk-TQA7VPRX.mjs";import{B as d,D as l,E as n,F as m,G as y,I as g,J as b,K as P,L as v}from"./chunk-NGUMHIM5.mjs";import{G as p,K as s,d as h}from"./chunk-TYE7C624.mjs";import{h as u}from"./chunk-MZKWKPOA.mjs";var T=(()=>{let t=class t{constructor(){this.firestore=s(d),this.dateService=s(f),this.topicDb="topics"}getTopicOfTheDay(){return u(this,null,function*(){let e=n(this.firestore,this.topicDb,this.dateService.todayDate.join("-")),r=yield m(e);r.exists()&&(this.topicOfTheDay=r.data())})}};t.\u0275fac=function(r){return new(r||t)},t.\u0275prov=p({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})();var G=(()=>{let t=class t{constructor(){this.firestore=s(d),this.storage=s(D),this.dateService=s(f),this.topicService=s(T),this.uploadProgress=new h(0),this.urlPicture=new h(""),this.dbPictures="pictures",this.pictures=new h([]),this.pictures$=this.pictures.asObservable(),this.urlPicture$=this.urlPicture.asObservable(),this.uploadProgress$=this.uploadProgress.asObservable()}uploadPictureToStorage(e,r){let i=j(this.storage,r),c=w(i,e);c.on("state_changed",a=>{this.uploadProgress.next(a.bytesTransferred/a.totalBytes*100)},a=>({error:!0,message:"error uploading picture"}),()=>{S(c.snapshot.ref).then(a=>(this.urlPicture.next(a),{error:!1,message:"",url:a}))})}createPicture(e,r,i){return u(this,null,function*(){try{return yield P(n(this.firestore,this.dbPictures,r),{url:e,username:r,description:i,createdAt:this.dateService.todayDate.join("-"),time:this.dateService.today.getTime(),likes:0,topic:this.topicService.topicOfTheDay.topic}),this.setUrl(""),{error:!1,message:"Picture uploaded successfully"}}catch{return{error:!0,message:""}}})}setUrl(e){this.urlPicture.next(e)}getPictures(){return u(this,null,function*(){try{let e=b(l(this.firestore,this.dbPictures),g("time","desc")),r=yield y(e),i=[];r.forEach(c=>{i.push(c.data())}),i=i.filter(c=>c.topic===this.topicService.topicOfTheDay.topic),this.pictures.next(i)}catch(e){return{error:!0,data:e}}})}likePicture(e,r){return u(this,null,function*(){try{let i=n(this.firestore,this.dbPictures,e);yield v(i,{likes:r})}catch{}})}};t.\u0275fac=function(r){return new(r||t)},t.\u0275prov=p({token:t,factory:t.\u0275fac,providedIn:"root"});let o=t;return o})();export{T as a,G as b};