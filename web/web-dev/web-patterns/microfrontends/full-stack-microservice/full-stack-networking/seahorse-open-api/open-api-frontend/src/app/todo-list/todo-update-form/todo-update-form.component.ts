import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-todo-update-form',
  templateUrl: './todo-update-form.component.html',
  styleUrl: './todo-update-form.component.css'
})
export class TodoUpdateFormComponent {
	@Input() newName: string;
	@Output() nameChanged = new EventEmitter<string>();

	constructor() {
		this.newName = '';
	}

	updateName(): void {
		this.nameChanged.emit(this.newName);
	}

}