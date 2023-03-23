import { Component, Input, OnInit } from '@angular/core';
import { SubCommunityModel } from '@app/common/models/subcommunity.model';
import { ApiService } from '@app/common/services/api.service';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-subcommunity',
  templateUrl: './subcommunity.component.html',
  styleUrls: ['./subcommunity.component.scss'],
})
export class SubCommunityComponent implements OnInit {
  @Input() communityId: string;

  @Input() subcommunity: SubCommunityModel;

  imageUrls$: Observable<string[]>;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.imageUrls$ = from(this.apiService.getSubCommunityImages(this.communityId, this.subcommunity.order));
  }
}
