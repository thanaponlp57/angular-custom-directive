import { Directive, Input, HostBinding, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appDefaultImage]',
})
export class DefaultImageDirective implements AfterViewInit {
  @HostBinding('src')
  @Input()
  src!: string;

  @Input()
  appDefaultImage!: string;

  async ngAfterViewInit(): Promise<void> {
    const canDisplay =  await this.loadImage(this.src);

    if (!canDisplay) {
      this.src = this.appDefaultImage;
    }
  }

  async loadImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = url;
    });
  }
}