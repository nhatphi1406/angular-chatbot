import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat-service.service';
import { SpeechRecognitionService } from '../services/speechtotext.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(300)),
    ]),
    trigger('EnterBot', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s 300ms ease-in')
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('EnterUser', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(200%)' }),
        animate('0.5s 300ms ease-in')
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class LayoutComponent implements OnInit {
  input: String = '';
  chatList: any[] = [
  ];
  typing: Boolean = false;
  loading: Boolean = false;
  listening: boolean;
  speechData: string;
  img: string;
  searchData: any;
  isSpeaking: boolean;
  constructor(private chatSVC: ChatService, private speechRecognitionService: SpeechRecognitionService) {
    this.listening = true;
    this.speechData = "";
    this.img = 'normal.gif';
    this.chatSVC.setUUID();
    this.isSpeaking = true;
    this.chatList.push({
      sender: 'bot',
      message: `Hello, I’m BK bot. I try to be helpful  (But I’m still just a bot. Sorry!).
      \n I can provide information about University of Technology, study programs, admission process.
      \n If you're not sure about something just type your question below.
      \n Or press the micro icon to use voice chat.`
    })

  }

  ngOnInit() {
    // this.botSay(`Hello, I’m BK bot. I try to be helpful.
    // \n I can provide information about University of Technology, study programs, admission process.
    // \n If you're not sure about something just type your question below.
    // \n Or press the micro icon to use voice chat.`)
  }
  ngOnDestroy() {
    this.speechRecognitionService.DestroySpeechObject();
  }

  send() {
    this.stopSpeaking();
    if (this.input != '') {
      this.chatList.push({
        sender: 'user',
        message: this.input
      });

      if (this.chatSVC.checkBadWords(this.input)) {
        this.chatList.push({
          sender: 'bot',
          message: 'Your question contains bad words, please say again!'
        })
      }
      else {
        this.loading = true;
        this.chatSVC.sendMessage(this.input).subscribe(data => {
          this.botRely(data);
          this.loading = false;
        });
      }
      this.input = '';

    }
    event.stopPropagation();
  }
  activateSpeechSearchMovie(): void {
    this.listening = false;
    this.speechRecognitionService.record()
      .subscribe(
        //listener
        (value) => {
          this.stopSpeaking();
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
            this.loading = true;
            this.chatSVC.sendMessage(value).subscribe(data => {
              this.botRely(data);
              this.loading = false;
            });
          }
          this.loading = false;
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
    let sayText = text.replace(/(https?:\/\/[^\s]+)/g, '');
    sayText = sayText.replace(/&bull;/g, '');
    
    this.speechRecognitionService.sayCancel();
    this.isSpeaking = false;
    this.speechRecognitionService.sayIt(sayText);
    this.speechRecognitionService.msg.addEventListener('end', () => {
      this.img = 'normal.gif';
      this.isSpeaking = true;
    })
  }

  stopSpeaking() {
    this.speechRecognitionService.sayCancel();
    this.speechRecognitionService.msg.addEventListener('end', () => {
      this.img = 'normal.gif';
      this.isSpeaking = true;
    })
  }

  botRely(data: any) {
    let rep: any;
    let suggest: any;
    if (data.length > 1) {
      rep = data[0];
      suggest = data[1]
    }
    else {
      rep = data[0]
    }
    if (!rep.status) {
      this.chatSVC.searchGG(rep.data);
      setTimeout(() => {
        this.chatSVC.botRep.subscribe(data => {
          this.searchData = data
        })

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
            this.searchData.result.slice(0, 3).forEach(x => {
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
        message: `${rep.data}`
      })
      this.botSay(rep.data)
    }
    if (suggest) {
      this.chatList.push({
        sender: 'bot',
        message: suggest.data
      })
    }
  }

}
