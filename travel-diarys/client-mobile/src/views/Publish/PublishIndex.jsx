import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, TextArea, Button, Toast, ImageUploader } from 'antd-mobile';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';
import { LeftOutline } from 'antd-mobile-icons';
import { useDispatch, useSelector } from 'react-redux';
import { publishDiary, resetPublishState } from '@/store/modules/publish';
import { fetchDiaryDetail, clearDiaryDetail } from '@/store/modules/detail';
import { updateDiary } from '@/store/modules/mydiary';
import imageCompression from 'browser-image-compression'; // 引入图片压缩库

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
  const [images, setImages] = useState([]); // 存储压缩后的图片
  const [video, setVideo] = useState([]);
  const [loading] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editDiaryId, setEditDiaryId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { detail } = useSelector(state => state.detail);

  // 获取详情数据（编辑模式）
  useEffect(() => {
    const editId = searchParams.get('id');
    if (editId) {
      setIsEditMode(true);
      setEditDiaryId(editId);
      dispatch(fetchDiaryDetail(editId));
    }
  }, [searchParams, dispatch]);

  // 设置表单值（从 detail 中）
  useEffect(() => {
    if (detail && isEditMode) {
      form.setFieldsValue({
        title: detail.title || '',
        content: detail.content || '',
        location: detail.location || '',
        departure_time: detail.departure_time || '',
        days: detail.days || '',
        cost: detail.cost || '',
        partner: detail.partner || '',
      });
      setImages(detail.images ? detail.images.map(url => ({ url })) : []);
      setVideo(detail.video ? [{ url: detail.video }] : []);
    }
  }, [detail, form, isEditMode]);

  // 页面卸载时清除 detail 和发布状态
  useEffect(() => {
    return () => {
      dispatch(clearDiaryDetail());
      dispatch(resetPublishState());
    };
  }, [dispatch]);

  // 图片压缩处理
  const handleImageUpload = async (file) => {
    try {
      const options = {
        maxSizeMB: 1, // 最大文件大小为 1MB
        maxWidthOrHeight: 1024, // 最大宽度或高度为 1024px
        useWebWorker: true, // 使用 Web Worker 进行压缩
      };
      const compressedFile = await imageCompression(file, options); // 压缩图片
      const compressedFileUrl = await getFileUrl(compressedFile); // 获取压缩后文件的 URL
      return { url: compressedFileUrl };
    } catch (error) {
      console.error('图片压缩失败:', error);
      return { url: URL.createObjectURL(file) }; // 如果压缩失败，使用原始文件
    }
  };

  // 将文件转换为 URL
  const getFileUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
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
  const handlePublish = async (values) => {
    try {
      if (!userInfo || !userInfo.id) {
        Toast.show({ content: '请先登录', icon: 'fail' });
        return;
      }
      if (isEditMode) {
        const updateData = {
          title: values.title,
          content: values.content,
          location: values.location,
          departure_time: values.departure_time,
          days: values.days,
          cost: values.cost,
          partner: values.partner,
          images: images.map(img => img.url),
          video: video.length > 0 ? video[0].url : '',
          user_id: userInfo.id
        };
        // 更新游记
        await dispatch(updateDiary({
          id: editDiaryId,
          data: updateData
        })).unwrap();
        Toast.show({ content: '更新成功', icon: 'success' });
      } else {
        // 发布新游记
        const publishData = {
          ...values,
          user_id: userInfo.id,
          images: images.map(img => img.url),
          video: video.length > 0 ? video[0].url : ''
        };

        await dispatch(publishDiary(publishData)).unwrap();
        Toast.show({ content: '发布成功', icon: 'success' });
      }

      navigate('/mydiary');
    } catch (err) {
      Toast.show({ content: err.message || '操作失败', icon: 'fail' });
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
            marginBottom: 12,
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
          onFinish={handlePublish}
          footer={
            <Button block color="primary" loading={loading} type="submit" >
             {isEditMode ? '更新' : '发布'}
            </Button>
          }
        >
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入游记标题" />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
            <TextArea placeholder="请输入游记内容" rows={6} />
          </Form.Item>
          <Form.Item name="location" label="地点（可选）">
            <Input placeholder="请输入地点" />
          </Form.Item>
          <Form.Item name="departure_time" label="出发时间（可选）">
            <Input placeholder="请输入出发时间" />
          </Form.Item>
          <Form.Item name="days" label="行程天数（可选）">
            <Input placeholder="请输入天数" />
          </Form.Item>
          <Form.Item name="cost" label="人均花费（可选）">
            <Input placeholder="请输入花费" />
          </Form.Item>
          <Form.Item name="partner" label="同行伙伴（可选）">
            <Input placeholder="请输入同行伙伴" />
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
