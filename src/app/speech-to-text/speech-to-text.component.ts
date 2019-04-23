import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpeechRecognitionService } from '../services/speechtotext.service';
import { ChatService } from '../services/chat-service.service';

@Component({
    selector: 'app-speech-to-text',
    templateUrl: './speech-to-text.component.html',
    styleUrls: ['speech-to-text.component.scss']
})

export class SpeechToTextComponent implements OnInit, OnDestroy {
    showSearchButton: boolean;
    speechData: string;
    img: string;
    constructor(private speechRecognitionService: SpeechRecognitionService, private chatSvc: ChatService ) {
        this.showSearchButton = true;
        this.speechData = "";
       
        this.img = 'gif1.PNG';
    }

    ngOnInit() {
        console.log("hello")
    }

    ngOnDestroy() {
        this.speechRecognitionService.DestroySpeechObject();
    }

    activateSpeechSearchMovie(): void {
        this.showSearchButton = false;
        
        this.speechRecognitionService.record()
            .subscribe(
                //listener
                (value) => {
                    
                    this.speechData = value;
                    this.chatSvc.sendMessage(value).subscribe(data => {
                        this.showSearchButton = true;
                        this.speechRecognitionService.DestroySpeechObject();
                        // if(Object.keys(data).length != 0)
                        // {
                        //     this.img = 'gif1.gif';
                        //     this.speechRecognitionService.sayCancel();
                        //     this.speechRecognitionService.sayIt(data[0].text);
                        //     this.speechRecognitionService.msg.addEventListener('end', ()=> {
                        //         console.log('dsadsadsa');
                        //         this.img = 'gif1.PNG';
                        //     })
                        // }
                        // else {
                        //     console.log("dun no")
                        // }   
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