import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DummyUser } from '../../models/user.model';

@Component({
  selector: 'app-top-bar',
  templateUrl: 'top-bar.component.html',
  imports: [DatePipe, FormsModule, NgIf],
})
export class TopBarComponent {
  @Input() currentUser: DummyUser | null = null;
  @Input() loginAt: Date | null = null;
  @Input() clickCount = 0;
  @Input() filterText = '';

  @Output() filterTextChange = new EventEmitter<string>();
  @Output() logoutClicked = new EventEmitter<void>();

  onFilterInput(value: string): void {
    this.filterTextChange.emit(value);
  }

  logout(): void {
    this.logoutClicked.emit();
  }
}
