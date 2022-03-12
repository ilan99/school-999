import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/models/message.interface';
import { MessageService } from 'src/app/services/message.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class MessageComponent implements OnInit {
  public messages: Message[] = [];
  public dataSource: MatTableDataSource<Message>;
  public displayedColumns: string[] = ['sentDate', 'subject'];
  public expandedElement: Message | null = null;

  @ViewChild(MatSort) sort: any;

  constructor(private messageService: MessageService) {
    this.dataSource = new MatTableDataSource(this.messages);
  }

  ngOnInit(): void {
    this.messageService.getAllMessages().then((res) => {
      this.messages = [...res.data];
      this.dataSource = new MatTableDataSource(this.messages);
      this.dataSource.sort = this.sort;
    });
  }
}
