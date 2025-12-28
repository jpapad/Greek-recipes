// GeoJSON Types for Greek Geographic Data

export interface RegionProperties {
  region_id: string;
  name: string;
}

export interface NomosProperties {
  nomos_id: string;
  region_id: string;
  name: string;
}

export interface MunicipalityProperties {
  municipality_id: string;
  nomos_id: string;
  region_id: string;
  name: string;
}

export interface SettlementProperties {
  settlement_id: string;
  municipality_id: string;
  nomos_id: string;
  region_id: string;
  name: string;
}

export type MapLevel = 'regions' | 'nomoi' | 'municipalities' | 'settlements';

export interface LevelConfig {
  level: MapLevel;
  geojsonPath: string;
  idField: keyof RegionProperties | keyof NomosProperties | keyof MunicipalityProperties | keyof SettlementProperties;
  parentField?: keyof NomosProperties | keyof MunicipalityProperties | keyof SettlementProperties;
  nextLevel?: MapLevel;
}

export const MAP_LEVELS: Record<MapLevel, LevelConfig> = {
  regions: {
    level: 'regions',
    geojsonPath: '/data/regions_simplified_0.01deg.geojson',
    idField: 'region_id',
    nextLevel: 'nomoi',
  },
  nomoi: {
    level: 'nomoi',
    geojsonPath: '/data/nomoi_simplified_0.01deg.geojson',
    idField: 'nomos_id',
    parentField: 'region_id',
    nextLevel: 'municipalities',
  },
  municipalities: {
    level: 'municipalities',
    geojsonPath: '/data/municipalities_simplified_0.005deg.geojson',
    idField: 'municipality_id',
    parentField: 'nomos_id',
    nextLevel: 'settlements',
  },
  settlements: {
    level: 'settlements',
    geojsonPath: '/data/settlements.geojson',
    idField: 'settlement_id',
    parentField: 'municipality_id',
  },
};
