import { TestBed } from '@angular/core/testing';
import { Root } from './root';
import { NxWelcome } from './nx-welcome';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Root, NxWelcome],
    }).compileComponents();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(Root);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Welcome frontend'
    );
  });
});
