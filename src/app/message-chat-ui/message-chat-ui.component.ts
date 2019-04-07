import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat-service.service';

@Component({
  selector: 'app-message-chat-ui',
  templateUrl: './message-chat-ui.component.html',
  styleUrls: ['./message-chat-ui.component.scss']
})
export class MessageChatUiComponent implements OnInit {
  input: String = '';
  constructor(private chatSVC: ChatService) {
  }
  chatList: any[] = [
    
  ]

  ngOnInit() {
  }
  send() {
    this.chatList.push({
      sender: 'user',
      message: this.input
    })
    this.chatSVC.sendMessage(this.input).subscribe(data => {
      console.log(data);
      this.chatList.push({
        sender: 'bot',
        message: data[0].text
      })
    });

    this.input = '';
  }
}
