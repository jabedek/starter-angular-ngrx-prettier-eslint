import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationChange, PaginationConfig, PaginationState } from '../../table.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Output() pageChange = new EventEmitter<PaginationChange>();
  @Input() set config(config: PaginationConfig) {
    this._config = config;
    this.configOnSet(config);
  }
  get config(): PaginationConfig | undefined {
    return this._config;
  }
  private _config: PaginationConfig | undefined;
  private configOnSet(config: PaginationConfig) {
    this.currentPagination = {
      totalItems: config.totalItems,
      page: config.page,
      pageSize: config.pageSize,
      pages: this.lastPage,
      lastPage: this.lastPage,
    };
    return;
  }

  currentPagination: PaginationState = {
    page: 0,
    pageSize: 0,
    pages: 0,
    totalItems: 0,
    lastPage: 0,
  };

  get page(): number {
    return this.currentPagination.page;
  }

  get pageSize(): number {
    return this.currentPagination.pageSize;
  }

  get totalItems(): number {
    return this.currentPagination.totalItems;
  }

  get lastPage(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get parts(): { start: number; end: number } {
    const end = this.page * this.pageSize > this.totalItems ? this.totalItems : this.page * this.pageSize;
    return {
      start: (this.page - 1) * this.pageSize,
      end,
    };
  }

  handlePageChange(direction: 'prev' | 'next' | 'first' | 'last' | number) {
    const prevPage = this.page;
    if (direction === 'prev') {
      if (this.page > 1) {
        this.currentPagination.page = this.page - 1;
      }
    } else if (direction === 'next') {
      if (this.page < this.lastPage) {
        this.currentPagination.page = this.page + 1;
      }
    } else if (direction === 'first') {
      this.currentPagination.page = 1;
    } else if (direction === 'last') {
      this.currentPagination.page = this.lastPage;
    } else {
      this.currentPagination.page = direction;
    }

    this.pageChange.emit({
      direction,
      fromPage: prevPage,
      toPage: this.currentPagination.page,
      arrayPart: this.parts,
    });
  }
}
