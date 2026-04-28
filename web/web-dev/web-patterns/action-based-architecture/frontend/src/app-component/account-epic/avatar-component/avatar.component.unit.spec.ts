import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { MatMenuHarness, MatMenuItemHarness } from  '@angular/material/menu/testing';
import { MatProgressSpinnerHarness } from '@angular/material/progress-spinner/testing';

import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AvatarComponent } from './avatar.component';
import { MatButtonHarness } from '@angular/material/button/testing';
import { routes } from '../../app.routes';

let loader: HarnessLoader;
let fixture: ComponentFixture<AvatarComponent>;
let avatarMenu: MatMenuHarness;
let avatarComponent: AvatarComponent;

describe('AvatarComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule(
			{
				imports: [
					AvatarComponent,
					HttpClientTestingModule
				],
				providers: [
					provideRouter(routes),
					provideAnimationsAsync(),
				]
			})
			.compileComponents();

		fixture = TestBed.createComponent(AvatarComponent);
		loader = TestbedHarnessEnvironment.loader(fixture);
		avatarMenu = await loader.getHarness(MatMenuHarness.with({ selector: MatMenuHarness.hostSelector }));
    avatarComponent = fixture.componentInstance;
    avatarComponent.user = {username: "Pedro", email: "pedro@gmail.com"};
	});

	it('should have an icon', async () => { 
		expect(await avatarMenu.getTriggerText()).toBe('account_circle');
	});
	
	it('menu should be displayed when icon is clicked, and closed when icon is clicked again', async () => { 
		await avatarMenu.open();
		expect(await avatarMenu.isOpen()).toBeTrue();
		await avatarMenu.close();
		expect(await avatarMenu.isOpen()).toBeFalse();
	});

	it('menu should have item for logging out', async () => {
    await avatarMenu.open();
    let menuItems: MatMenuItemHarness[] = await avatarMenu.getItems();
    expect(menuItems[menuItems.length-1]).toBeInstanceOf(MatMenuItemHarness);
    expect(await menuItems[menuItems.length-1].getText()).toBe('Log out');
  });

	it('menu should display user information', async () => { 
    await avatarMenu.open();
    let menuItems: MatMenuItemHarness[] = await avatarMenu.getItems();
    expect(await menuItems[0].getText()).toBe(`person${avatarComponent.user!.username}`);
    expect(await menuItems[1].getText()).toBe(`mail${avatarComponent.user!.email}`);
    expect(await menuItems[menuItems.length-1].getText()).toBe('Log out');
  });

	it('should display a spinner when loading user information', async () => { 
		avatarComponent.user = null;
    await avatarMenu.open();
    let menuItems: MatMenuItemHarness[] = await avatarMenu.getItems();
    let spinner = await menuItems[0].getHarness(MatProgressSpinnerHarness);
    expect(spinner).toBeTruthy();
  }); 
});