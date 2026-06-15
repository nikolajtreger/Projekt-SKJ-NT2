import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { Actor } from '../../models/user.model';
import { SessionManager } from '../../services/auth.service';
import { PrincipalDataService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: 'user-list.component.html',
  imports: [NgFor, NgIf],
})
export class ActorCatalogComponent implements OnInit, OnDestroy {
  private dataService = inject(PrincipalDataService);
  private sessionMgr = inject(SessionManager);
  private subs: Subscription[] = [];

  @Output() actorSelected = new EventEmitter<Actor>();

  activeId: number | null = null;
  catalog: Actor[] = [];
  displayed: Actor[] = [];
  sessionActor: Actor | null = null;
  filterVal = '';

  ngOnInit(): void {
    this.subs.push(
      this.dataService.listAllActors().subscribe((actors) => {
        this.catalog = actors;
        this.applyFiltering();
      })
    );

    this.subs.push(
      this.sessionMgr.activeActor$.subscribe((act) => {
        this.sessionActor = act;
        this.applyFiltering();
      })
    );

    this.subs.push(
      this.sessionMgr.searchQuery$.subscribe((val) => {
        this.filterVal = val;
        this.applyFiltering();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  toggleActor(id: number): void {
    this.activeId = this.activeId === id ? null : id;
  }

  selectActor(act: Actor): void {
    this.actorSelected.emit(act);
  }

  clearActor(): void {
    this.activeId = null;
  }

  private applyFiltering(): void {
    const q = this.filterVal.trim().toLowerCase();

    this.displayed = this.catalog
      .filter((act) => act.id !== this.sessionActor?.id)
      .filter((act) => act.last.toLowerCase().includes(q));
  }
}
