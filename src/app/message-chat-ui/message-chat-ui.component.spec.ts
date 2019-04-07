import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageChatUiComponent } from './message-chat-ui.component';

describe('MessageChatUiComponent', () => {
  let component: MessageChatUiComponent;
  let fixture: ComponentFixture<MessageChatUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageChatUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageChatUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
