// Send from popup or content to background
export const sendMessage = <T>(message: object): Promise<T> => {
    return chrome.runtime.sendMessage(message);
  };
  
  // Send from background or popup to a specific tab (content script)
  export const sendTabMessage = <T>(tabId: number, message: object): Promise<T> => {
    return chrome.tabs.sendMessage(tabId, message);
  };
  
  // Listen for messages
  export const onMessage = (
    callback: (message: any, sender: chrome.runtime.MessageSender) => void
  ) => {
    chrome.runtime.onMessage.addListener((msg, sender) => {
      callback(msg, sender);
      return true; // keeps channel open for async response
    });
  };