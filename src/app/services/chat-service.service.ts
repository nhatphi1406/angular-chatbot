import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
@Injectable(
    {
     providedIn: 'root',
    }
 )
export class ChatService {
    constructor(private httpClient: HttpClient ) {}
    sendMessage(text: String){
        return this.httpClient.post(`https://4272d421.ngrok.io/webhooks/rest/webhook`,{
            "sender": "user",
			"message": text
        })
    }
}