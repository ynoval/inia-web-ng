import { Injectable } from '@angular/core';
import axios from 'axios';
import { AppSettings } from '@app/app.settings';
import { GEEMapLayerModel } from '../models/geeMapLayer.model';
import { CommunityModel } from '../models/community.model';
import { SpecieModel } from '../models/specie.model';
import { SubCommunityModel } from '../models/subcommunity.model';

type LayerData = {
  mapType: string;
  mapId: string;
  urlTemplate: string;
  layerLabel: string;
  layerDescription: string;
  communityInfo?: any;
};

type ZoneInformation = {
  type: google.maps.drawing.OverlayType;
  coordinates: number[]; // Array of number that represent coordinates
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  serverUrl = '';

  constructor(appSettings: AppSettings) {
    this.serverUrl = appSettings.settings.serverApiURL;
  }

  async getInformationLayers(): Promise<GEEMapLayerModel[]> {
    const url = `${this.serverUrl}/gee/maps/information`;
    return axios
      .get(url)
      .then((response) =>
        response.data.layers.map((layer: LayerData, index: number) => {
          const geeLayer = this.getGEEMapLayer(layer);
          return {
            id: index,
            ...geeLayer,
          };
        })
      )
      .catch((error) => console.error(error));
  }

  async getCommunitiesLayers(): Promise<GEEMapLayerModel[]> {
    const url = `${this.serverUrl}/gee/maps/communities`;
    return axios
      .get(url)
      .then((response) =>
        response.data.layers.map((layer: LayerData) => {
          const geeLayer = this.getGEEMapLayer(layer);
          return {
            id: layer.communityInfo.id,
            ...geeLayer,
          };
        })
      )
      .catch((error) => console.error(error));
  }

  // eslint-disable-next-line class-methods-use-this
  async getCommunity(communityId: string): Promise<CommunityModel> {
    const url = `${this.serverUrl}/communities/${communityId}`;
    return axios
      .get(url)
      .then((response) => response.data.community)
      .catch((error) => console.error(error));
  }

  // eslint-disable-next-line class-methods-use-this
  async getCommunitySpecies(communityId: string): Promise<SpecieModel[]> {
    const url = `${this.serverUrl}/communities/${communityId}/species`;
    return axios
      .get(url)
      .then((response) => response.data.species)
      .catch((error) => console.error(error));
  }

  // eslint-disable-next-line class-methods-use-this
  async getSpecie(specieId: string): Promise<CommunityModel> {
    const url = `${this.serverUrl}/species/${specieId}`;
    return axios
      .get(url)
      .then((response) => response.data.specie)
      .catch((error) => console.error(error));
  }

  // eslint-disable-next-line class-methods-use-this
  async getSpecieImages(specieId: string): Promise<string[]> {
    const url = `${this.serverUrl}/species/${specieId}/images`;
    return axios
      .get(url)
      .then((response) => response.data.imageList)
      .catch((error) => console.error(error));
  }

  async getSubCommunities(communityId: string): Promise<SubCommunityModel[]> {
    const url = `${this.serverUrl}/communities/${communityId}/subcommunities`;
    return axios
      .get(url)
      .then((response) => response.data.subcommunities)
      .catch((error) => console.error(error));
  }

  async getSubCommunityImages(communityId: string, subCommunityOrder: string): Promise<string[]> {
    const url = `${this.serverUrl}/communities/${communityId}/subcommunities/${subCommunityOrder}/images`;
    return axios
      .get(url)
      .then((response) => response.data.imageList)
      .catch((error) => console.error(error));
  }

  async getZoneInformation(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/information`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.zoneInformation)
      .catch((error) => console.error(error));
  }

  async getZoneAnnualPPNAMean(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/ppna/annual/mean`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.ppnaInformation)
      .catch((error) => console.error(error));
  }

  async getZoneAnnualPPNA(zoneInformation: ZoneInformation, year: number) {
    const url = `${this.serverUrl}/gee/zone/ppna/annual/${year}`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.ppnaInformation)
      .catch((error) => console.error(error));
  }

  async getZoneHistoricalPPNA(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/ppna/historical/`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.historicalPPNAInformation)
      .catch((error) => console.error(error));
  }

  async getCommunityPPNA(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/ppna`;
    return axios
      .get(url)
      .then((response) => response.data.communityPPNAInformation)
      .catch((error) => console.error(error));
  }

  async getCommunityAnnualPPNAMean(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/ppna/annual/mean`;
    return axios
      .get(url)
      .then((response) => response.data.communityAnnualPPNAMean)
      .catch((error) => console.error(error));
  }

  async getCommunityAnnualPPNA(communityOrder: string, year: number) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/ppna/annual/${year}`;
    return axios
      .get(url)
      .then((response) => response.data.communityAnnualPPNA)
      .catch((error) => console.error(error));
  }

  async getCommunityHistoricalPPNA(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/ppna/historical/`;
    return axios
      .get(url)
      .then((response) => response.data.communityHistoricalPPNA)
      .catch((error) => console.error(error));
  }

  // eslint-disable-next-line class-methods-use-this
  private getGEEMapLayer(layer: LayerData): Partial<GEEMapLayerModel> {
    return {
      mapId: layer.mapId,
      urlTemplate: layer.urlTemplate, // FOR COMPATIBILITY WITH REACT NATIVE MAP
      label: layer.layerLabel,
      description: layer.layerDescription,
      isVisible: false,
      isEditable: true,
      properties: layer.communityInfo,
    };
  }
}
