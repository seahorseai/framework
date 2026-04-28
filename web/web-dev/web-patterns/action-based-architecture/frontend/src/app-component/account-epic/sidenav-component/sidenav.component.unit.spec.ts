import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SidenavComponent } from './sidenav.component';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSidenavHarness } from '@angular/material/sidenav/testing';
describe('SidenavComponent', () => {
	let loader: HarnessLoader;
  let sidenavComponent: SidenavComponent;
	let sidebar: MatSidenavHarness;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
			providers: [
					provideRouter(routes),
			]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(SidenavComponent);
    sidenavComponent = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
		sidebar = await loader.getHarness(MatSidenavHarness);
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(sidenavComponent).toBeTruthy();
  });

	it('the bounded context sidebar should occupy the left side of the screen and the full vertical viewport.', async() => {
		const element = await sidebar.host();
		expect(await element.getCssValue('left')).toBe('0px');
		expect(await element.getCssValue('top')).toBe('0px');
		// ! The innerHeight isn't currently correct for some reason.
 		expect(await element.getCssValue('height')).toBe(`${window.innerHeight}px`); // ! The innerHeight isn't currently correct for some reason.
	});
});
