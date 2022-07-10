import ThreadState from '@/types/ThreadState';

const getThreadStateIcon = (state: ThreadState) => {
  switch (state) {
    case ThreadState.Resolved: return '✅';

    case ThreadState.WontFix: return '🚫';

    default: return '❔';
  }
};

export default getThreadStateIcon;
