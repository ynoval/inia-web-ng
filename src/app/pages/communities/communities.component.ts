import { Component, OnInit } from "@angular/core";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";

@Component({
  selector: "app-communities",
  templateUrl: "./communities.component.html",
  styleUrls: ["./communities.component.scss"],
})
export class CommunitiesPageComponent implements OnInit {
  public settings: Settings;

  constructor(public appSettings: AppSettings) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {}
}
