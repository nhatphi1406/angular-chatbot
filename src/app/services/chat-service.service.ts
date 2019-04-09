import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Filter from 'bad-words';
@Injectable(
    {
        providedIn: 'root',
    }
)
export class ChatService {
    constructor(private httpClient: HttpClient, private filter: Filter) { }
    text: any;
    
    sendMessage(text: String) {
        console.log(text);
        return this.httpClient.post(`https://713f5bc8.ngrok.io/webhooks/rest/webhook`, {
            "sender": "user",
            "message": text
        })
    }
    checkBadWords(text: String) {
        this.text = new Filter();
        return this.text.isProfane(text);
    }
    
}