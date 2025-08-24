import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Plus, Trash2, Edit3, ArrowUpDown, Bell, X, BellRing } from 'lucide-react';

export default function ChatGPTMockup() {
  const [message, setMessage] = useState('');
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [messages, setMessages] = useState({});
  const [editingTab, setEditingTab] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const [notifications, setNotifications] = useState([]);
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const textareaRef = useRef(null);

  // Initialize with Coca Cola account plan
  useEffect(() => {
    const cocaColaTab = {
      id: 'coca-cola',
      title: 'Coca Cola',
      content: 'Initial account plan',
      lastModified: new Date().getTime() - 1000
    };

    const cocaColaPlan = `**Account Overview**
• **Company:** The Coca-Cola Company
• **Industry:** Food & Beverage (Global CPG)
• **HQ:** Atlanta, GA
• **Employees:** ~80,000 globally
• **Tech Landscape (known/public):** Heavy AWS and Azure usage, distributed digital infrastructure for global bottlers, retail, e-commerce, and supply chain. Likely a complex mix of legacy + modern systems.

**Strategic Objectives (Coca-Cola)**
• Digital transformation of global supply chain (predictive analytics for production + distribution).
• Global marketing personalization (digital campaigns, mobile apps, loyalty).
• Sustainability reporting & ESG compliance.
• Expansion of direct-to-consumer channels (mobile ordering, e-commerce).

**Value Prop (Datadog)**
• **Unified Observability:** Single pane of glass across Coca-Cola's AWS, Azure, and on-prem workloads.
• **Cloud Cost Optimization:** Visibility into microservices sprawl, prevent over-provisioning.
• **Security Monitoring:** Real-time threat detection in distributed infrastructure.
• **Customer Experience:** Monitor performance of consumer-facing apps (loyalty programs, vending machine IoT, e-commerce).

**Key Stakeholders**
• **CIO / Global IT Leadership** – Strategic alignment, vendor selection.
• **VP Infrastructure / Cloud Ops** – Responsible for performance, uptime, observability stack.
• **CISO / Security Team** – Concerned with compliance, real-time detection.
• **Digital Marketing & E-commerce Leadership** – Care about consumer-facing application monitoring.
• **Regional IT (bottlers)** – Decentralized buyers and influencers in local markets.

**Current Situation & Challenges (Assumptions)**
• Likely fragmented observability tools (Splunk, New Relic, AppDynamics).
• Need to reduce mean time to detect (MTTD) and mean time to resolution (MTTR).
• Cloud migrations underway → complexity & blind spots.
• Compliance + security needs across geographies.

**Sales Strategy**
1. **Land** with a focused use case:
   • Application Performance Monitoring (APM) for Coca-Cola mobile apps (loyalty, ordering).
   • Infrastructure monitoring for core workloads on AWS/Azure.
2. **Expand** into:
   • Security monitoring for compliance.
   • Real-time monitoring for IoT (smart vending machines, connected coolers).
   • Log management and analytics across bottlers.
3. **Partner** with AWS/Azure co-sell teams (since Coca-Cola has large enterprise agreements).

**Success Metrics**
• Reduction in MTTR by X%.
• Consolidation of X legacy monitoring tools → cost savings.
• Improved uptime and performance of consumer-facing apps.
• Security incidents detected faster with Datadog Security.`;

    setTabs([cocaColaTab]);
    setMessages({
      'coca-cola': [
        {
          type: 'user',
          content: 'Coca Cola',
          timestamp: new Date().toLocaleTimeString()
        },
        {
          type: 'ai',
          content: cocaColaPlan,
          timestamp: new Date().toLocaleTimeString()
        }
      ]
    });
    setActiveTab('coca-cola');
  }, []);

  const getDummyResponse = (userMessage) => {
    return "Here's your account plan";
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;

    const newTabId = Date.now();
    const tabTitle = message.length > 30 ? message.substring(0, 30) + '...' : message;
    
    const newTab = {
      id: newTabId,
      title: tabTitle,
      content: message,
      lastModified: new Date().getTime()
    };

    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };

    setTabs(prev => [...prev, newTab]);
    setMessages(prev => ({
      ...prev,
      [newTabId]: [userMessage]
    }));
    setActiveTab(newTabId);
    
    const currentMessage = message;
    setMessage('');

    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        content: getDummyResponse(currentMessage),
        timestamp: new Date().toLocaleTimeString()
      };

      setTabs(prev => prev.map(tab => 
        tab.id === newTabId 
          ? { ...tab, lastModified: new Date().getTime() }
          : tab
      ));

      setMessages(prev => ({
        ...prev,
        [newTabId]: [...(prev[newTabId] || []), aiResponse]
      }));
      
      if (tabs.length === 1) {
        setTimeout(() => {
          addNotificationToQueue("Coca Cola is hiring for Software Reliability Engineers", "opportunity");
        }, 2000);
      }
    }, 1000);
  };

  const createNewChat = () => {
    setActiveTab(null);
    setMessage('');
  };

  const deleteTab = (tabId, e) => {
    e.stopPropagation();
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[tabId];
      return newMessages;
    });
    if (activeTab === tabId) {
      setActiveTab(null);
    }
  };

  const startRenaming = (tabId, currentTitle, e) => {
    e.stopPropagation();
    setEditingTab(tabId);
    setEditingTitle(currentTitle);
  };

  const saveTabTitle = (tabId) => {
    if (editingTitle.trim()) {
      setTabs(prev => prev.map(tab => 
        tab.id === tabId 
          ? { ...tab, title: editingTitle.trim(), lastModified: new Date().getTime() }
          : tab
      ));
    }
    setEditingTab(null);
    setEditingTitle('');
  };

  const cancelRenaming = () => {
    setEditingTab(null);
    setEditingTitle('');
  };

  const handleRenameKeyDown = (e, tabId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTabTitle(tabId);
    } else if (e.key === 'Escape') {
      cancelRenaming();
    }
  };

  const getSortedTabs = () => {
    const sortedTabs = [...tabs];
    if (sortBy === 'alphabetical') {
      return sortedTabs.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
    } else {
      return sortedTabs.sort((a, b) => b.lastModified - a.lastModified);
    }
  };

  const toggleSort = () => {
    setSortBy(prev => prev === 'time' ? 'alphabetical' : 'time');
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const addNotification = (text, type = "info") => {
    const newNotification = {
      id: Date.now(),
      text,
      type
    };
    setNotifications(prev => [...prev, newNotification]);
    
    if (type !== "warning" && type !== "error") {
      setTimeout(() => {
        dismissNotification(newNotification.id);
      }, 5000);
    }
  };

  const addNotificationToQueue = (text, type = "info") => {
    const newNotification = {
      id: Date.now(),
      text,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotificationQueue(prev => [newNotification, ...prev]);
  };

  const clearNotificationQueue = () => {
    setNotificationQueue([]);
  };

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  const startEditingMessage = (tabId, messageIndex) => {
    setEditingMessage({ tabId, messageIndex });
    setEditingContent(messages[tabId][messageIndex].content);
  };

  const saveMessageEdit = () => {
    if (editingMessage && editingContent.trim()) {
      const { tabId, messageIndex } = editingMessage;
      setMessages(prev => ({
        ...prev,
        [tabId]: prev[tabId].map((msg, index) => 
          index === messageIndex 
            ? { ...msg, content: editingContent.trim() }
            : msg
        )
      }));
      
      setTabs(prev => prev.map(tab => 
        tab.id === tabId 
          ? { ...tab, lastModified: new Date().getTime() }
          : tab
      ));
    }
    setEditingMessage(null);
    setEditingContent('');
  };

  const cancelMessageEdit = () => {
    setEditingMessage(null);
    setEditingContent('');
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Escape') {
      cancelMessageEdit();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      saveMessageEdit();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {editingMessage && (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
          <div className="border-b border-gray-700 p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Editing Account Plan</h2>
            <div className="flex gap-2">
              <button
                onClick={cancelMessageEdit}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveMessageEdit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
          <div className="flex-1 p-6">
            <textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              onKeyDown={handleEditKeyDown}
              className="w-full h-full bg-gray-800 text-white p-6 rounded-lg resize-none outline-none text-base leading-relaxed"
              placeholder="Edit your account plan..."
              autoFocus
            />
          </div>
          <div className="border-t border-gray-700 p-4 text-center text-gray-400 text-sm">
            Press Ctrl+Enter to save changes, Escape to cancel
          </div>
        </div>
      )}

      <div className="w-64 bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-blue-400">ShellyAI</h1>
          </div>
          
          <button 
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors mb-3"
          >
            <Plus size={16} />
            New Account Plan
          </button>
          
          <button
            onClick={toggleSort}
            className="w-full flex items-center justify-center gap-2 py-1 px-3 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 rounded transition-colors"
          >
            <ArrowUpDown size={14} />
            Sort: {sortBy === 'time' ? 'Most Recent' : 'A-Z'}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {getSortedTabs().map((tab) => (
              <div
                key={tab.id}
                onClick={() => editingTab !== tab.id && setActiveTab(tab.id)}
                className={`group flex items-center justify-between p-3 mb-1 rounded-lg cursor-pointer transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-gray-700 text-white' 
                    : 'hover:bg-gray-700/50 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MessageSquare size={16} className="flex-shrink-0" />
                  {editingTab === tab.id ? (
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => handleRenameKeyDown(e, tab.id)}
                      onBlur={() => saveTabTitle(tab.id)}
                      className="flex-1 bg-gray-600 text-white text-sm px-2 py-1 rounded outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="truncate text-sm">{tab.title}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => startRenaming(tab.id, tab.title, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    onClick={(e) => deleteTab(tab.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-700 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {activeTab && tabs.find(t => t.id === activeTab) 
              ? `Account Plan: ${tabs.find(t => t.id === activeTab).title}` 
              : 'Account Plan Assistant'}
          </h1>
          
          <div className="relative">
            <button
              onClick={toggleNotificationDropdown}
              className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {notificationQueue.length > 0 ? (
                <BellRing size={20} className="text-blue-400" />
              ) : (
                <Bell size={20} className="text-gray-400" />
              )}
              {notificationQueue.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationQueue.length > 9 ? '9+' : notificationQueue.length}
                </span>
              )}
            </button>
            
            {showNotificationDropdown && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                  <h3 className="font-semibold">Notifications</h3>
                  {notificationQueue.length > 0 && (
                    <button
                      onClick={clearNotificationQueue}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notificationQueue.length === 0 ? (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      No new notifications
                    </div>
                  ) : (
                    notificationQueue.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 ${
                          notification.type === 'opportunity' ? 'border-l-2 border-l-green-500' : ''
                        }`}
                      >
                        <div className="text-sm text-white mb-1">{notification.text}</div>
                        <div className="text-xs text-gray-400">{notification.timestamp}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab && messages[activeTab] ? (
            <div className="max-w-3xl mx-auto">
              {messages[activeTab].map((msg, index) => (
                <div key={index} className="mb-6 group">
                  <div className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : ''}`}>
                    {msg.type === 'ai' && (
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageSquare size={16} />
                      </div>
                    )}
                    <div className={`max-w-3xl relative ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white ml-auto' 
                        : 'bg-gray-700 text-gray-100'
                    } rounded-lg p-4`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <div className="text-xs opacity-70 mt-2">{msg.timestamp}</div>
                      {msg.type === 'ai' && (
                        <button
                          onClick={() => startEditingMessage(activeTab, index)}
                          className="absolute top-3 right-3 p-3 bg-gray-600 hover:bg-gray-500 rounded-lg transition-all shadow-lg"
                          title="Edit message"
                        >
                          <Edit3 size={20} />
                        </button>
                      )}
                    </div>
                    {msg.type === 'user' && (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                <h2 className="text-2xl font-semibold mb-2">Account Plan Assistant</h2>
                <p>Create detailed account plans for your prospects and customers</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-3 bg-gray-700 rounded-lg p-3">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add notes, updates, or create a new account plan..."
                className="flex-1 bg-transparent resize-none outline-none text-white placeholder-gray-400 max-h-40"
                rows={1}
              />
              <button
                onClick={handleSubmit}
                disabled={!message.trim()}
                className={`p-2 rounded-lg transition-colors ${
                  message.trim()
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send size={16} />
              </button>
            </div>
            <div className="text-xs text-gray-400 text-center mt-2">
              Press Enter to send, Shift + Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
