import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DIRECTIVE_DOCS } from './data-access/directive-docs.data';
import { TopBar } from './components/top-bar/top-bar';
import { DirectiveHeader } from './components/directive-header/directive-header';
import { SectionLabel } from './components/section-label/section-label';
import { PreviewCard } from './components/preview-card/preview-card';
import { CodeBlock } from './components/code-block/code-block';
import { NotesBlock } from './components/notes-block/notes-block';
import { DirectivePager } from './components/directive-pager/directive-pager';
import { ThaiCitizenIdDemo } from './demos/thai-citizen-id-demo/thai-citizen-id-demo';
import { ThaiPhoneDemo } from './demos/thai-phone-demo/thai-phone-demo';
import { ThaiCurrencyDemo } from './demos/thai-currency-demo/thai-currency-demo';
import { DebounceClickDemo } from './demos/debounce-click-demo/debounce-click-demo';
import { HighlightSearchDemo } from './demos/highlight-search-demo/highlight-search-demo';

@Component({
  selector: 'app-directive-docs-page',
  imports: [
    TopBar,
    DirectiveHeader,
    SectionLabel,
    PreviewCard,
    CodeBlock,
    NotesBlock,
    DirectivePager,
    ThaiCitizenIdDemo,
    ThaiPhoneDemo,
    ThaiCurrencyDemo,
    DebounceClickDemo,
    HighlightSearchDemo,
  ],
  templateUrl: './directive-docs-page.html',
  styleUrl: './directive-docs-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectiveDocsPage {
  protected readonly docs = DIRECTIVE_DOCS;
  protected readonly total = DIRECTIVE_DOCS.length;
  protected readonly activeIndex = signal(0);
  protected readonly doc = computed(() => this.docs[this.activeIndex()]);
  protected readonly prevLabel = computed(() => this.docs[this.activeIndex() - 1]?.name ?? null);
  protected readonly nextLabel = computed(() => this.docs[this.activeIndex() + 1]?.name ?? null);

  protected goTo(index: number): void {
    const firstIndex = 0;
    const lastIndex = this.total - 1;
    const safeIndex = Math.min(Math.max(index, firstIndex), lastIndex);
    this.activeIndex.set(safeIndex);
  }
}
