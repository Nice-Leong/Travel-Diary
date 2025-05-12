import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, TextArea, Button, Toast, ImageUploader } from 'antd-mobile';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';
import { LeftOutline } from 'antd-mobile-icons';
import { addTravelNote } from '@/service/modules/publish'; 
import { mockData } from '@/mock/travelNotes'; // 或从store获取

const PublishContainer = styled.div`
  padding: 16px;
  background: #fff;
  min-height: 100vh;
`;

const UploadTip = styled.div`
  color: #888;
  font-size: 13px;
  margin-bottom: 4px;
`;

const UploadBox = styled.div`
  width: 80px;
  height: 80px;
  border: 1px dashed #ccc;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Publish = () => {
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const from = searchParams.get('from');

  useEffect(() => {
    if (id) {
      const note = mockData.find(item => String(item.id) === String(id));
      if (note) {
        form.setFieldsValue({
          title: note.title || '',
          content: note.content || '',
          location: note.location || '',
          departureTime: note.departureTime || '',
          days: note.days || '',
          cost: note.cost || '',
          partner: note.partner || '',
        });
        setImages(note.images ? note.images.map(url => ({ url })) : []);
        setVideo(note.video ? [{ url: note.video }] : []);
      }
    }
  }, [id, form]);

  // 图片上传处理
  const handleImageUpload = async (file) => {
    // 这里直接用base64模拟，实际可上传到服务器
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ url: reader.result });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 视频上传处理
  const handleVideoUpload = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ url: reader.result });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 发布按钮点击
  const handlePublish = async () => {
    try {
      // 1. 校验表单项
      const values = await form.validateFields();
      // 2. 校验图片
      if (!images.length) {
        Toast.show({ content: '请上传至少一张图片', icon: 'fail' });
        return;
      }
      setLoading(true);
      // 3. 通过所有校验，执行发布
      await addTravelNote({
        ...values,
        images: images.map(i => i.url),
        video: video[0]?.url || '',
        createTime: new Date().toISOString(),
      });
      Toast.show({ content: '发布成功', icon: 'success' });
      navigate('/my-diary', { replace: true });
    } catch (err) {
      // 只要有一项校验不通过，都会进入这里
      if (err && err.errorFields && err.errorFields.length > 0) {
        Toast.show({ content: err.errorFields[0].errors[0], icon: 'fail' });
      }
      // 图片校验不通过时已在上面 return 并 toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#fff' }}>
      {from === 'mydiary' && (
        <div
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            zIndex: 99,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            padding: '16px 0 12px 16px',
            marginBottom: 12, // 与下方内容间隙
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: 22,
              color: '#222'
            }}
            onClick={() => navigate(-1)}
          >
            <LeftOutline style={{ fontSize: 18 }} />
            <span style={{ marginLeft: 2, fontSize: 16 }}>返回</span>
          </div>
        </div>
      )}
      <div style={{ padding: '0 16px' }}>
        <Form
          form={form}
          layout="vertical"
          footer={
            <Button block color="primary" loading={loading} onClick={handlePublish}>
              发布
            </Button>
          }
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入游记标题" />
          </Form.Item>
          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea placeholder="请输入游记内容" rows={6} />
          </Form.Item>
          <Form.Item
            name="location"
            label="地点（可选）"
          >
            <Input placeholder="请选择输入地点" />
          </Form.Item>
          <Form.Item
            name="departureTime"
            label="出发时间（可选）"
          >
            <Input placeholder="请选择输入出发时间" />
          </Form.Item>
          <Form.Item
            name="days"
            label="行程天数（可选）"
          >
            <Input placeholder="请选择输入行程天数" />
          </Form.Item>
          <Form.Item
            name="cost"
            label="人均花费（可选）"
          >
            <Input placeholder="请选择输入人均花费" />
          </Form.Item>
          <Form.Item
            name="partner"
            label="同行伙伴（可选）"
          >
            <Input placeholder="请选择输入同行伙伴" />
          </Form.Item>
          <Form.Item label="图片（必填，最多9张）">
            <ImageUploader
              value={images}
              onChange={setImages}
              upload={handleImageUpload}
              multiple
              maxCount={9}
              showUpload={images.length < 9}
              accept="image/*"
            >
              <UploadBox>
                <PlusOutlined style={{ fontSize: 32, color: '#bbb' }} />
              </UploadBox>
            </ImageUploader>
          </Form.Item>
          <Form.Item label="视频（可选，仅1个）">
            <ImageUploader
              value={video}
              onChange={setVideo}
              upload={handleVideoUpload}
              maxCount={1}
              showUpload={video.length < 1}
              accept="video/*"
            >
              <UploadBox>
                <PlusOutlined style={{ fontSize: 32, color: '#bbb' }} />
              </UploadBox>
            </ImageUploader>
            <UploadTip>仅支持上传1个视频</UploadTip>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Publish;