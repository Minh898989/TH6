import React from 'react';
import { Row, Col } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const TaskStatistics = ({ tasks }) => {
  const done = tasks.filter(task => task.status === 'Đã xong').length;
  const doing = tasks.filter(task => task.status === 'Đang làm').length;
  const todo = tasks.filter(task => task.status === 'Chưa làm').length;

  return (
    <Row gutter={16} style={{ marginBottom: 20 }}>
      <Col span={12}>
        <h3>📊 Thống kê</h3>
        <p>Tổng số công việc: <strong>{tasks.length}</strong></p>
        <p>Đã hoàn thành: <strong>{done}</strong></p>
      </Col>
      <Col span={12}>
        <PieChart width={300} height={200}>
          <Pie
            data={[
              { name: 'Chưa làm', value: todo },
              { name: 'Đang làm', value: doing },
              { name: 'Đã xong', value: done },
            ]}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label
          >
            <Cell fill="#ff9f40" />
            <Cell fill="#36a2eb" />
            <Cell fill="#4caf50" />
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Col>
    </Row>
  );
};

export default TaskStatistics;
