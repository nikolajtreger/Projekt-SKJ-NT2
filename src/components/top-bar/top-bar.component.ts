import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Actor } from '../../models/user.model';

@Component({
  selector: 'app-top-bar',
  templateUrl: 'top-bar.component.html',
  imports: [DatePipe, FormsModule, NgIf],
})
export class TopBarComponent {
  @Input() currentActor: Actor | null = null;
  @Input() sessionStart: Date | null = null;
  @Input() clicks = 0;
  @Input() query = '';

  @Output() queryChange = new EventEmitter<string>();
  @Output() logoutEvent = new EventEmitter<void>();

  onSearchInput(val: string): void {
    this.queryChange.emit(val);
  }

  handleLogout(): void {
    this.logoutEvent.emit();
  }
}
