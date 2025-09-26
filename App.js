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

const App = () => {
  const [currentPage, setCurrentPage] = useState(Page.Home);
  const { isCreateModalOpen, setCreateModalOpen, editingPost, setEditingPost, viewingQuestion, setViewingQuestion, isEditProfileModalOpen, setEditProfileModalOpen } = useContext(AppContext);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNavigate = (page) => {
    setShowNotifications(false);
    setCurrentPage(page);
  };
  
  const handleShowNotifications = () => {
    setShowNotifications(true);
  }

  const renderPage = () => {
    if (showNotifications) {
      return React.createElement(NotificationsPage, null);
    }
    switch (currentPage) {
      case Page.Home:
        return React.createElement(HomePage, null);
      case Page.Explore:
        return React.createElement(ExplorePage, null);
      case Page.Analysis:
        return React.createElement(AnalysisPage, null);
      case Page.Messages:
        return React.createElement(MessagesPage, null);
      case Page.Tools:
        return React.createElement(ToolsPage, null);
      default:
        return React.createElement(HomePage, null);
    }
  };

  return (
    React.createElement('div', { className: "h-screen w-screen bg-white dark:bg-black text-black dark:text-white font-sans flex flex-col items-center" },
      React.createElement('div', { className: "w-full max-w-md h-full flex flex-col border-x border-gray-200 dark:border-gray-800" },
        React.createElement(Header, { onShowNotifications: handleShowNotifications }),
        React.createElement('main', { className: "flex-grow overflow-y-auto pb-16" },
          renderPage()
        ),
        React.createElement(BottomNav, { currentPage: currentPage, onNavigate: handleNavigate })
      ),
      isCreateModalOpen && React.createElement(CreatePostModal, { onClose: () => setCreateModalOpen(false) }),
      editingPost && React.createElement(EditPostModal, { post: editingPost, onClose: () => setEditingPost(null) }),
      viewingQuestion && React.createElement(QuestionDetailModal, { questionPayload: viewingQuestion, onClose: () => setViewingQuestion(null) }),
      isEditProfileModalOpen && React.createElement(EditProfileModal, { onClose: () => setEditProfileModalOpen(false) })
    )
  );
};

export default App;
