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
  selectedValuesArgsData: {
    selectedItems: Tag[];
    lastSelectedItem: Tag | null;
  } = { selectedItems: [], lastSelectedItem: null };

  @Input('dataSource') dataSource: Tag[] = [];
  @Input('miniChips') miniChips: boolean = false;
  @Input('selectedValues') set selectedValues(values: number[]) {
    this._selectedValues = this.updateSelectedChips(values);
    console.log(this._selectedValues);
  }
  get selectedValues(): any[] {
    return this._selectedValues;
  }

  @Output('selectedValuesArgs') selectedValuesArgs: EventEmitter<{
    selectedItems: Tag[];
    lastSelectedItem: Tag;
  }> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  updateSelectedChips(values: number[]): Tag[] {
    let updatedTags: Tag[] = [];
    let lastSelected: Tag | null = null;
    this.dataSource.forEach((tag: Tag) => {
      if (values.includes(tag.id)) {
        lastSelected = null;
        updatedTags.push(tag);
        lastSelected = tag;
      }
    });
    this.selectedValuesArgsData.selectedItems.push(...updatedTags);
    this.selectedValuesArgsData.lastSelectedItem = lastSelected;
    return this.selectedValuesArgsData.selectedItems;
  }

  addTag(tag: Tag) {
    this.updateSelectedChips([tag.id]);
    this.selectedValuesArgs.emit(this.selectedValuesArgsData);
  }
  removeTag(tag: Tag) {
    let tagIndex = this.selectedValuesArgsData.selectedItems.findIndex(
      (t: Tag) => {
        return t.id === tag.id;
      }
    );
    this.selectedValuesArgsData.selectedItems.splice(tagIndex, 1);
    console.log('remove: ', tag);
    console.log(this.selectedValuesArgsData);
  }
  clearAllTags() {}
}
