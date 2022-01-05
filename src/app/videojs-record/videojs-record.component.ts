import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';

import videojs from 'video.js';
import * as RecordRTC from 'recordrtc';

import * as Record from 'videojs-record/dist/videojs.record.js';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-videojs-record',
  templateUrl: './videojs-record.component.html',
  styleUrls: ['./videojs-record.component.css']
})
export class VideojsRecordComponent implements OnInit, OnDestroy {

  // reference to the element itself: used to access events and methods

  // index to create unique ID for component
  idx = 'clip1';
  public preview = null;
  private config: any;
  private player: any; 
  private plugin: any;

  // constructor initializes our declared vars
  constructor(private http: HttpClient) {
    this.player = false;

    // save reference to plugin (so it initializes)
    this.plugin = Record;

    // video.js configuration
    this.config = {
      controls: true,
      autoplay: false,
      fluid: false,
      loop: false,
      width: 320,
      height: 240,
      bigPlayButton: false,
      controlBar: {
        volumePanel: false
      },
      plugins: {
        record: {
          audio: true,
          video: true,
          debug: true,
          maxLength: 30,
          videoMimeType: "video/mp4"
        }
      }
    };
  }

  ngOnInit() {}

  ngAfterViewInit() {
    // ID with which to access the template's video element
    let el = 'video_' + this.idx;

    // setup the player via the unique element ID
    this.player = videojs(document.getElementById(el), this.config, () => {
      console.log('player ready! id:', el);

      // print version information at startup
      var msg = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record') +
        ' and recordrtc ' + RecordRTC.version;
      videojs.log(msg);
    });

    // device is ready
    this.player.on('deviceReady', () => {
      console.log('device is ready!');
    });

    // user clicked the record button and started recording
    this.player.on('startRecord', () => {
      console.log('started recording!');
    });

    // user completed recording and stream is available
    this.player.on('finishRecord', () => {
      const formData: FormData = new FormData();
      formData.append('file', this.player.recordedData, this.player.recordedData.name);
      console.log('finished recording: ', this.player.recordedData);

      console.log('Player: ', this.player);
      return this.http
        .post(`${environment.api}upload`, formData).subscribe(res=>{
          this.preview = `${environment.api}data/file-${this.player.recordedData.name}`
        });
    });

    // error handling
    this.player.on('error', (element, error) => {
      console.warn(error);
    });

    this.player.on('deviceError', () => {
      console.error('device error:', this.player.deviceErrorCode);
    });
  }

  // use ngOnDestroy to detach event handlers and remove the player
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
      this.player = false;
    }
  }

}
