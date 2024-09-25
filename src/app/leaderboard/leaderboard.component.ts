import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

interface User {
  first_name: string;
  last_name: string;
  points: number;
  playing_time: number;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss',
})
export class LeaderboardComponent implements AfterViewInit, OnChanges {
  displayedColumns: string[] = [
    'first_name',
    'last_name',
    'points',
    'playing_time',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() data!: any[];

  dataSource = new MatTableDataSource<User>(this.data);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    this.dataSource.data = this.data;
  }
}
