import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-static-rating-star',
  templateUrl: './static-rating-star.component.html',
  styleUrls: ['./static-rating-star.component.css']
})
export class StaticRatingStarComponent implements OnInit {
  @Input() rating: number;
  @Input() itemId: number;
  model: any = {};
  @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();
  parentMessage: string;
  inputName: string;
  message: string;
  ngOnInit() {
    this.inputName = this.itemId + '_rating';
    // this.rating = 3.5;
  }

  sendMessage() {
    this.parentMessage = this.model.usertextmsg;
  }


  receiveMessage($event) {
    this.message = $event
  }


  //Rate method for rating star
  onClick(rating: number): void {

    this.rating = rating;
    this.ratingClick.emit({
      itemId: this.itemId,
      rating: rating  
    });
  }
}
