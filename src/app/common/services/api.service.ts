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
      .then((response) => {
        console.log({ response });
        return response.data.layers.map((layer: LayerData, index: number) => {
          const geeLayer = this.getGEEMapLayer(layer);
          return {
            id: index,
            ...geeLayer,
          };
        });
      })
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

  //#region  Zone
  async getZoneInformation(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/information`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.zoneInformation)
      .catch((error) => console.error(error));
  }

  // #region PPNA
  async getZoneAnnualPPNAMean(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/ppna/annual/mean`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.ppnaInformation)
      .catch((error) => console.error(error));
  }

  async getZoneAnnualPPNA(zoneInformation: ZoneInformation, year: number) {
    console.log({ year });
    const url = `${this.serverUrl}/gee/zone/ppna/annual/${year}`;
    console.log('url', url);
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.ppnaInformation)
      .catch((error) => console.error(error));
  }

  async getZoneHistoricalPPNA(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/ppna/historical/`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.ppnaInformation)
      .catch((error) => console.error(error));
  }
  // #endregion

  // #region APAR
  async getZoneAnnualAPARMean(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/apar/annual/mean`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.aparInformation)
      .catch((error) => console.error(error));
  }

  async getZoneAnnualAPAR(zoneInformation: ZoneInformation, year: number) {
    console.log({ year });
    const url = `${this.serverUrl}/gee/zone/apar/annual/${year}`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.aparInformation)
      .catch((error) => console.error(error));
  }

  async getZoneHistoricalAPAR(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/apar/historical/`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.aparInformation)
      .catch((error) => console.error(error));
  }
  // #endregion

  // #region ET
  async getZoneAnnualETMean(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/et/annual/mean`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.etInformation)
      .catch((error) => console.error(error));
  }

  async getZoneAnnualET(zoneInformation: ZoneInformation, year: number) {
    console.log('ET', { year });
    const url = `${this.serverUrl}/gee/zone/et/annual/${year}`;
    console.log('ET url', url);
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.etInformation)
      .catch((error) => console.error(error));
  }

  async getZoneHistoricalET(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/et/historical/`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.etInformation)
      .catch((error) => console.error(error));
  }
  // #endregion ET

  // #region RH
  async getZoneAnnualRHMean(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/rh/annual/mean`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.rhInformation)
      .catch((error) => console.error(error));
  }

  async getZoneAnnualRH(zoneInformation: ZoneInformation, year: number) {
    const url = `${this.serverUrl}/gee/zone/rh/annual/${year}`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.rhInformation)
      .catch((error) => console.error(error));
  }

  async getZoneHistoricalRH(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/rh/historical/`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.rhInformation)
      .catch((error) => console.error(error));
  }
  // #endregion RH

  // #region RH/PPT
  async getZoneAnnualRHPropMean(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/rhProp/annual/mean`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.rhPropInformation)
      .catch((error) => console.error(error));
  }

  async getZoneAnnualRHProp(zoneInformation: ZoneInformation, year: number) {
    const url = `${this.serverUrl}/gee/zone/rhProp/annual/${year}`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.rhPropInformation)
      .catch((error) => console.error(error));
  }

  async getZoneHistoricalRHProp(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/rhProp/historical/`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.rhPropInformation)
      .catch((error) => console.error(error));
  }
  // #endregion RH

  //#region IOSE
  async getZoneHistoricalIOSE(zoneInformation: ZoneInformation) {
    const url = `${this.serverUrl}/gee/zone/iose/historical/`;
    return axios
      .post(url, zoneInformation)
      .then((response) => response.data.ioseInformation)
      .catch((error) => console.error(error));
  }

  // #endregion IOSE
  // #endregion Zone

  // #region Community
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

  // #region PPNA
  async getCommunityAnnualPPNAMean(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/ppna/annual/mean`;
    return axios
      .get(url)
      .then((response) => response.data.ppnaInformation)
      .catch((error) => console.error(error));
  }

  async getCommunityAnnualPPNA(communityOrder: string, year: number) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/ppna/annual/${year}`;
    return axios
      .get(url)
      .then((response) => response.data.ppnaInformation)
      .catch((error) => console.error(error));
  }

  async getCommunityHistoricalPPNA(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/ppna/historical/`;
    return axios
      .get(url)
      .then((response) => response.data.ppnaInformation)
      .catch((error) => console.error(error));
  }
  // #endregion PPNA

  // #region APAR
  async getCommunityAnnualAPARMean(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/apar/annual/mean`;
    return axios
      .get(url)
      .then((response) => response.data.aparInformation)
      .catch((error) => console.error(error));
  }

  async getCommunityAnnualAPAR(communityOrder: string, year: number) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/apar/annual/${year}`;
    return axios
      .get(url)
      .then((response) => response.data.aparInformation)
      .catch((error) => console.error(error));
  }

  async getCommunityHistoricalAPAR(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/apar/historical/`;
    return axios
      .get(url)
      .then((response) => response.data.aparInformation)
      .catch((error) => console.error(error));
  }
  // #endregion APAR

  // #region ET
  async getCommunityAnnualETMean(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/et/annual/mean`;
    return axios
      .get(url)
      .then((response) => response.data.etInformation)
      .catch((error) => console.error(error));
  }

  async getCommunityAnnualET(communityOrder: string, year: number) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/et/annual/${year}`;
    return axios
      .get(url)
      .then((response) => response.data.etInformation)
      .catch((error) => console.error(error));
  }

  async getCommunityHistoricalET(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/et/historical/`;
    return axios
      .get(url)
      .then((response) => response.data.etInformation)
      .catch((error) => console.error(error));
  }
  // #endregion ET

  // #region RH
  async getCommunityAnnualRHMean(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/rh/annual/mean`;
    return axios
      .get(url)
      .then((response) => response.data.rhInformation)
      .catch((error) => console.error(error));
  }

  async getCommunityAnnualRH(communityOrder: string, year: number) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/rh/annual/${year}`;
    return axios
      .get(url)
      .then((response) => response.data.rhInformation)
      .catch((error) => console.error(error));
  }

  async getCommunityHistoricalRH(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/rh/historical/`;
    return axios
      .get(url)
      .then((response) => response.data.rhInformation)
      .catch((error) => console.error(error));
  }
  // #endregion RH

  // #region RHProp
  async getCommunityAnnualRHPropMean(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/rhProp/annual/mean`;
    return axios
      .get(url)
      .then((response) => response.data.rhPropInformation)
      .catch((error) => console.error(error));
  }

  async getCommunityAnnualRHProp(communityOrder: string, year: number) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/rhProp/annual/${year}`;
    return axios
      .get(url)
      .then((response) => response.data.rhPropInformation)
      .catch((error) => console.error(error));
  }

  async getCommunityHistoricalRHProp(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/rhProp/historical/`;
    return axios
      .get(url)
      .then((response) => response.data.rhPropInformation)
      .catch((error) => console.error(error));
  }
  // #endregion RHProp

  //#region IOSE
  async getCommunityHistoricalIOSE(communityOrder: string) {
    const url = `${this.serverUrl}/gee/community/${communityOrder}/iose/historical/`;
    return axios
      .get(url)
      .then((response) => response.data.ioseInformation)
      .catch((error) => console.error(error));
  }

  // #endregion IOSE

  // #endregion Community

  async getPoliceSectionals() {
    const url = `${this.serverUrl}/gee/police-sectionals`;
    return axios
      .get(url)
      .then((response) => response.data.policeSectionals)
      .catch((error) => console.error(error));
  }

  async getBasins(grade: 'I' | 'II' | 'III' | 'IV' | 'V') {
    const url = `${this.serverUrl}/gee/basins/${grade}`;
    return axios
      .get(url)
      .then((response) => response.data.basins)
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
