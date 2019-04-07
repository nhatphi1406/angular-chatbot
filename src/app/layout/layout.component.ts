import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat-service.service';
import { SpeechRecognitionService } from '../services/speechtotext.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  input: String = '';
  chatList: any[] = [
    {
      sender: 'bot',
      message: 'data[0].text'
    },
    {
      sender: 'user',
      message: 'data[0].text'
    },
    {
      sender: 'bot',
      message: 'data[0].text'
    },
    {
      sender: 'user',
      message: 'data[0].text'
    },
    {
      sender: 'bot',
      message: 'data[0].text'
    },
    {
      sender: 'user',
      message: 'data[0].text'
    },
    {
      sender: 'bot',
      message: 'data[0].text'
    },
    {
      sender: 'user',
      message: 'data[0].text'
    },
    {
      sender: 'bot',
      message: 'data[0].text'
    },
    {
      sender: 'user',
      message: 'data[0].text'
    },
    {
      sender: 'bot',
      message: 'data[0].text'
    },
    {
      sender: 'user',
      message: 'data[0].text'
    },
    {
      sender: 'bot',
      message: 'data[0].text'
    },
    {
      sender: 'user',
      message: 'data[0].text'
    },
  ]
  showSearchButton: boolean;
  speechData: string;
  img: string;
  constructor(private chatSVC: ChatService, private speechRecognitionService: SpeechRecognitionService) {
    this.showSearchButton = true;
    this.speechData = "";

    //this.img = 'gif1.PNG';
    
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.speechRecognitionService.DestroySpeechObject();
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
  activateSpeechSearchMovie(): void {
    this.showSearchButton = false;

    this.speechRecognitionService.record()
      .subscribe(
        //listener
        (value) => {
          this.speechData = value;
          this.chatList.push({
            sender: 'user',
            message: value
          })
          this.chatSVC.sendMessage(value).subscribe(data => {
            this.showSearchButton = true;
            this.chatList.push({
              sender: 'bot',
              message: data[0].text
            })
            this.speechRecognitionService.DestroySpeechObject();
            if (Object.keys(data).length != 0) {
              this.img = 'gif1.gif';
              this.speechRecognitionService.sayCancel();
              this.speechRecognitionService.sayIt(data[0].text);
              this.speechRecognitionService.msg.addEventListener('end', () => {
                this.img = 'gif1.PNG';
              })
            }
            else {
              console.log("dun no")
            }
          });

        },
        //errror
        (err) => {
          console.log(err);
          if (err.error == "no-speech") {
            console.log("--restatring service--");
            this.activateSpeechSearchMovie();
          }
        },
        //completion
        () => {
          this.showSearchButton = true;
          console.log("--complete--");
          this.stop();
        });
  }

  stop() {
    this.speechRecognitionService.DestroySpeechObject();
  }

}
