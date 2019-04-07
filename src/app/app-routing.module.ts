import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component';
import { MessageChatUiComponent } from './message-chat-ui/message-chat-ui.component';
import { LayoutComponent } from './layout/layout.component';
import { BotComponent } from './bot/bot.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'bot',
    component: LayoutComponent,
    children: [
      {
        path: 'message',
        component: MessageChatUiComponent
      },
      {
        path: 'face',
        component: SpeechToTextComponent
      }
    ]
  },
  {
    path: '',
    component: HomeComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
