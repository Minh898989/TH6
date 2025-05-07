import React, { useState, useEffect } from 'react';
import { Input, Select, Row, Col, message, Form } from 'antd';
import TaskForm from './TaskForm';
import TaskTable from './TaskTable';
import TaskStatistics from './TaskStatistics';
import '../styles/taskManager.css';

const { Option } = Select;

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [form] = Form.useForm();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [filters, setFilters] = useState({ status: '', assignee: '', search: '' });

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      } catch (error) {
        console.error('Lỗi khi phân tích dữ liệu JSON:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    let filtered = tasks;
    if (filters.status) filtered = filtered.filter(task => task.status === filters.status);
    if (filters.assignee) {
      filtered = filtered.filter(task => task.assignee.toLowerCase().includes(filters.assignee.toLowerCase()));
    }
    if (filters.search) {
      filtered = filtered.filter(task => task.name.toLowerCase().includes(filters.search.toLowerCase()));
    }
    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const onFinish = (values) => {
    if (editingTaskId) {
      setTasks(prev =>
        prev.map(task => (task.id === editingTaskId ? { ...values, id: editingTaskId } : task))
      );
      message.success('Cập nhật công việc thành công!');
    } else {
      const newTask = { ...values, id: Date.now() };
      setTasks(prev => [...prev, newTask]);
      message.success('Thêm công việc mới thành công!');
    }
    form.resetFields();
    setEditingTaskId(null);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditingTaskId(record.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xoá công việc này?')) {
      setTasks(tasks.filter(task => task.id !== id));
      message.success('Xóa công việc thành công!');
    }
  };

  const handleFilterChange = (value, field) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) return;
    const updated = Array.from(tasks);
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);
    setTasks(updated);
  };

  return (
    <div className="task-manager-container">
      {/* Bộ lọc */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Input placeholder="Tìm kiếm công việc" value={filters.search} onChange={e => handleFilterChange(e.target.value, 'search')} />
        </Col>
        <Col span={8}>
          <Select placeholder="Lọc theo trạng thái" style={{ width: '100%' }} value={filters.status} onChange={value => handleFilterChange(value, 'status')}>
            <Option value="">Tất cả trạng thái</Option>
            <Option value="Chưa làm">Chưa làm</Option>
            <Option value="Đang làm">Đang làm</Option>
            <Option value="Đã xong">Đã xong</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Input placeholder="Lọc theo người được giao" value={filters.assignee} onChange={e => handleFilterChange(e.target.value, 'assignee')} />
        </Col>
      </Row>

      <TaskStatistics tasks={tasks} />
      <TaskForm form={form} onFinish={onFinish} editingTaskId={editingTaskId} cancelEdit={() => { form.resetFields(); setEditingTaskId(null); }} />
      <TaskTable filteredTasks={filteredTasks} onDragEnd={handleDragEnd} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default TaskManager;
