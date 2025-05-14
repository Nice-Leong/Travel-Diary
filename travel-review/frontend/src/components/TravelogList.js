import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Space, Button, Modal, Form, Input, Select, message 
} from 'antd';
import { 
  getTravelogs, 
  approveTravelog, 
  rejectTravelog, 
  deleteTravelog 
} from '../api/travelogs';

const { Option } = Select;
const { TextArea } = Input;

const TravelogList = ({ userRole }) => {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [form] = Form.useForm();

  const fetchDiaries = async () => {
    setLoading(true);
    try {
      const data = await getTravelogs(filterStatus);
      setDiaries(data);
    } catch (error) {
      message.error('获取游记列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, [filterStatus]);

  const handleApprove = async (id) => {
    try {
      await approveTravelog(id);
      message.success('游记已通过');
      fetchDiaries();
    } catch (error) {
      if (error.response?.status === 404) {
        message.error('游记未找到或已被删除');
      } else {
        message.error('操作失败');
      }
    }
  };

  const handleReject = (diary) => {
    setSelectedDiary(diary);
    setRejectModalVisible(true);
  };

  const handleRejectSubmit = async () => {
    try {
      const values = await form.validateFields();
      await rejectTravelog(selectedDiary.id, values.reason);
      message.success('游记已拒绝');
      setRejectModalVisible(false);
      form.resetFields();
      fetchDiaries();
    } catch (error) {
      if (error.response?.status === 404) {
        message.error('游记未找到或已被删除');
      } else {
        message.error('操作失败');
      }
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这篇游记吗？',
      onOk: async () => {
        try {
          await deleteTravelog(id);
          message.success('游记已删除');
          fetchDiaries();  // 刷新列表
        } catch (error) {
          if (error.response?.status === 404) {
            message.error('游记未找到或已被删除');
          } else {
            message.error('删除失败');
          }
        }
      }
    });
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author_nickname',
      key: 'author_nickname',
    },
    {
      title: '内容预览',
      dataIndex: 'content',
      key: 'content',
      render: (text) => (
        <span style={{ display: 'inline-block', maxWidth: '200px' }}>
          {text.length > 30 ? `${text.substring(0, 30)}...` : text}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        switch (status) {
          case 'pending':
            color = 'orange';
            break;
          case 'approved':
            color = 'green';
            break;
          case 'rejected':
            color = 'red';
            break;
          default:
            color = 'gray';
        }
        return (
          <Tag color={color}>
            {status === 'pending' ? '待审核' : 
             status === 'approved' ? '已通过' : '未通过'}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <Button type="link" onClick={() => handleApprove(record.id)}>通过</Button>
              <Button type="link" danger onClick={() => handleReject(record)}>拒绝</Button>
            </>
          )}
          {userRole === 'admin' && (
            <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 筛选控件 */}
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="按状态筛选"
          style={{ width: 200 }}
          value={filterStatus}
          onChange={(value) => setFilterStatus(value)}
        >
          <Option value="all">全部</Option>
          <Option value="pending">待审核</Option>
          <Option value="approved">已通过</Option>
          <Option value="rejected">未通过</Option>
        </Select>
      </div>
      
      {/* 主表格 */}
      <Table 
        columns={columns} 
        dataSource={diaries} 
        rowKey="id" 
        loading={loading}
        expandable={{
          expandedRowRender: record => (
            <div style={{ padding: '0 16px' }}>
              <h4>完整内容</h4>
              <p style={{ whiteSpace: 'pre-wrap' }}>{record.content}</p>
              {record.reject_reason && (
                <>
                  <h4>拒绝原因</h4>
                  <p style={{ whiteSpace: 'pre-wrap' }}>{record.reject_reason}</p>
                </>
              )}
            </div>
          ),
          rowExpandable: record => record.content.length > 30 || record.reject_reason,
        }}
      />
      
      {/* 拒绝原因模态框 */}
      <Modal
        title="拒绝原因"
        visible={rejectModalVisible}
        onOk={handleRejectSubmit}
        onCancel={() => {
          setRejectModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form}>
          <Form.Item
            name="reason"
            label="拒绝原因"
            rules={[{ required: true, message: '请输入拒绝原因' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TravelogList;