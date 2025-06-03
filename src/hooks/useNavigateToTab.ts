import { useAppStore } from '../store';

export const useNavigateToTab = () => {
  const { setActiveTab } = useAppStore();
  
  return (tab: 'tasks' | 'battle') => {
    setActiveTab(tab);
  };
};