import ThreadType from '@/types/ThreadType';

const getThreadTypeString = (type: ThreadType) => {
  switch (type) {
    case ThreadType.Support:
      return 'Support';
    case ThreadType.Feedback:
      return 'Feedback';
    case ThreadType.Bug:
      return 'Bug Report';
    default:
      return '';
  }
};

export default getThreadTypeString;
