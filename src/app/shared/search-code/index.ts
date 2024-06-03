import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SearchCodeComponent } from './search-code.component';
import { FormsModule } from '@angular/forms'
@NgModule({
    imports: [CommonModule, MatIconModule, FormsModule],
    exports: [SearchCodeComponent],
    declarations: [SearchCodeComponent]
})

export class SearchCodeModule { }