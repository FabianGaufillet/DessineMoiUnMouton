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
  websocketService = inject(WebsocketService);
  subscription!: Subscription;
  chatMessages: string[] = [];

  @ViewChild('gameCanvas') gameCanvas?: ElementRef<HTMLCanvasElement>;
  context?: CanvasRenderingContext2D | null;
  isDrawing = false;
  x = 0;
  y = 0;

  chatForm = new FormGroup({
    messageFromChat: new FormControl('', [Validators.required]),
  });

  constructor() {}

  ngOnInit() {
    this.subscription = this.websocketService
      .onMessage('chat')
      .subscribe((message: string) => {
        this.chatMessages.push(message);
      });
  }

  ngAfterViewInit() {
    this.context = this.gameCanvas?.nativeElement.getContext('2d');
    this.context!.strokeStyle = 'black';
    this.context!.lineWidth = 10;
    this.context!.lineJoin = 'round';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.websocketService.disconnect();
  }

  sendMessage(event: KeyboardEvent) {
    if (event.code === 'Enter' && this.chatForm.valid) {
      this.websocketService.sendMessage(
        'chat',
        this.chatForm.get('messageFromChat')?.value,
      );
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
    this.drawLine(this.context, this.x, this.y, event.offsetX, event.offsetY);
    this.x = event.offsetX;
    this.y = event.offsetY;
  }

  stopDrawing(event: MouseEvent) {
    if (!this.isDrawing) return;
    this.drawLine(this.context, this.x, this.y, event.offsetX, event.offsetY);
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
