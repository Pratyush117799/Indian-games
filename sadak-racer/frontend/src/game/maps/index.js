import { mumbai }                          from './mumbai';
import { delhi, himalaya, rajasthan, chennai } from './maps';

export const MAPS_LIST  = [mumbai, delhi, himalaya, rajasthan, chennai];
export const MAPS_BY_ID = Object.fromEntries(MAPS_LIST.map(m => [m.id, m]));
export { mumbai, delhi, himalaya, rajasthan, chennai };
