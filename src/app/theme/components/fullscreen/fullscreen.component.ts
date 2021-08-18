/* eslint-disable class-methods-use-this */
import { Component, ViewEncapsulation, ViewChild, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-fullscreen',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './fullscreen.component.html',
})
export class FullScreenComponent {
  toggle = false;

  @ViewChild('expand') private expand: ElementRef;

  @ViewChild('compress') private compress: ElementRef;

  requestFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else {
      // eslint-disable-next-line no-console
      console.log('Fullscreen API is not supported.');
    }
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else {
      // eslint-disable-next-line no-console
      console.log('Fullscreen API is not supported.');
    }
  }

  @HostListener('click') getFullscreen() {
    if (this.expand) {
      this.requestFullscreen(document.documentElement);
    }
    if (this.compress) {
      this.exitFullscreen();
    }
  }

  @HostListener('window:resize') onFullScreenChange() {
    const fullscreenElement =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;
    if (fullscreenElement != null) {
      this.toggle = true;
    } else {
      this.toggle = false;
    }
  }
}
