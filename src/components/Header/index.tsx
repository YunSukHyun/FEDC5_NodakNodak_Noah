import {
  StyledHeaderWrapper,
  ChannelWrapper,
  AuthUiWrapper,
  LogoWrapper,
  SearchIcon,
  FormContainer,
} from './StyledHeader';
import HeaderProps from './HeaderProps';
import Text from '../Text';
import Button from '../Button';
import Avatar from '../Avatar';
import Badge from '../Badge';
import LogoWithFontSize from '../LogoWithFontSize';
import Notification from '../Notification';
import Input from '../Input';
import {
  DropdownContent,
  ListItemButton,
} from '../DropdownMenu/DropdownMenuStyled';
import { ChangeEvent, RefObject, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Bell from '@/assets/Bell';
import Card from '@/components/Card';
import useClickAway from '@/hooks/useClickAway';
import { useDispatch } from '@/store';
import { setChannel } from '@/slices/channel';
import { useSelectedMyInfo } from '@/hooks/useSelectedMyInfo';

const tempCount = 100000;

const Header = ({ channels, isAuth, userImage }: HeaderProps) => {
  const [seen, setSeen] = useState(false);
  const [toggleNotification, setToggleNotification] = useState(false);
  const [focus, setFocus] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const myInfo = useSelectedMyInfo();
  const menu = ['마이페이지', '로그아웃'];
  const count = seen ? 0 : tempCount;
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleMenuItemClick = (item: string) => {
    if (item === '마이페이지') {
      navigate(`/user/${myInfo?._id}`);
    } else {
      localStorage.removeItem('auth-token');
      navigate('/');
    }
  };
  const notificationRef = useClickAway((e: MouseEvent | TouchEvent) => {
    const { tagName } = e.target as HTMLElement;
    if (tagName === 'path' || tagName === 'svg') return;
    setToggleNotification(false);
  });

  const inputRef = useClickAway((e: MouseEvent | TouchEvent) => {
    const { tagName } = e.target as HTMLElement;
    if (tagName === 'input') return;
    if (inputValue !== '') return;
    if (!focus) return;
    setFocus(!focus);
  });

  const menuRef = useClickAway((e: MouseEvent | TouchEvent) => {
    const { tagName } = e.target as HTMLElement;
    if (tagName === 'IMG') return;
    setShowMenu(false);
  });

  const handleLogin = () => {
    navigate('/sign');
  };

  return (
    <Card
      width='100vw'
      height='80px'
      style={{ display: 'flex', justifyContent: 'center' }}>
      <StyledHeaderWrapper>
        <LogoWrapper onClick={() => navigate('/home')}>
          <LogoWithFontSize fontSize='24px' />
        </LogoWrapper>
        <ChannelWrapper>
          {channels.map((channel) => (
            <NavLink
              key={channel._id}
              to='home'
              onClick={handleClick(channel._id)}>
              <Text key={channel._id} tagType='span' fontType='h4'>
                {channel.name}
              </Text>
            </NavLink>
          ))}
        </ChannelWrapper>
        <FormContainer>
          <Input
            ref={inputRef as RefObject<HTMLInputElement>}
            height={'32px'}
            width={focus ? '160px' : '100px'}
            bordertype={focus ? 'focus' : 'filled'}
            underline={true}
            placeholder={focus ? '' : '     Find'}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleFocus}
          />
          {!focus && (
            <SearchIcon className='material-symbols-outlined'>
              search
            </SearchIcon>
          )}
        </FormContainer>
        {isAuth ? (
          <AuthUiWrapper>
            {toggleNotification && (
              <Notification
                ref={notificationRef as RefObject<HTMLDivElement>}
              />
            )}
            <Badge
              count={count}
              onClick={() => setToggleNotification(!toggleNotification)}>
              <Bell handleSeen={() => setSeen(true)} />
            </Badge>

            <Avatar size='small' src={userImage} onClick={handleAvatarClick} />
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
