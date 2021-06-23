import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";

@Component({
  selector: "app-community",
  templateUrl: "./community.component.html",
  styleUrls: ["./community.component.scss"],
})
export class CommunityPageComponent implements OnInit {
  public settings: Settings;
  public id: string;

  constructor(public appSettings: AppSettings, private route: ActivatedRoute) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
  }
}
