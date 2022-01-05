import { Injectable } from '@angular/core';
declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class TestUserService {
  recognition =  new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  public text = '';
  tempWords:any;
  IsClear:boolean = false;

  constructor() { }

 init(): void {

    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.addEventListener('result', (e:any) => {
      let target, index;

    if (e && e.target) target = e.target;
      const transcript = Array.from(e.results)
        .map((result:any) => result[0])
        .map((result:any) => result.transcript)
        .join('');
      this.tempWords = transcript;
      console.log(this.tempWords);
    });
  }

  start() {
    this.isStoppedSpeechRecog = false;
    this.IsClear = false;
    this.recognition.start();
    console.log("Speech recognition started")
    this.recognition.addEventListener('end', (condition:any) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
        console.log("End speech recognition")
      } else {
        this.wordConcat();
        this.recognition.start();
      }
    });
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    this.IsClear = true;
    this.wordConcat();
    this.recognition.stop();
    console.log("End speech recognition")
  }

  /*clear() {
    this.IsClear = true;
  }*/

  wordConcat() {
    this.text = this.text + ' ' + this.tempWords + '.';
    this.tempWords = '';
    console.log(this.text);

    if(this.IsClear) this.text = '';
    
    //localStorage.setItem("Speech", this.text);
    //return this.text;
  }
}