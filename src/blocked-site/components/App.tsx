const App = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1>Site Blocked</h1>
      <p>This website has been blocked by Procrastination Blocker.</p>
      <button onClick={() => window.history.back()}>Go Back</button>
    </div>
  );
};

export default App;
