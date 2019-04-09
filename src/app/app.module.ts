import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MessageChatUiComponent } from './message-chat-ui/message-chat-ui.component';
import { ChatService } from './services/chat-service.service';
import { HttpClientModule } from '@angular/common/http'
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component'
import { SpeechRecognitionService } from './services/speechtotext.service';
import { RouterModule, Routes } from '@angular/router';
import Speech from 'speak-tts';
import { LayoutComponent } from './layout/layout.component';
import { BotComponent } from './bot/bot.component';
import { HomeComponent } from './home/home.component';
import Filter from 'bad-words';

@NgModule({
  declarations: [
    AppComponent,
    MessageChatUiComponent,
    SpeechToTextComponent,
    LayoutComponent,
    BotComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    
  ],
  providers: [
    ChatService,
    SpeechRecognitionService,
    Speech,
    Filter
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
