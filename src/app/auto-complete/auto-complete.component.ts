import { ListKeyManager } from '@angular/cdk/a11y';
import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  Output,
  EventEmitter,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { UP_ARROW, DOWN_ARROW, ENTER, TAB } from '@angular/cdk/keycodes';

export class Item {
  constructor(public id: number, public name: string) {}
}

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css'],
})
export class AutoCompleteComponent implements OnInit, OnDestroy {
  itemCtrl: FormControl;
  filteredItems: Observable<any[]>;
  inputOnFocus: boolean = false;
  noDataAvailable: boolean = false;
  activeItem: number = -1;
  inputText: string = '';

  @Input('dataSource') dataSource: Item[] = [];
  @Input('placeHolder') placeHolder: string = '';
  @Input('outlineColor') outlineColor: string = '';
  @Input('borderColor') borderColor: string = '';
  @Input('width') width: string = '';
  @Input('inputFontFamily') inputFontFamily: string = '';

  @Output('onSelectItem') onSelectItem: EventEmitter<Item> = new EventEmitter();

  @ViewChild('hostRef') hostRef!: ElementRef<HTMLDivElement>;

  @ViewChildren('listDiv') listDiv!: QueryList<ElementRef>;

  @ContentChild('rowTemplate', { static: false }) headerTemplateRef:
    | TemplateRef<any>
    | undefined;

  onExternalClickSubscription = new Subscription();
  onExternalClickObservable: Observable<Event> = fromEvent(window, 'click');
  allEvents$ = merge(this.onExternalClickObservable);

  constructor() {
    this.itemCtrl = new FormControl();
    this.filteredItems = this.itemCtrl.valueChanges.pipe(
      startWith(''),
      map((inputText) => {
        if (typeof inputText === 'object') {
          return this.filterItems('');
        } else if (inputText) {
          this.noDataAvailable =
            this.filterItems(inputText).length === 0 ? true : false;
          return this.filterItems(inputText);
        } else {
          return this.dataSource;
        }
      })
    );
  }

  ngOnInit(): void {
    this.initCloseOnOutsideClick();
  }

  ngOnDestroy(): void {
    this.destroyCloseOnOutsideClick();
  }

  filterItems(name: string) {
    this.activeItem = -1;
    let filteredItems = this.dataSource.filter((item) =>
      item.name.toLocaleLowerCase().includes(name.toLowerCase())
    );
    return filteredItems;
  }

  selectItem(item: Item) {
    this.resetActiveItem();
    this.onSelectItem.emit(item);
  }

  initCloseOnOutsideClick() {
    this.onExternalClickSubscription = this.allEvents$.subscribe(
      (event: any) => {
        if (!this.hostRef.nativeElement.contains(event.target)) {
          this.resetActiveItem();
        }
      }
    );
  }

  destroyCloseOnOutsideClick() {
    this.onExternalClickSubscription.unsubscribe();
  }

  handleKeydown(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    let activeElement = document.activeElement as HTMLElement;

    if (event.keyCode === DOWN_ARROW) {
      let nextElement = activeElement?.nextElementSibling;

      if (nextElement?.id === 'auto-complete-options') {
        nextElement = nextElement.children[0];
      }
      if (nextElement) {
        this.changeFocusedElement(activeElement, nextElement);
      }
    } else if (event.keyCode === UP_ARROW) {
      let previousElement = activeElement?.previousElementSibling;
      if (previousElement) {
        this.changeFocusedElement(activeElement, previousElement);
      }
    } else if (event.keyCode === ENTER) {
      activeElement.click();
      this.resetActiveItem();
    } else if (event.keyCode === TAB) {
      this.inputOnFocus = false;
    } else {
      let inputField = activeElement?.parentElement?.previousElementSibling;
      if (inputField) {
        this.changeFocusedElement(activeElement, inputField);
      }
    }
  }

  changeFocusedElement(activeElement: Element, otherElement: Element) {
    let activeHtmlElement = activeElement as HTMLElement;
    activeHtmlElement.tabIndex = -1;

    let otherHtmlElement = otherElement as HTMLElement;
    otherHtmlElement.tabIndex = 0;
    otherHtmlElement.focus();
  }

  handleInputChange() {
    this.inputOnFocus = this.inputText !== '';
  }

  resetActiveItem(): void {
    this.itemCtrl.patchValue('');
    this.inputOnFocus = false;
    this.activeItem = -1;
  }
}
