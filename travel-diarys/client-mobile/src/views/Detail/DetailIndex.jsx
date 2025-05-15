import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Swiper, ImageViewer, Toast, Button } from 'antd-mobile';
import { SendOutline, LeftOutline, EnvironmentOutline, RightOutline } from 'antd-mobile-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDiaryDetail } from '@/store/modules/detail';

const Container = styled.div`
  padding: 52px 0 20px 0;
  background: #fff;
  min-height: 100vh;
  overflow: hidden;
`;

const TagRow = styled.div`
  margin: 16px 16px 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Tag = styled.span`
  background: #f2f3f5;
  color: #666;
  font-size: 13px;
  border-radius: 12px;
  padding: 2px 10px;
  display: inline-block;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: bold;
  margin: 18px 16px 10px 16px;
  color: #222;
  line-height: 1.3;
`;

const InfoCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  background: #f7f8fa;
  border-radius: 14px;
  margin: 16px 16px 0 16px;
  padding: 12px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
`;

const InfoItem = styled.div`
  flex: 1;
  text-align: center;
  &:not(:last-child) {
    border-right: 1px solid #ececec;
  }
`;

const InfoNum = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #222;
  margin-bottom: 4px;
`;

const InfoLabel = styled.div`
  font-size: 13px;
  color: #888;
`;

const Content = styled.div`
  font-size: 16px;
  color: #222;
  margin: 18px 16px 0 16px;
  line-height: 2;
  white-space: pre-wrap;
  letter-spacing: 0.02em;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 99;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
  padding: 0 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const BackBtn = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 4px;
  margin-left: -8px;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;

const Nickname = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const FollowBtn = styled(Button)`
  font-size: 14px;
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SwiperWrapper = styled.div`
  margin: 16px 0;
`;

const IconBtn = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const LocationBar = styled.div`
  display: inline-flex;
  align-items: center;
  background: #f5f6fa;
  border-radius: 18px;
  padding: 0 12px;
  height: 32px;
  margin: 16px 16px 0 16px;
  font-size: 15px;
  color: #444;
  font-weight: 500;
  gap: 6px;
  box-sizing: border-box;
`;

const LocationIcon = styled(EnvironmentOutline)`
  font-size: 18px;
  color: #222;
`;

const ArrowIcon = styled(RightOutline)`
  font-size: 16px;
  color: #bbb;
`;

const DetailIndex = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detail, loading, error } = useSelector(state => state.detail);
  const [showVideo, setShowVideo] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const videoRef = useRef();
  const navigate = useNavigate();

  const carouselHeight = 220; 


  useEffect(() => {
    dispatch(fetchDiaryDetail(id));
  }, [id, dispatch]);


  if (loading) return <div>加载中...</div>;
  if (error) return <div>加载失败：{error}</div>;
  if (!detail) return null;


  const mediaList = detail.video
    ? [ { type: 'video', url: detail.video }, ...detail.images.map(url => ({ type: 'image', url })) ]
    : detail.images.map(url => ({ type: 'image', url }));

  const imageList = mediaList.filter(m => m.type === 'image').map(m => m.url.trim());
  

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: detail.title,
        text: detail.title,
        url: window.location.href
      });
    } else {
      Toast.show('请在移动端浏览器使用原生分享，或手动复制链接');
    }
  };


  return (
    <Container>
      <Header>
        <AuthorRow>
          <BackBtn onClick={() => navigate('/')}>
            <LeftOutline style={{ fontSize: 18 }} />
          </BackBtn>
          <Avatar src={detail.avatar} />
          <Nickname>{detail.nickname}</Nickname>
        </AuthorRow>
        <RightActions>
          <FollowBtn color="primary" size="small">+ 关注</FollowBtn>
          <IconBtn onClick={handleShare}>
            <SendOutline style={{ fontSize: 22 }} />
          </IconBtn>
        </RightActions>
      </Header>

      <SwiperWrapper>
        <Swiper
          loop
          stuckAtBoundary
          autoplay={2000}
          onIndexChange={i => {
            if (!detail.video) {
              setViewerIndex(i);
            } else {
              if (i === 0) {
                setViewerIndex(0);
              } else {
                setViewerIndex(i - 1);
              }
            }
          }}
        >
          {mediaList.map((item, idx) =>
            <Swiper.Item key={idx}>
              {item.type === 'video' ? (
                <div
                  style={{ position: 'relative', cursor: 'pointer' }}
                  onClick={() => setShowVideo(true)}
                >
                  <video
                    ref={videoRef}
                    src={item.url}
                    style={{
                      width: '100%',
                      height: carouselHeight,
                      borderRadius: 8,
                      objectFit: 'cover',
                      background: '#000'
                    }}
                    controls={false}
                    preload="metadata"
                  />
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    background: 'rgba(0,0,0,0.4)', borderRadius: '50%', padding: 12
                  }}>
                    <svg width="36" height="36" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="18" fill="#fff" fillOpacity="0.7"/>
                      <polygon points="14,11 26,18 14,25" fill="#333"/>
                    </svg>
                  </div>
                  <div style={{
                    position: 'absolute', top: 10, left: 10, color: '#fff', background: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: 4
                  }}>视频</div>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt=""
                  style={{ width: '100%', height: 220, borderRadius: 8, objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => {
                    setShowViewer(true);
                    const idx = imageList.indexOf(item.url);
                    setViewerIndex(idx >= 0 ? idx : 0);
                  }}
                />
              )}
            </Swiper.Item>
          )}
        </Swiper>
        {showVideo && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: '#000',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => setShowVideo(false)}
          >
            <video
              src={detail.video}
              controls
              autoPlay
              style={{
                maxWidth: '100vw',
                maxHeight: '100vh',
                width: '90vw',
                height: 'auto',
                objectFit: 'contain',
                background: '#000'
              }}
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
        <ImageViewer.Multi
          images={imageList}
          visible={showViewer}
          defaultIndex={viewerIndex >= 0 ? viewerIndex : 0}
          onClose={() => setShowViewer(false)}
/>
      </SwiperWrapper>

      <LocationBar>
        <LocationIcon />
        <span>{detail.location}</span>
        <ArrowIcon />
      </LocationBar>

      <Title>{detail.title}</Title>

      <InfoCard>
        <InfoItem>
          <InfoNum>2月</InfoNum>
          <InfoLabel>出发时间</InfoLabel>
        </InfoItem>
        <InfoItem>
          <InfoNum>7天</InfoNum>
          <InfoLabel>行程天数</InfoLabel>
        </InfoItem>
        <InfoItem>
          <InfoNum>5.0千</InfoNum>
          <InfoLabel>人均花费</InfoLabel>
        </InfoItem>
        <InfoItem>
          <InfoNum>夫妻</InfoNum>
          <InfoLabel>和谁出行</InfoLabel>
        </InfoItem>
      </InfoCard>

      <Content>{detail.content || '这里是游记正文内容...'}</Content>

      
    </Container>
  );
};

export default DetailIndex;