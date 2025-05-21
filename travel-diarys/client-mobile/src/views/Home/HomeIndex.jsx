import React, { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SearchBar, InfiniteScroll, Image, Avatar, Toast, DotLoading, ErrorBlock, SpinLoading } from 'antd-mobile';
import styled from 'styled-components';
import { setSearchKey, resetDiaryList, fetchDiaryList, setScrollY } from '@/store/modules/diary'; 

const HomeContainer = styled.div`
  background-color: #f5f5f5;
`;

const SearchContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  .adm-search-bar {
    background-color: #fff;
    border-radius: 18px;
    padding: 4px 8px;
    border: 1px solid #1677ff; 
    box-shadow: 0 2px 8px rgba(22, 119, 255, 0.1); 
  }
`;



const LoadingWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 20px 24px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  font-size: 15px;
  
  .loading-text {
    margin-top: 8px;
  }
`;

const WaterfallContainer = styled.div`
  display: flex;
  flex-wrap: wrap;    
  gap: 12px;          
  margin-top: 12px;
`;

const TravelCard = styled.div`
  flex: 0 0 calc(50% - 6px);
  box-sizing: border-box;
  break-inside: avoid;
  background: white;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  .travel-image {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    margin-bottom: 12px;
    object-fit: cover;
    background-color: #f5f5f5;
  }

  .travel-title {
    font-size: 15px;
    font-weight: 500;
    margin: 8px 0;
    color: #333;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;

    .adm-avatar {
      --size: 28px;
      border: 1px solid #f0f0f0;
    }

    .nickname {
      font-size: 13px;
      color: #666;
    }
  }
`;

const NoMoreData = styled.div`
  text-align: center;
  padding: 12px 0;
  color: #999;
  font-size: 14px;
`;

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    diaryList,
    searchKey,
    loading,
    hasMore,
    currentPage,
    pageSize,
    error,
    hasLoaded,
    scrollY,
  } = useSelector(state => state.diary);

  const latestScrollY = useRef(0);
  const shouldRestoreScroll = useRef(false);

  // 判断是否触底
  const isReachBottom = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    return scrollHeight - scrollTop - clientHeight < 100;
  }, []);

  // 加载更多数据
  const loadMore = useCallback(async () => {
    if (!isReachBottom() || loading || !hasMore) return;
    try {
      await dispatch(fetchDiaryList({ page: currentPage, pageSize })).unwrap();
    } catch (err) {
      Toast.show({ content: err.message || '加载失败', icon: 'fail' });
    }
  }, [dispatch, currentPage, pageSize, loading, hasMore, isReachBottom]);

  // 保存滚动位置
  const saveScrollPosition = useCallback(() => {
    const currentScrollY = latestScrollY.current;
    if (currentScrollY > 0) {
      dispatch(setScrollY(currentScrollY));
    }
  }, [dispatch]);

  // 恢复滚动位置
  const restoreScrollPosition = useCallback(() => {
    if (scrollY > 0 && shouldRestoreScroll.current) {
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
        shouldRestoreScroll.current = false;
      });
    }
  }, [scrollY]);

  // 初始化加载函数
  const initLoad = useCallback(async () => {
    if (hasLoaded) return;
    try {
      await dispatch(fetchDiaryList({ page: 1, pageSize })).unwrap();
      restoreScrollPosition();
    } catch (err) {
      Toast.show({ content: err.message || '加载失败', icon: 'fail' });
    }
  }, [dispatch, pageSize, hasLoaded, restoreScrollPosition]);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      if (isReachBottom()) {
        loadMore();
      }
      latestScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      saveScrollPosition();
    };
  }, [loadMore, isReachBottom, saveScrollPosition]);

  // 路由变化监听
  useEffect(() => {
    if (location.pathname === '/' && scrollY > 0) {
      shouldRestoreScroll.current = true;
      requestAnimationFrame(() => {
        restoreScrollPosition();
      });
    }
  }, [location.pathname, scrollY, restoreScrollPosition]);

  // 组件挂载时的处理
  // useEffect(() => {
  //   if (scrollY > 0) {
  //     shouldRestoreScroll.current = true;
  //     requestAnimationFrame(() => {
  //       restoreScrollPosition();
  //     });
  //   }
  // }, [scrollY, restoreScrollPosition]);

  // 初始化加载
  useEffect(() => {
    initLoad();
  }, [initLoad]);

  // 处理搜索
  const handleSearch = (value) => {
    dispatch(setSearchKey(value));
    dispatch(resetDiaryList());
    dispatch(fetchDiaryList({ page: 1, pageSize, searchKey: value }));
  };

  // 处理卡片点击
  const handleCardClick = (id) => {
    latestScrollY.current = window.scrollY;
    saveScrollPosition();
    shouldRestoreScroll.current = true;
    navigate(`/detail/${id}`);
  };

  return (
    <HomeContainer>
      <SearchContainer>
        <SearchBar
          placeholder='搜索游记标题或作者'
          onSearch={handleSearch}
          onClear={() => handleSearch('')}
        />
      </SearchContainer>

      {error ? (
        <ErrorBlock
        status='default'
        title='加载失败'
        description={error}
        onRetry={initLoad}
      />
      ) : (
        <>
          {loading && currentPage > 1 && (
            <LoadingWrapper>
              <SpinLoading color='white' style={{ '--size': '32px' }} />
              <span className="loading-text">加载中...</span>
            </LoadingWrapper>
          )}

          <WaterfallContainer>
            {diaryList.map((diary, index) => (
              <TravelCard 
                key={`${diary.id}-${index}`} 
                onClick={() => handleCardClick(diary.id)}
              >
                <Image
                  src={diary.images[0]}
                  className="travel-image"
                  fit="cover"
                  lazy
                  placeholder={
                    <div
                      style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <DotLoading color='primary' />
                    </div>
                  }
                />
                <div className="travel-title">{diary.title}</div>
                <div className="user-info">
                  <Avatar
                    src={diary.avatar}
                    style={{ '--size': '28px' }}
                  />
                  <span className="nickname">{diary.nickname}</span>
                </div>
              </TravelCard>
            ))}
          </WaterfallContainer>

          {!hasMore && diaryList.length > 0 && (
            <NoMoreData>
              {searchKey ? '没有更多搜索结果了' : '已经到底了'}
            </NoMoreData>
          )}
        </>
      )}
    </HomeContainer>
  );
};

export default Home;