import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";

@Component({
  selector: "app-zone",
  templateUrl: "./zone.component.html",
  styleUrls: ["./zone.component.scss"],
})
export class ZonePageComponent implements OnInit {
  public settings: Settings;

  constructor(public appSettings: AppSettings, private route: ActivatedRoute) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
  }
}
