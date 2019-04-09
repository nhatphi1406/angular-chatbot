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

  ]
  listening: boolean;
  speechData: string;
  img: string;
  constructor(private chatSVC: ChatService, private speechRecognitionService: SpeechRecognitionService) {
    this.listening = true;
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
    });

    if (this.chatSVC.checkBadWords(this.input)) {
      console.log(this.chatSVC.checkBadWords(this.input));
      this.chatList.push({
        sender: 'bot',
        message: 'Your question contains bad words, please say again!'
      })
    }
    else {
      this.chatSVC.sendMessage(this.input).subscribe(data => {
        console.log(data);
        this.speechRecognitionService.sayCancel();
        this.speechRecognitionService.sayIt(data[0].text);
        this.chatList.push({
          sender: 'bot',
          message: data[0].text
        })
      });
    }
    this.input = '';
  }
  activateSpeechSearchMovie(): void {
    this.listening = false;
    this.speechRecognitionService.record()
      .subscribe(
        //listener
        (value) => {
          this.listening = true;
          this.speechData = 'You said: ' + value;
          this.speechRecognitionService.DestroySpeechObject();
          this.chatList.push({
            sender: 'user',
            message: value
          })
          if (this.chatSVC.checkBadWords(this.input)) {
            this.chatList.push({
              sender: 'bot',
              message: 'Your question contains bad words, please say again!'
            })
          }
          else {
            this.chatSVC.sendMessage(value).subscribe(data => {
              console.log(data);
              this.chatList.push({
                sender: 'bot',
                message: data[0].text
              })
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
          }
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
          this.listening = true;
          console.log("--complete--");
          this.stop();
        });
  }

  stop() {
    this.speechRecognitionService.DestroySpeechObject();
    this.listening = true;
  }

}
