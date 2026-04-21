export default function App() {

    const openOptionsPage = () => (chrome.runtime.openOptionsPage());

    return (
      <>
        <div style="width: 300px">
          <h1>Popup Page</h1>
          <hr />
          <a href="" onClick={openOptionsPage}>Settings</a>
        </div>
      </>
    );
  }