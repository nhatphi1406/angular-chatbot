import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Filter from 'bad-words';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable(
    {
        providedIn: 'root',
    }
)
export class ChatService {
    constructor(private httpClient: HttpClient, private filter: Filter) { }
    text: any;
    result: {
        status: Boolean,
        data: any
    }
    searchApi = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyBJ5YK0xnI7q2t8F0_7cU4cCk8K0aTMPfc&cx=001248996495676488262:abw7zzcpito&q=';
    sendMessage(text: String) {
        const data = this.httpClient.post(`https://9949a09c.ngrok.io/webhooks/rest/webhook`, {
            "sender": "1",
            "message": text
        }).pipe(map((res:any)=> {
            if(res[0].text == 'Dahell, say it again!'){
                return this.result =  {
                    status: false,
                    // data: this.searchGG(this.text)
                    data: "Dahell, say it again!"
                }
            }
            else {
                return this.result =  {
                    status: true,
                    data: res[0].text
                }
            }
        }))
        return data;
        
    }
    checkBadWords(text: String) {
        this.text = new Filter();
        return this.text.isProfane(text);
    }

    searchGG(text: String) {
        return this.httpClient.get(`${this.searchApi}${text}`);
    }
}