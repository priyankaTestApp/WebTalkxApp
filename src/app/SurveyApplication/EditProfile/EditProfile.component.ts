import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AppComponent } from '../../app.component';
import { GlobalVariable } from '../../globals';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, NgModel, NgForm } from '@angular/forms';
import { SurveyApplicationComponent } from '../SurveyApplication.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-Edit-profile',
  templateUrl: './EditProfile.component.html',
  styleUrls: ['./EditProfile.component.css']
})
export class EditProfileComponent implements OnInit {
  model: any = {};
  updateUserModel: any = {};
  loginerror: string;
  erroruser: string;
  UserID: number;
  rid: number;
  imageUrl: string = "../../../assets/img/user.png";
  fileToUpload: File = null;
  isImageUpload: boolean = false;
  ProfilePictureURL: string;
  user_profile: string;
  domain_url: string;

  UserName: string;
  linkdInURL: string;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, private titleService: Title, private appcmp: AppComponent, public surveyCmp: SurveyApplicationComponent) { 
    
    if (localStorage.getItem('LoginUserID') == "" && localStorage.getItem('LoginUserID') == null) {
      this.router.navigateByUrl('/Login');
    }
  }

  ngOnInit() {
    this.UserID = Number(localStorage.getItem('LoginUserID'));
    this.domain_url = GlobalVariable.APIUrl;

    this.getUsersDetails(this.UserID);

    this.surveyCmp.showNavigation = true;
    
  }

  // Update profile image,Show image preview.
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    this.isImageUpload = true;
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      //Assigning base 64 url into both variable
      this.imageUrl = event.target.result;
      this.updateUserModel.ProfileImageName = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
    this.updateProfilePic();
  }

  //for update the image
  updateProfilePic() {
    let imgUrl = this.domain_url;

    if (this.isImageUpload) {
      const formData: FormData = new FormData();
      formData.append('Image', this.fileToUpload, this.fileToUpload.name);
      formData.append('UserID', this.UserID.toString());
      
      return this.http
      .post(`${environment.domainApi}I2B_Users/UploadUserProfilePicture`, formData).subscribe(res=>{
        
        if (res[0]["ProfileImageName"] != "") {
          let newprofileimage = imgUrl + 'ProfilePicture/' + res[0]["ProfileImageName"];
          localStorage.setItem('ProfileImageName', imgUrl + 'ProfilePicture/' + res[0]["ProfileImageName"]);
          localStorage.setItem('ProfileImageName', newprofileimage);

          //this.UserName = localStorage.getItem('LoginPhotoPath');
          //console.log(this.UserName);
          document.getElementsByClassName('img-profile rounded-circle')[0].setAttribute('src', newprofileimage);
          
        }
        this.appcmp.showLoader = false;
        //this._notificationservice.success("Profile picture updated successfully.");
      });
    } else {
      this.appcmp.showLoader = false;
      if (this.imageUrl == "") localStorage.setItem('ProfileImageName', this.imageUrl);
      this.router.navigateByUrl('/I2BApplication/Dashboard');
      //this._notificationservice.success("Your details has been updated successfully.");
    }
  }

  //method to get the userDetails
  getUsersDetails(uid) {
    if (uid) {
      let Obj: any = {};
      Obj.UserID = uid;

      //showing loader icon
      this.appcmp.showLoader = true;
      this.appcmp.loadermessage = 'Please wait...';
      
      return this.http
      .post(`${environment.domainApi}I2B_Users/GetUserDetails`, Obj).subscribe(res=>{
        
        if (res["length"] > 0) {
          if (res[0]['ResponseStatus'] == 'Success') {

            this.UserID = res[0]['UserID'];
            this.updateUserModel.EmailID = res[0]['EmailID'];
            this.updateUserModel.FirstName = res[0]['FirstName'];
            this.updateUserModel.LastName = res[0]['LastName'];
            this.updateUserModel.PhoneNumber = res[0]['PhoneNumber'];
            this.updateUserModel.LinkedIn = res[0]['LinkedIn'];
            this.updateUserModel.TelegramID = res[0]['TelegramID'];
            this.updateUserModel.TinderID = res[0]['TinderID'];
            this.updateUserModel.TwitterID = res[0]['TwitterID'];
            this.updateUserModel.FacebookID = res[0]['FacebookID'];
            this.updateUserModel.GoogleID = res[0]['GoogleID'];

            this.updateUserModel.ProfileImageName = res[0]['ProfileImageName'] ? this.domain_url + 'ProfilePicture/' + res[0]['ProfileImageName'] : '';

            //hiding loader icon
            this.appcmp.showLoader = false;

          } else {

            //hiding loader icon
            this.appcmp.showLoader = false;
          }
        } else {

          //hiding loader icon
          this.appcmp.showLoader = false;
        }
      });
    }
  }

  //for update the profile.
  updateProfile(form: NgForm) {
    if (this.UserID) {

      //If linkedin url does not have protocol then add
      if (form.value.LinkedIn && (form.value.LinkedIn.indexOf('https') == -1 || form.value.LinkedIn.indexOf('http') == -1)) {
        form.value.LinkedIn = 'https://' + form.value.LinkedIn;
      }

      //If linkedin url does not have protocol then add
      if (form.value.FacebookID && (form.value.FacebookID.indexOf('https') == -1 || form.value.FacebookID.indexOf('http') == -1)) {
        form.value.FacebookID = 'https://' + form.value.FacebookID;
      }

      //If linkedin url does not have protocol then add
      if (form.value.GoogleID && (form.value.GoogleID.indexOf('https') == -1 || form.value.GoogleID.indexOf('http') == -1)) {
        form.value.GoogleID = 'https://' + form.value.GoogleID;
      }

      //If linkedin url does not have protocol then add
      if (form.value.TwitterID && (form.value.TwitterID.indexOf('https') == -1 || form.value.TwitterID.indexOf('http') == -1)) {
        form.value.GiverLinkedIn = 'https://' + form.value.TwitterID;
      }

      const data = {
        UserID: this.UserID,
        FirstName: form.value.FirstName,
        LastName: form.value.LastName,
        EmailID: form.value.EmailID,
        PhoneNumber: form.value.PhoneNumber,
        LinkedIn: form.value.LinkedIn,
        FacebookID: form.value.FacebookID,
        GoogleID: form.value.GoogleID,
        TwitterID: form.value.TwitterID,
        TinderID: form.value.TinderID || '',
        TelegramID: form.value.TelegramID || '',
      }

      localStorage.setItem('LinkedIn', form.value.LinkedIn);
      let full_name = form.value.FirstName +' '+form.value.LastName;

      //showing loader icon
      this.appcmp.showLoader = true;
      this.appcmp.loadermessage = 'Please wait...';
      
      return this.http
      .put(`${environment.domainApi}I2B_Users/UpdateUserAllDetails`, data).subscribe(res=>{
        
        if (res[0]['ResponseStatus'] == 'Success') {
          
          //converting user's first letter to be capital
          this.surveyCmp.UserName = this.capital_letter(full_name);

          this.router.navigateByUrl('/I2BApplication/Dashboard');
          //this._notificationservice.success("Your details has been updated successfully.");
          //hidding loader icon
          this.appcmp.showLoader = false;
        }
      });
    }
  }
  
  capital_letter(str) {
    
    if (str) {
      str = str.split(" ");

      for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
      }

      return str.join(" ");
    }
  }
}



