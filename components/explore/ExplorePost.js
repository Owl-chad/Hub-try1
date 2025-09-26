import React, { useContext, useState, useEffect, useRef } from 'react';
import { PostStatus } from '../../types';
import { AppContext } from '../../context/AppContext';
import { generateSeniorAdvisorSuggestion, createDiscussionChat } from '../../services/geminiService';
import Icon from '../ui/Icon';

const getStatusPill = (status) => {
    const statusStyles = {
        [PostStatus.InDiscussion]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        [PostStatus.Confirmed]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        [PostStatus.Rejected]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        [PostStatus.Reconsiderable]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return (
        React.createElement('span', { className: `px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}` },
            status
        )
    );
};


const ExplorePost = ({ post }) => {
  const { currentUser, addComment, updatePostStatus, addOrUpdateAnalysis } = useContext(AppContext);
  const [seniorSuggestion, setSeniorSuggestion] = useState('');
  const [discussionHistory, setDiscussionHistory] = useState([]);
  const [discussionInput, setDiscussionInput] = useState('');
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [isLoadingDiscussion, setIsLoadingDiscussion] = useState(false);
  const [chat, setChat] = useState(null);
  const chatEndRef = useRef(null);
  const [analysisText, setAnalysisText] = useState(post.analysis?.[currentUser.role] || '');
  const [showAnalysisConfirmation, setShowAnalysisConfirmation] = useState(false);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [discussionHistory]);

  const handleGenerateSuggestion = async () => {
    setIsLoadingSuggestion(true);
    const suggestion = await generateSeniorAdvisorSuggestion(post, currentUser);
    setSeniorSuggestion(suggestion);
    setIsLoadingSuggestion(false);
    
    if (suggestion && !suggestion.includes("失敗")) {
      const chatInstance = createDiscussionChat(suggestion);
      setChat(chatInstance);
      if (chatInstance) {
          const initialHistory = (await chatInstance.getHistory()).map(item => ({
              role: item.role,
              text: item.parts.map(p => p.text).join('')
          }));
          setDiscussionHistory(initialHistory);
      }
    }
  };

  const handleStatusChange = (e) => {
    updatePostStatus(post.id, e.target.value);
  };

  const handleDiscussionSubmit = async () => {
    if (!discussionInput.trim() || !chat || isLoadingDiscussion) return;

    const userMessage = { role: 'user', text: discussionInput };
    setDiscussionHistory(prev => [...prev, userMessage]);
    const currentInput = discussionInput;
    setDiscussionInput('');
    setIsLoadingDiscussion(true);

    try {
      const response = await chat.sendMessage({ message: currentInput });
      const modelMessage = { role: 'model', text: response.text };
      setDiscussionHistory(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error sending message to discussion AI:", error);
      const errorMessage = { role: 'model', text: '抱歉，我現在無法回應。請稍後再試。' };
      setDiscussionHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoadingDiscussion(false);
    }
  };

  const handleAddSuggestionAsComment = () => {
    if (seniorSuggestion) {
      addComment(post.id, `採納建議：${seniorSuggestion}`);
    }
  };
  
  const handleAnalysisSubmit = () => {
    if (analysisText.trim()) {
      addOrUpdateAnalysis(post.id, currentUser.role, analysisText);
      setShowAnalysisConfirmation(true);
      setTimeout(() => setShowAnalysisConfirmation(false), 2000);
    }
  };

  if (!post.tags.includes('project')) return null;

  return (
    React.createElement('div', { className: "p-4 border-b border-gray-200 dark:border-gray-800" },
      React.createElement('div', { className: "flex justify-between items-start mb-4" },
          React.createElement('div', null,
              React.createElement('h3', { className: "font-bold" }, post.title),
              React.createElement('p', { className: "text-sm text-gray-500" }, post.content)
          ),
          React.createElement('div', { className: "flex flex-col items-end space-y-2 flex-shrink-0 ml-4 w-32" },
              getStatusPill(post.status),
              React.createElement('select', 
                  { 
                      value: post.status, 
                      onChange: handleStatusChange, 
                      className: "w-full text-xs p-1 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  },
                  Object.values(PostStatus).map(s => React.createElement('option', { key: s, value: s }, s))
              )
          )
      ),
      
      React.createElement('div', { className: "space-y-4" },
        isLoadingSuggestion ? (
          React.createElement('div', { className: "text-sm text-gray-500 text-center p-4 bg-gray-100 dark:bg-gray-900 rounded-lg" }, "正在生成建議...")
        ) : seniorSuggestion === '' ? (
          React.createElement('button', 
              { 
                  onClick: handleGenerateSuggestion, 
                  className: "w-full text-center py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
              },
              React.createElement(Icon, { name: "lightbulb", className: "w-5 h-5" }),
              React.createElement('span', null, "生成 AI 建議")
          )
        ) : (
          React.createElement(React.Fragment, null,
            React.createElement('div', { className: "bg-gray-100 dark:bg-gray-900 p-4 rounded-lg" },
              React.createElement('h4', { className: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" },
                `A. 高級${currentUser.role}給你的建議`
              ),
              React.createElement('div', { className: "relative" },
                React.createElement('p', { className: "text-sm whitespace-pre-wrap pr-8" }, seniorSuggestion),
                React.createElement('button',
                  {
                    onClick: handleAddSuggestionAsComment,
                    title: "將此建議新增為留言",
                    className: "absolute top-0 right-0 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors",
                    "aria-label": "Add suggestion as comment"
                  },
                  React.createElement(Icon, { name: "plus", className: "w-4 h-4" })
                )
              )
            ),

            chat && (
              React.createElement('div', { className: "bg-gray-100 dark:bg-gray-900 p-4 rounded-lg" },
                React.createElement('h4', { className: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" },
                  "B. 高級問題討論師"
                ),
                React.createElement('div', { className: "h-48 overflow-y-auto pr-2 custom-scrollbar space-y-3 text-sm mb-2" },
                  discussionHistory.map((msg, index) => (
                    React.createElement('div', { key: index, className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}` },
                      React.createElement('div', { className: `max-w-xs px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'}` },
                        msg.text
                      )
                    )
                  )),
                  isLoadingDiscussion && (
                    React.createElement('div', { className: "flex justify-start" },
                      React.createElement('div', { className: "bg-white dark:bg-gray-700 px-3 py-2 rounded-lg" },
                        React.createElement('div', { className: "flex items-center space-x-1" },
                          React.createElement('span', { className: "h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" }),
                          React.createElement('span', { className: "h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" }),
                          React.createElement('span', { className: "h-2 w-2 bg-gray-400 rounded-full animate-bounce" })
                        )
                      )
                    )
                  ),
                  React.createElement('div', { ref: chatEndRef })
                ),
                React.createElement('div', { className: "flex space-x-2" },
                  React.createElement('textarea',
                    {
                      value: discussionInput,
                      onChange: (e) => setDiscussionInput(e.target.value),
                      onKeyPress: (e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleDiscussionSubmit();
                        }
                      },
                      placeholder: "對建議提出疑問或想法...",
                      className: "w-full p-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none",
                      rows: 2,
                      disabled: isLoadingDiscussion
                    }
                  ),
                  React.createElement('button',
                    {
                      onClick: handleDiscussionSubmit,
                      className: "bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-md flex items-center justify-center disabled:bg-blue-300",
                      disabled: !discussionInput.trim() || isLoadingDiscussion,
                      "aria-label": "Send message to discussion facilitator"
                    },
                    React.createElement(Icon, { name: "send", className: "w-5 h-5" })
                  )
                )
              )
            )
          )
        ),

        React.createElement('div', { className: "bg-gray-100 dark:bg-gray-900 p-4 rounded-lg" },
          React.createElement('h4', { className: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" },
            `C. 我的專業分析 (${currentUser.role})`
          ),
          React.createElement('textarea',
            {
              value: analysisText,
              onChange: (e) => setAnalysisText(e.target.value),
              placeholder: `以 ${currentUser.role} 的角度，寫下你的專業分析...`,
              className: "w-full p-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none",
              rows: 4
            }
          ),
          React.createElement('div', { className: "flex justify-end items-center mt-2" },
            showAnalysisConfirmation && React.createElement('span', { className: "text-sm text-green-500 mr-2" }, "分析已提交！"),
            React.createElement('button',
              {
                onClick: handleAnalysisSubmit,
                className: "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:bg-green-300",
                disabled: !analysisText.trim()
              },
              "提交分析"
            )
          )
        )
      )
    )
  );
};

export default ExplorePost;
