import { mockGetTravelNoteById } from '@/mock/travelNotes';

export const getTravelNoteDetail = (id) => {
  // 这里可以加上真实请求的切换
  return mockGetTravelNoteById(id);
};
