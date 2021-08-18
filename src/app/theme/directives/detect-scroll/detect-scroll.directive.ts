import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

export type ScrollEvent = {
  originalEvent: Event;
  isWindowEvent: boolean;
  scrollTop: number;
};

@Directive({
  selector: '[appDetectScroll]',
})
export class DetectScrollDirective {
  @Output() scrollEvent = new EventEmitter<ScrollEvent>();

  @HostListener('scroll', ['$event']) elementScrolled(event) {
    const { scrollTop } = event.target;
    const emitValue: ScrollEvent = {
      originalEvent: event,
      isWindowEvent: false,
      scrollTop,
    };
    this.scrollEvent.emit(emitValue);
  }

  @HostListener('window:scroll', ['$event']) windowScrolled(event) {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const emitValue: ScrollEvent = {
      originalEvent: event,
      isWindowEvent: true,
      scrollTop,
    };
    this.scrollEvent.emit(emitValue);
  }
}
