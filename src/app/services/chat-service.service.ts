import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Filter from 'bad-words';
import { map, buffer } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import uuidv1 from 'uuid/v1';
import { forEach } from '@angular/router/src/utils/collection';
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
        const data = this.httpClient.post(`https://58a86aa3.ngrok.io/webhooks/rest/webhook`, {
            "sender": this.uuid,
            "message": text
        }
        ).pipe(map((res: any) => {
            console.log(res);
            if(res=== undefined || res.length == 0){
                const data = [{
                        status: false,
                        data: text
                }]
                return data
            }
            const data = res.map(x=> {
                if (x.text == 'Sorry, I do not understand.' ) {
                    return {
                        status: false,
                        data: text
                    }
                }
                else {
                    return {
                        status: true,
                        data: x.text
                    }
                }
            })
            return data
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
            }, () => {
                console.log("complete");
            }
            );
    }
    setUUID() {
            sessionStorage.setItem('uuid', uuidv1());
    }
}