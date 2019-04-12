import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Filter from 'bad-words';
import { map, buffer } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import uuidv1 from 'uuid/v1';
@Injectable(
    {
        providedIn: 'root',
    }
)
export class ChatService {
    private _botRep: BehaviorSubject<any> = new BehaviorSubject([]);
    get botRep() {
        return this._botRep.asObservable();
    }
    constructor(private httpClient: HttpClient, private filter: Filter) { }
    text: any;
    user: String;
    uuid = sessionStorage.getItem('uuid');
    searchApi = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyBJ5YK0xnI7q2t8F0_7cU4cCk8K0aTMPfc&cx=001248996495676488262:abw7zzcpito&q=';
    sendMessage(text: String) {
        if (!this.uuid) {
            this.setUUID();
        }
        const data = this.httpClient.post(`https://691829ec.ngrok.io/webhooks/rest/webhook`, {
            "sender": this.uuid,
            "message": text
        }
        ).pipe(map((res: any) => {
            if (res[0].text == 'Sorry, I didn’t understand that.') {
                return {
                    status: false,
                    data: text
                }
            }
            else {
                return {
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
        return this.httpClient.get(`${this.searchApi}${text}`)
            .pipe(map((response: any) => {
                let data: any = {
                    resultNumber: response.searchInformation.totalResults,
                    result: response.items || null
                }
                return data
            }))
            .subscribe((data: any) => {
                console.log(data);
                this._botRep.next(data);
            }, (error) => {
                console.log(error)
            });
    }
    setUUID() {
        if (!this.uuid) {
            sessionStorage.setItem('uuid', uuidv1());
        }
    }
}