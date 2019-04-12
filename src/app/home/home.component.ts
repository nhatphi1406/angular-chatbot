import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private chatSvc: ChatService) { 
    this.chatSvc.setUUID();
  }

  ngOnInit() {
  }

}
