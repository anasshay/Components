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
} from '@angular/core';

import { Observable, Subscription, fromEvent } from 'rxjs';
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

  @ContentChild('rowTemplate', { static: false }) headerTemplateRef:
    | TemplateRef<any>
    | undefined;

  onExternalClickSubscription = new Subscription();
  onExternalClickObservable: Observable<Event> = fromEvent(window, 'click');

  constructor() {}

  ngOnInit(): void {
    this.initCloseOnOutsideClick();
  }

  ngOnDestroy(): void {
    this.destroyCloseOnOutsideClick();
  }

  get filteredItems() {
    if (this.inputText.length > 0) {
      this.noDataAvailable =
        this.filterItems(this.inputText).length === 0 ? true : false;
      return this.filterItems(this.inputText);
    } else {
      return [];
    }
  }

  filterItems(name: string) {
    this.activeItem = -1;
    let filteredItems = this.dataSource.filter((item) =>
      item.name.toLocaleLowerCase().includes(name.toLowerCase())
    );
    return filteredItems;
  }

  handleInputChange() {
    this.inputOnFocus = this.inputText !== '';
  }

  selectItem(item: Item) {
    this.resetActiveItem();
    this.onSelectItem.emit(item);
  }

  initCloseOnOutsideClick() {
    this.onExternalClickSubscription = this.onExternalClickObservable.subscribe(
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
      this.handleDownArrow(activeElement);
    } else if (event.keyCode === UP_ARROW) {
      this.handleUpArrow(activeElement);
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

  handleDownArrow(activeElement: Element) {
    let nextElement = activeElement?.nextElementSibling;
    if (nextElement?.id === 'auto-complete-options') {
      nextElement = nextElement.children[0];
    }
    if (nextElement) {
      this.changeFocusedElement(activeElement, nextElement);
    }
  }
  handleUpArrow(activeElement: Element) {
    let previousElement = activeElement?.previousElementSibling;
    if (previousElement) {
      this.changeFocusedElement(activeElement, previousElement);
    }
  }

  changeFocusedElement(activeElement: Element, otherElement: Element) {
    let activeHtmlElement = activeElement as HTMLElement;
    activeHtmlElement.tabIndex = -1;

    let otherHtmlElement = otherElement as HTMLElement;
    otherHtmlElement.tabIndex = 0;
    otherHtmlElement.focus();
  }

  resetActiveItem(): void {
    this.inputText = '';
    this.inputOnFocus = false;
    this.activeItem = -1;
  }
}
