import { Directive, EventEmitter, HostListener, Input, Output, signal } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Directive({
  selector: '[appSwipePagination]',
  providers: [
    MatProgressSpinnerModule
  ],
})
export class SwipePaginationDirective {
  @Input({
    required: false
  }) loading = false;
  @Output() next = new EventEmitter()
  @Input({
    required: false
  }) track: "window" | "element" = "element";
  @Input({
    required: false
  }) threshold = 100;
  private isNearBottom = signal(false);

  @HostListener("scroll", ["$event"])
  onScrollBlock(e: Event) {
    if (this.track === "element") this.handleScroll(e)
  }


  @HostListener("window:scroll", ["$event"])
  onScrollWindow(e: Event) {
    if (this.track === "window") this.handleScroll(e)
  }

  handleScroll(e: Event) {
    let scrollTop: number;
    let scrollHeight: number;
    let clientHeight: number;

    if (this.track === 'element' && e?.target) {
      const target = e.target as HTMLElement;
      scrollTop = target.scrollTop;
      scrollHeight = target.scrollHeight;
      clientHeight = target.clientHeight;
    } else {
      // window
      scrollTop = window.scrollY || document.documentElement.scrollTop;
      scrollHeight = document.documentElement.scrollHeight;
      clientHeight = window.innerHeight;
    }

    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    if (distanceToBottom < this.threshold && !this.isNearBottom() && !this.loading) {
      this.isNearBottom.set(true);
      this.next.emit();
    }

    if (distanceToBottom > this.threshold * 2) {
      this.isNearBottom.set(false);
    }
  }
}
