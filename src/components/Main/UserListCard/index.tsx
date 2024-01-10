import { Card, ScrollBar } from '@/components/common';
import UserSnippet from '@/components/Main/UserListCard/UserSnippet';
import {
  UserListCardProps,
  RenderUserSnippets,
} from '@/components/Main/UserListCard/type';

const UserListCard = ({ users }: UserListCardProps) => {
  const onlineUsers = users.filter((user) => user.isOnline);
  const offlineUsers = users.filter((user) => !user.isOnline);

  const renderUserSnippets: RenderUserSnippets = (users, title) => (
    <UserSnippet.Group title={title}>
      {users.map(({ fullName, image, isFollowing, isOnline, _id }) => (
        <UserSnippet
          fullName={fullName}
          image={image}
          isFollowing={isFollowing}
          isOnline={isOnline}
          userId={_id}
          key={_id}
        />
      ))}
    </UserSnippet.Group>
  );

  return (
    <Card width='223px' height='626px' shadowType='medium'>
      <ScrollBar>
        {renderUserSnippets(onlineUsers, `online - ${onlineUsers.length}`)}
        {renderUserSnippets(offlineUsers, `offline - ${offlineUsers.length}`)}
      </ScrollBar>
    </Card>
  );
};

export default UserListCard;