import { Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as _ from "lodash";

interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
    SpeechSynthesisUtterance: any;
    SpeechTTS: any;
}

@Injectable()
export class SpeechRecognitionService {
    speechRecognition: any;
    msg: any;
    constructor(private zone: NgZone) {
        if (window.speechSynthesis) {
            this.msg = new SpeechSynthesisUtterance();
        }
        const { webkitSpeechRecognition }: IWindow = <IWindow>window;
        this.speechRecognition = new webkitSpeechRecognition();
        this.speechRecognition.continuous = true;
        //this.speechRecognition.interimResults = true;
        this.speechRecognition.lang = 'en-us';
        this.speechRecognition.maxAlternatives = 1;
        //this.speechRecognition.interimResults = true;
    }

    record(): Observable<string> {
        return Observable.create(observer => {
            this.speechRecognition.onresult = speech => {
                let term: string = "";
                if (speech.results) {
                    var result = speech.results[speech.resultIndex];
                    var transcript = result[0].transcript;
                    if (result.isFinal) {
                        console.log(result);
                        if (result[0].confidence < 0.3) {
                            console.log("Unrecognized result - Please try again");
                        }
                        else {
                            term = _.trim(transcript);
                            console.log("Did you said? -> " + term + " , If not then say something else...");
                        }
                    }
                }
                this.zone.run(() => {
                    observer.next(term);
                });
            };

            this.speechRecognition.onerror = error => {
                observer.error(error);
            };

            this.speechRecognition.onend = () => {
                observer.complete();
            };

            this.speechRecognition.start();
            console.log("We are listening !!!");
        });
    }

    DestroySpeechObject() {
        console.log("we stop hearing");
        if (this.speechRecognition)
            this.speechRecognition.stop();
    }

    StartSpeechObject() {
        console.log("We are listening !!!");
        this.speechRecognition.start();
    }
    getVoices() {
        window.speechSynthesis.getVoices();
        return window.speechSynthesis.getVoices();
    }

    sayIt(text) {
        var voices = this.getVoices();
        //choose voice. Fallback to default
        this.msg.voice = voices[0];
        this.msg.volume = 1;
        this.msg.rate = 1.5;
        this.msg.pitch = 1;
        //message for speech
        this.msg.text = text;
        speechSynthesis.speak(this.msg);
    }
    sayCancel() {
        speechSynthesis.cancel();
    }
}