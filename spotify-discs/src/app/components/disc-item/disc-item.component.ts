import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, input, InputSignal } from '@angular/core';

import { basicAlbumInfo } from '../../types/basic-album-info.type';

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

  public disc: InputSignal<basicAlbumInfo> = input<basicAlbumInfo>({} as basicAlbumInfo);
}