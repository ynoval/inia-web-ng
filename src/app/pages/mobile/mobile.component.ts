import { Component, OnInit } from "@angular/core";
import { AppSettings } from "../../app.settings";
import { Settings } from "../../app.settings.model";

@Component({
  selector: "app-mobile",
  templateUrl: "./mobile.component.html",
  styleUrls: ["./mobile.component.scss"],
})
export class MobileComponent implements OnInit {
  public settings: Settings;

  constructor(public appSettings: AppSettings) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {}
}
