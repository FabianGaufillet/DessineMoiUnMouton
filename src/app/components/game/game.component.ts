import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WebsocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy, AfterViewInit {
  userService = inject(UserService);
  websocketService = inject(WebsocketService);
  subscription: Subscription[] = [];
  chatMessages: any[] = [];

  @ViewChild('gameCanvas') gameCanvas?: ElementRef<HTMLCanvasElement>;
  context?: CanvasRenderingContext2D | null;
  remainingTime: number | null = null;
  isDrawing = false;
  x = 0;
  y = 0;

  chatForm = new FormGroup({
    messageFromChat: new FormControl('', [Validators.required]),
  });

  constructor() {}

  ngOnInit() {
    this.subscription.push(
      this.websocketService.onMessage('chat').subscribe((data: any) => {
        this.chatMessages.push({
          id: this.chatMessages.length,
          message: data['message'],
          class: data['class'],
        });
      }),
      this.websocketService.onMessage('draw').subscribe((data: any) => {
        this.drawLine(this.context, data.x, data.y, data.offsetX, data.offsetY);
      }),
      this.websocketService
        .onMessage('remainingTime')
        .subscribe((time: number) => {
          this.remainingTime = time > 0 ? time : null;
        }),
    );
  }

  ngAfterViewInit() {
    this.context = this.gameCanvas?.nativeElement.getContext('2d');
    this.context!.strokeStyle = 'black';
    this.context!.lineWidth = 10;
    this.context!.lineJoin = 'round';
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
    this.websocketService.disconnect();
  }

  sendMessage(event: KeyboardEvent) {
    if (event.code === 'Enter' && this.chatForm.valid) {
      this.websocketService.sendMessage('chat', {
        user: this.userService.user,
        chatMessage: this.chatForm.get('messageFromChat')?.value,
      });
      this.chatForm.reset();
    }
  }

  startDrawing(event: MouseEvent) {
    this.x = event.offsetX;
    this.y = event.offsetY;
    this.isDrawing = true;
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    this.websocketService.sendMessage('draw', {
      x: this.x,
      y: this.y,
      offsetX: event.offsetX,
      offsetY: event.offsetY,
    });
    this.x = event.offsetX;
    this.y = event.offsetY;
  }

  stopDrawing(event: MouseEvent) {
    if (!this.isDrawing) return;
    this.websocketService.sendMessage('draw', {
      x: this.x,
      y: this.y,
      offsetX: event.offsetX,
      offsetY: event.offsetY,
    });
    this.x = 0;
    this.y = 0;
    this.isDrawing = false;
  }

  drawLine(ctx: any, x1: any, y1: any, x2: any, y2: any) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
  }
}
