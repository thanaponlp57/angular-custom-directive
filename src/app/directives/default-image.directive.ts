import { Directive, Input, HostBinding, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[defaultImage]',
})
export class DefaultImageDirective implements AfterViewInit {
  @HostBinding('src')
  @Input() src!: string;

  @Input() defaultImage!: string;

  async ngAfterViewInit(): Promise<void> {
    const canDisplay = await this.loadImage(this.src);

    if (!canDisplay) {
      this.setSrc(this.defaultImage);
    }
  }

  private loadImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = url;
    });
  }

  private setSrc(src: string): void {
    this.src = src;
  }
}
