import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu'; 
import { MatToolbar } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


interface User {
  username: string,
	email: string,
}

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [
		MatIcon,
		MatMenuModule,
		MatDivider,
		MatToolbar,
		MatProgressSpinnerModule,

	],
  templateUrl: './avatar.component.html',
})
export class AvatarComponent {
	user: User | null = null;

}
