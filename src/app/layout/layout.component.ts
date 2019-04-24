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
  searchData: any;
  constructor(private chatSVC: ChatService, private speechRecognitionService: SpeechRecognitionService) {
    this.listening = true;
    this.speechData = "";
    this.img = 'normal.gif';
    this.chatSVC.setUUID();
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.speechRecognitionService.DestroySpeechObject();
  }

  send() {
    if(this.input != ''){
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
          this.botRely(data)
        });
      }
      this.input = '';
    }
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
              this.botRely(data)
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

  botSay(text: String) {
    this.img = 'talk.gif';
    this.speechRecognitionService.sayCancel();
    this.speechRecognitionService.sayIt(text);
    this.speechRecognitionService.msg.addEventListener('end', () => {
      this.img = 'normal.gif';
    })
  }

  botRely(data: any) {
    console.log(data);
    let rep:any;
    let suggest:any;
    if(data.length > 1) {
      rep = data[0];
      suggest = data[1]
    }
    else {
      rep = data[0]
    }
    // data.forEach(data => {
    // })

    if (!rep.status) {
      this.chatSVC.searchGG(rep.data);
      setTimeout(() => {
        this.chatSVC.botRep.subscribe(data => {
          this.searchData = data
        })
  
        console.log(this.searchData);
        if (this.searchData.resultNumber != null) {
          if (this.searchData.resultNumber == 0) {
            this.chatList.push({
              sender: 'bot',
              message: 'Sorry, it out of my knowledge'
            })
            this.botSay('Sorry, it out of my knowledge')
          }
          else if (this.searchData.resultNumber > 0) {
            this.chatList.push({
              sender: 'bot',
              message: 'I don\'t know, but here is some information from Internet'
            })
            this.searchData.result.slice(0,3).forEach(x=> {
              this.chatList.push({
                sender: 'bot',
                message: `<a href="${x.link}"  target="_blank">${x.title}</a>`
              })
            })
            this.botSay('I don\'t know, but here is some information from Internet')
          }
        }
      }, 1000);
    }
    else {
      this.chatList.push({
        sender: 'bot',
        message: rep.data
      })

      this.botSay(rep.data.replace("&bull;",""))
    }
    if(suggest){
      this.chatList.push({
        sender: 'bot',
        message: suggest.data
      })
    }
  }
}
