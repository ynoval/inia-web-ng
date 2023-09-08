import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * Generic Search Component
 *
 * @export
 * @class SearchComponent
 * @typedef {SearchComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  /**
   * Initial value
   *
   * @type {string}
   */
  @Input() initialValue: string = '';

  /**
   * Placeholder
   *
   * @type {string}
   */
  @Input() placeholder: string = 'Buscar...';

  /**
   * Event to be emitted when user user type
   *
   * @type {EventEmitter<string>}
   */
  @Output() search = new EventEmitter<string>();

  /**
   * Internal search term state variable
   *
   * @type {string}
   */
  searchTerm: string = '';

  /**
   * BehaviorSubject to manage initialization and debounce
   *
   * @type {BehaviorSubject<string>}
   */
  searchTerm$ = new BehaviorSubject<string>(this.initialValue || '');

  /**
   * Debounce time in milliseconds
   *
   * @type {number}
   */
  searchDebounce = 500;

  /**
   * Subscribe to the BehaviorSubject to emit search event
   */

  ngOnInit(): void {
    // Emit a search event when new value is emitted (avoid unnecessary search using debounce)
    this.searchTerm$.pipe(debounceTime(this.searchDebounce)).subscribe((searchTerm) => {
      this.search.emit(searchTerm);
    });
  }

  /**
   * Method to react when input change
   * emit a new BehaviorSubject with the value
   *
   * @param {string} searchTerm
   */
  onSearchTermChange(searchTerm: string): void {
    this.searchTerm$.next(searchTerm);
  }

  /**
   * Method to clear search Input
   *
   */
  onClearSearch(): void {
    this.searchTerm = '';
    this.onSearchTermChange('');
  }
}
