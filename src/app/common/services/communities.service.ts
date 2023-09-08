import { Injectable } from '@angular/core';

import { ApiService } from './api.service';
import { CommunityDB } from '@app/communities.db';
import { CommunityModel } from '@app/features/communities/models/community.model';
import { SpecieModel } from '@app/features/communities/models/specie.model';
import { SubCommunityModel } from '@app/features/communities/models/subcommunity.model';

@Injectable({
  providedIn: 'root',
})
export class CommunitiesService {
  private db: CommunityDB;

  constructor(private apiService: ApiService) {
    this.db = new CommunityDB('communities');
  }

  async getCommunityInformation(id: string) {
    const storeZone = await this.db.storeCommunities.where('id').equals(id).first();
    if (storeZone && storeZone.generalInformation) {
      return storeZone.generalInformation;
    }

    const promises = [
      this.apiService.getCommunity(id),
      this.apiService.getCommunitySpecies(id),
      this.apiService.getSubCommunities(id),
    ];

    return Promise.allSettled(promises).then((results) => {
      if (results[0].status === 'rejected' || results[1].status === 'rejected' || results[2].status === 'rejected') {
        throw new Error('Unable to get community information');
      }

      const community = {
        id,
        order: (results[0].value as CommunityModel).order,
        generalInformation: {
          ...(results[0].value as CommunityModel),
          species: results[1].value as SpecieModel[],
          subCommunities: results[2].value as SubCommunityModel[],
        },
      };

      this.addStorageCommunity(community);
      return community.generalInformation;
    });
  }

  // #region PPNA
  async getPPNAMean(id) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    if (storeCommunity.ppnaMeanInformation) {
      return storeCommunity.ppnaMeanInformation;
    }

    return this.apiService.getCommunityAnnualPPNAMean(storeCommunity.order).then((data) => {
      // Update storage
      this.db.storeCommunities.where('id').equals(id).modify({ ppnaMeanInformation: data });
      return data;
    });
  }

  // TODO: Define year range (2001 - Current Year)
  async getAnnualPPNA(id, year) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    const yearPPNAInformation = storeCommunity.ppnaAnnualInformation?.find((info) => {
      return info && info.year === year;
    });

    if (yearPPNAInformation) {
      // Return stored information
      return yearPPNAInformation;
    }

    return this.apiService.getCommunityAnnualPPNA(storeCommunity.order, year).then((data) => {
      if (!data) {
        // TODO: CHECK THIS ERROR (store [undefined] in indexDB ). Maybe implements retries
        return [];
      }
      const ppnaInfo = storeCommunity.ppnaAnnualInformation ? storeCommunity.ppnaAnnualInformation : [];
      ppnaInfo.push(data);
      this.db.storeCommunities.where('id').equals(id).modify({ ppnaAnnualInformation: ppnaInfo });
      return data;
    });
  }

  async getHistoricalPPNA(id: string) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    if (storeCommunity.historicalPPNAInformation) {
      return storeCommunity.historicalPPNAInformation;
    }

    return this.apiService.getCommunityHistoricalPPNA(storeCommunity.order).then((data) => {
      // Update storage
      this.db.storeCommunities.where('id').equals(id).modify({ historicalPPNAInformation: data });
      return data;
    });
  }
  // #endregion PPNA

  // #region APAR
  async getAPARMean(id) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    if (storeCommunity.aparMeanInformation) {
      return storeCommunity.aparMeanInformation;
    }

    return this.apiService.getCommunityAnnualAPARMean(storeCommunity.order).then((data) => {
      // Update storage
      this.db.storeCommunities.where('id').equals(id).modify({ aparMeanInformation: data });
      return data;
    });
  }

  // TODO: Define year range (2001 - Current Year)
  async getAnnualAPAR(id, year) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    const yearAPARInformation = storeCommunity.aparAnnualInformation?.find((info) => {
      return info && info.year === year;
    });

    if (yearAPARInformation) {
      // Return stored information
      return yearAPARInformation;
    }

    return this.apiService.getCommunityAnnualAPAR(storeCommunity.order, year).then((data) => {
      if (!data) {
        // TODO: CHECK THIS ERROR (store [undefined] in indexDB ). Maybe implements retries
        return [];
      }
      const aparInfo = storeCommunity.aparAnnualInformation ? storeCommunity.aparAnnualInformation : [];
      aparInfo.push(data);
      this.db.storeCommunities.where('id').equals(id).modify({ aparAnnualInformation: aparInfo });
      return data;
    });
  }

  async getHistoricalAPAR(id: string) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    if (storeCommunity.historicalAPARInformation) {
      return storeCommunity.historicalAPARInformation;
    }

    return this.apiService.getCommunityHistoricalAPAR(storeCommunity.order).then((data) => {
      // Update storage
      this.db.storeCommunities.where('id').equals(id).modify({ historicalAPARInformation: data });
      return data;
    });
  }
  // #endregion APAR

  // #region ET
  async getETMean(id) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    if (storeCommunity.etMeanInformation) {
      return storeCommunity.etMeanInformation;
    }

    return this.apiService.getCommunityAnnualETMean(storeCommunity.order).then((data) => {
      // Update storage
      this.db.storeCommunities.where('id').equals(id).modify({ etMeanInformation: data });
      return data;
    });
  }

  // TODO: Define year range (2001 - Current Year)
  async getAnnualET(id, year) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    const yearETInformation = storeCommunity.etAnnualInformation?.find((info) => {
      return info && info.year === year;
    });

    if (yearETInformation) {
      // Return stored information
      return yearETInformation;
    }

    return this.apiService.getCommunityAnnualET(storeCommunity.order, year).then((data) => {
      if (!data) {
        // TODO: CHECK THIS ERROR (store [undefined] in indexDB ). Maybe implements retries
        return [];
      }
      const etInfo = storeCommunity.etAnnualInformation ? storeCommunity.etAnnualInformation : [];
      etInfo.push(data);
      this.db.storeCommunities.where('id').equals(id).modify({ etAnnualInformation: etInfo });
      return data;
    });
  }

  async getHistoricalET(id: string) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    if (storeCommunity.historicalETInformation) {
      return storeCommunity.historicalETInformation;
    }

    return this.apiService.getCommunityHistoricalET(storeCommunity.order).then((data) => {
      // Update storage
      this.db.storeCommunities.where('id').equals(id).modify({ historicalETInformation: data });
      return data;
    });
  }
  // #endregion ET

  // #region RH
  async getRHMean(id) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    if (storeCommunity.rhMeanInformation) {
      return storeCommunity.rhMeanInformation;
    }

    return this.apiService.getCommunityAnnualRHMean(storeCommunity.order).then((data) => {
      // Update storage
      this.db.storeCommunities.where('id').equals(id).modify({ rhMeanInformation: data });
      return data;
    });
  }

  // TODO: Define year range (2001 - Current Year)
  async getAnnualRH(id, year) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    const yearRHInformation = storeCommunity.rhAnnualInformation?.find((info) => {
      return info && info.year === year;
    });

    if (yearRHInformation) {
      // Return stored information
      return yearRHInformation;
    }

    return this.apiService.getCommunityAnnualRH(storeCommunity.order, year).then((data) => {
      if (!data) {
        // TODO: CHECK THIS ERROR (store [undefined] in indexDB ). Maybe implements retries
        return [];
      }
      const rhInfo = storeCommunity.rhAnnualInformation ? storeCommunity.rhAnnualInformation : [];
      rhInfo.push(data);
      this.db.storeCommunities.where('id').equals(id).modify({ rhAnnualInformation: rhInfo });
      return data;
    });
  }

  async getHistoricalRH(id: string) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    if (storeCommunity.historicalRHInformation) {
      return storeCommunity.historicalRHInformation;
    }

    return this.apiService.getCommunityHistoricalRH(storeCommunity.order).then((data) => {
      // Update storage
      this.db.storeCommunities.where('id').equals(id).modify({ historicalRHInformation: data });
      return data;
    });
  }
  // #endregion RH

  // #region RHProp
  async getRHPropMean(id) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    if (storeCommunity.rhPropMeanInformation) {
      return storeCommunity.rhPropMeanInformation;
    }

    return this.apiService.getCommunityAnnualRHPropMean(storeCommunity.order).then((data) => {
      // Update storage
      this.db.storeCommunities.where('id').equals(id).modify({ rhPropMeanInformation: data });
      return data;
    });
  }

  // TODO: Define year range (2001 - Current Year)
  async getAnnualRHProp(id, year) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    const yearRHPropInformation = storeCommunity.rhPropAnnualInformation?.find((info) => {
      return info && info.year === year;
    });

    if (yearRHPropInformation) {
      // Return stored information
      return yearRHPropInformation;
    }

    return this.apiService.getCommunityAnnualRHProp(storeCommunity.order, year).then((data) => {
      if (!data) {
        // TODO: CHECK THIS ERROR (store [undefined] in indexDB ). Maybe implements retries
        return [];
      }
      const rhPropInfo = storeCommunity.rhPropAnnualInformation ? storeCommunity.rhPropAnnualInformation : [];
      rhPropInfo.push(data);
      this.db.storeCommunities.where('id').equals(id).modify({ rhPropAnnualInformation: rhPropInfo });
      return data;
    });
  }

  async getHistoricalRHProp(id: string) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    if (storeCommunity.historicalRHPropInformation) {
      return storeCommunity.historicalRHPropInformation;
    }

    return this.apiService.getCommunityHistoricalRHProp(storeCommunity.order).then((data) => {
      // Update storage
      this.db.storeCommunities.where('id').equals(id).modify({ historicalRHPropInformation: data });
      return data;
    });
  }
  // #endregion RHProp

  // #region IOSE
  async getHistoricalIOSE(id: string) {
    const storeCommunity = await this.db.storeCommunities.where('id').equals(id).first();
    if (!storeCommunity) {
      throw new Error('Community not found');
    }

    if (storeCommunity.ioseInformation) {
      return storeCommunity.ioseInformation;
    }

    return this.apiService.getCommunityHistoricalIOSE(storeCommunity.order).then((data) => {
      // Update storage
      this.db.storeCommunities.where('id').equals(id).modify({ ioseInformation: data });
      return data;
    });
  }
  // #endregion IOSE

  // #region Private Methods
  // #region STORAGE
  private addStorageCommunity(community) {
    const storageCommunity = { ...this.createEmptyStorageCommunity(), ...community };
    this.db.addCommunity(storageCommunity);
  }

  private createEmptyStorageCommunity() {
    return {
      id: '',
      order: '',
      generalInformation: null,
      ppnaAnnualInformation: [],
      ppnaMeanInformation: null,
      historicalPPNAInformation: null,
      aparAnnualInformation: [],
      aparMeanInformation: null,
      historicalAPARInformation: null,
      etAnnualInformation: [],
      etMeanInformation: null,
      historicalETInformation: null,
      rhAnnualInformation: [],
      rhMeanInformation: null,
      historicalRHInformation: null,
      rhPropAnnualInformation: [],
      rhPropMeanInformation: null,
      historicalRHPropInformation: null,
      ioseInformation: null,
    };
  }

  // #endregion
}
