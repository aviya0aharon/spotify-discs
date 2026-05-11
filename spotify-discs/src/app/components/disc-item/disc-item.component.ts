import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, input, InputSignal } from '@angular/core';

import { BasicAlbumInfo } from '../../types/basic-album-info.type';

@Component({
  selector: 'app-disc-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './disc-item.component.html',
  styleUrl: './disc-item.component.scss'
})
export class DiscItemComponent {

  public disc: InputSignal<BasicAlbumInfo> = input.required<BasicAlbumInfo>();
}