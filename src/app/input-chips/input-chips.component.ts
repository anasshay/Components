import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Tag } from './Tag';

@Component({
  selector: 'exact-input-chips',
  templateUrl: './input-chips.component.html',
  styleUrls: ['./input-chips.component.scss'],
})
export class InputChipsComponent implements OnInit {
  faTimes = faTimes;

  private _selectedValues: Tag[] = [];

  @Input('dataSource') dataSource: Tag[] = [];
  @Input('miniChips') miniChips: boolean = false;
  @Input('selectedValues') set selectedValues(values: number[]) {
    this.updateSelectedChips(values);
  }
  get selectedValues(): any[] {
    return this._selectedValues;
  }

  @Output('select') select: EventEmitter<Tag> = new EventEmitter();
  @Output('remove') remove: EventEmitter<Tag> = new EventEmitter();
  @Output('clearAll') clearAll: EventEmitter<Tag[]> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  updateSelectedChips(values: number[]): void {
    let updatedTags: Tag[] = [];
    this.dataSource.forEach((tag: Tag) => {
      if (values.includes(tag.id)) {
        updatedTags.push(tag);
      }
    });
    this._selectedValues.push(...updatedTags);
  }

  addTag(tag: Tag) {
    this.updateSelectedChips([tag.id]);
    this.select.emit(tag);
  }

  removeTag(tag: Tag) {
    let tagIndex = this._selectedValues.findIndex((t: Tag) => {
      return t.id === tag.id;
    });
    this._selectedValues.splice(tagIndex, 1);
  }

  clearAllTags() {
    this._selectedValues = [];
    this.clearAll.emit(this.selectedValues);
  }
}
