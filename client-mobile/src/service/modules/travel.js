import { mockGetTravelNotes } from '../../mock/travelNotes.js';  // 使用相对路径并明确指定扩展名

export const getTravelNotes = (params) => {
  return mockGetTravelNotes(params);
};