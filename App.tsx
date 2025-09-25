
import React, { useState, useContext } from 'react';
import { Page } from './types';
import { AppContext } from './context/AppContext';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';
import ToolsPage from './pages/ToolsPage';
import MessagesPage from './pages/MessagesPage';
import CreatePostModal from './components/modals/CreatePostModal';
import EditPostModal from './components/modals/EditPostModal';
import QuestionDetailModal from './components/modals/QuestionDetailModal';
import AnalysisPage from './pages/AnalysisPage';
import EditProfileModal from './components/modals/EditProfileModal';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const { isCreateModalOpen, setCreateModalOpen, editingPost, setEditingPost, viewingQuestion, setViewingQuestion, isEditProfileModalOpen, setEditProfileModalOpen } = useContext(AppContext);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNavigate = (page: Page) => {
    setShowNotifications(false);
    setCurrentPage(page);
  };
  
  const handleShowNotifications = () => {
    setShowNotifications(true);
  }

  const renderPage = () => {
    if (showNotifications) {
      return <NotificationsPage />;
    }
    switch (currentPage) {
      case Page.Home:
        return <HomePage />;
      case Page.Explore:
        return <ExplorePage />;
      case Page.Analysis:
        return <AnalysisPage />;
      case Page.Messages:
        return <MessagesPage />;
      case Page.Tools:
        return <ToolsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="h-screen w-screen bg-white dark:bg-black text-black dark:text-white font-sans flex flex-col items-center">
      <div className="w-full max-w-md h-full flex flex-col border-x border-gray-200 dark:border-gray-800">
        <Header onShowNotifications={handleShowNotifications} />
        <main className="flex-grow overflow-y-auto pb-16">
          {renderPage()}
        </main>
        <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      </div>
      {isCreateModalOpen && <CreatePostModal onClose={() => setCreateModalOpen(false)} />}
      {editingPost && <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} />}
      {viewingQuestion && <QuestionDetailModal questionPayload={viewingQuestion} onClose={() => setViewingQuestion(null)} />}
      {isEditProfileModalOpen && <EditProfileModal onClose={() => setEditProfileModalOpen(false)} />}
    </div>
  );
};

export default App;
