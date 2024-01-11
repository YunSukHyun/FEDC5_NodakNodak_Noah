import { ChangeEvent, RefObject, useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Text, Card, Input, Avatar, Button } from '@/components/common';
import HeaderProps from '@/components/layout/Header/type';
import LogoWithFontSize from '@/components/layout/LogoWithFontSize';
import NotificationCardBell from '@/components/layout/Header/NotificationCardBell';
import {
  DropdownContent,
  ListItemButton,
} from '@/components/common/Dropdown/style';
import useClickAway from '@/hooks/useClickAway';
import { useSelectedMyInfo } from '@/hooks/useSelectedMyInfo';

import { useDispatch } from '@/store';
import { setChannel } from '@/slices/channel';
import { getNotificationArray } from '@/slices/notification/thunk';
import {
  StyledHeaderWrapper,
  ChannelWrapper,
  LogoWrapper,
  SearchIcon,
  FormContainer,
  AuthUiWrapper,
  NavLinkWrapper,
  AdminSettings,
} from '@/components/layout/Header/style';
import DarkModeToggle from '@/components/layout/Header/DarkModeToggle';
import axiosInstance from '@/utils/customAxios';
import theme from '@/styles/theme';

const Header = ({ channels, isAuth, userImage }: HeaderProps) => {
  const [focus, setFocus] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const myInfo = useSelectedMyInfo();
  const menu = ['마이페이지', '로그아웃'];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('auth-token');

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/home?search=${inputValue}`);
  };

  const handleClick = (id: string) => () => {
    dispatch(setChannel(id));
  };

  const handleFocus = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value) return;
    setFocus(!focus);
  };

  const handleAvatarClick = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuItemClick = async (item: string) => {
    if (item === '마이페이지') {
      setShowMenu(false);
      navigate(`/user/${myInfo?._id}`);
    } else {
      localStorage.removeItem('auth-token');
      const { data } = await axiosInstance.post('/logout');
      alert(data);
      location.reload();
    }
  };

  const inputRef = useClickAway((e: MouseEvent | TouchEvent) => {
    const { tagName } = e.target as HTMLElement;
    if (tagName === 'input') return;
    if (inputValue !== '') return;
    if (!focus) return;
    setFocus(!focus);
  });

  const menuRef = useClickAway(() => {
    setShowMenu(false);
  });

  const handleLogin = () => {
    navigate('/sign');
  };

  useEffect(() => {
    if (!token) return;
    dispatch(getNotificationArray());
  }, [dispatch, token]);

  return (
    <Card
      width='100vw'
      height='80px'
      style={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}>
      <StyledHeaderWrapper>
        <LogoWrapper onClick={() => navigate('/home')}>
          <LogoWithFontSize fontSize='24px' />
        </LogoWrapper>
        <ChannelWrapper>
          {channels.map(({ _id, name }) => (
            <NavLinkWrapper
              key={_id}
              to={`/home/${_id}`}
              onClick={handleClick(_id)}>
              <Text
                key={_id}
                tagType='span'
                fontType='h4'
                colorType='primary'
                colorNumber={theme.isDark ? '200' : '500'}>
                {name}
              </Text>
            </NavLinkWrapper>
          ))}
        </ChannelWrapper>
        <FormContainer onSubmit={handleSearch}>
          <Input
            ref={inputRef as RefObject<HTMLInputElement>}
            height={'32px'}
            width={focus ? '160px' : '100px'}
            bordertype={focus ? 'focus' : 'filled'}
            underline={true}
            placeholder='Find'
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleFocus}
          />
          <Button type='submit' styleType='ghost' size='mini'>
            <SearchIcon className='material-symbols-outlined'>
              search
            </SearchIcon>
          </Button>
        </FormContainer>
        <DarkModeToggle />
        {isAuth ? (
          <AuthUiWrapper>
            {myInfo?.role === 'SuperAdmin' && (
              <AdminSettings
                onClick={() => navigate('/admin')}
                className='material-symbols-outlined'>
                settings
              </AdminSettings>
            )}

            <NotificationCardBell />
            <Avatar
              size='small'
              src={userImage}
              onClick={handleAvatarClick}
              alt='유저네임'
            />
            {showMenu && (
              <DropdownContent
                ref={menuRef as RefObject<HTMLUListElement>}
                style={{ borderRadius: '4px' }}>
                {menu.map((item) => (
                  <ListItemButton
                    type='button'
                    key={item}
                    onClick={() => handleMenuItemClick(item)}>
                    {item}
                  </ListItemButton>
                ))}
              </DropdownContent>
            )}
          </AuthUiWrapper>
        ) : (
          <Button styleType='primary' size='small' onClick={handleLogin}>
            로그인
          </Button>
        )}
      </StyledHeaderWrapper>
    </Card>
  );
};

export default Header;
