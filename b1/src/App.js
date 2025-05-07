import React from 'react';
import TaskManager from './components/TaskManager';

const App = () => {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h2>📋 Danh sách công việc</h2>
      <TaskManager />
    </div>
  );
};

export default App;
