import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SearchCodeComponent } from './search-code/search-code.component';




@NgModule({
  declarations: [
    // SearchCodeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class SharedModule {

}
