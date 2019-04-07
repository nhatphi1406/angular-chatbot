// import { Injectable } from '@angular/core';
// import { Speech } from 'speak-tts';

// @Injectable()
// export class ttsService {
//     speech = new Speech();
//     constructor() {
//         if () { // returns a boolean
//             Speech.init({
//                 'volume': 1,
//                 'lang': 'en-GB',
//                 'rate': 1,
//                 'pitch': 1,
//                 'voice': 'Google UK English Male',
//                 'splitSentences': true,
//                 'listeners': {
//                     'onvoiceschanged': (voices) => {
//                         console.log("Event voiceschanged", voices)
//                     }
//                 }
//             })
//         }
//     }
//     speak() {
//         this.speech.speak({
//             text: 'Hello, how are you today ?',
//         }).then(() => {
//             console.log("Success !")
//         }).catch(e => {
//             console.error("An error occurred :", e)
//         })
//     }

// }