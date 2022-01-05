import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { RecordingRequestComponent } from '../SurveyApplication/Ask/RecordingRequest/RecordingRequest.component';
import { Test1Component } from '../test1/test1.component';

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<RecordingRequestComponent> {
constructor(private dialog: MatDialog,){}

  canDeactivate(component: RecordingRequestComponent) 
    {
  if(component.isValid){
    console.log('form status',component.recordingDetails)
    return window.confirm('Are sure you want to leave ?')
    //this.dialog.open(Test1Component)
     
  }
   

  
    return true;
  }

  // canDeactivate() :boolean{
  //   // console.log('form status',component.recordingDetails)
  //    return window.confirm('You have some unsaved changes. Are sure you want to leave ?')
  // this.dialog.open(Test1Component,{

  // });
  //    return true;
  //  }
 
}
