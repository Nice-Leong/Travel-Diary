// import { mockData } from '@/mock/travelNotes';

export const addTravelNote = (note) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 生成新id
      const notes = JSON.parse(localStorage.getItem('mockTravelNotes') || '[]');
      const newNote = {
        ...note,
        id: Date.now(),
        author: {
          nickname: localStorage.getItem('username') || '匿名',
          avatar: '', // 可补充
        }
      };
      notes.unshift(newNote);
      localStorage.setItem('mockTravelNotes', JSON.stringify(notes));
      resolve({ code: 200, message: 'success', data: newNote });
    }, 300);
  });
};