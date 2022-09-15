import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.css'],
})
export class ToggleSwitchComponent implements OnInit {
  @Input('activeCircleColor') activeCircleColor!: string;
  @Input('inactiveCircleColor') inactiveCircleColor!: string;
  @Input('activeBackgroundColor') activeBackgroundColor!: string;
  @Input('inactiveBackgroundColor') inactiveBackgroundColor!: string;
  @Input('toggleHeight') toggleHeight!: string;
  @Input('toggleWidth') toggleWidth!: string;
  @Input('defaultChecked') defaultChecked: boolean = false;
  @Input('disabled') disabled: boolean = false;

  @Output() onToggle: EventEmitter<boolean> = new EventEmitter();
  
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  toggleSwitch!: HTMLInputElement;

  constructor() {}

  handleToggle() {
    this.onToggle.emit(this.inputRef?.nativeElement.checked);
  }

  ngOnInit(): void {}
}
