import {
  VoteTitleWrapper,
  InputWrapper,
  ButtonWrapper,
} from './StyledPostVote';
import { useSelectedPost } from '../useSelectedPost';
import { useSelectedVote } from '../PostComment/useSelectedComment';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Text from '@/components/Text';
import ScrollBar from '@/components/ScrollBar';

const PostVote = () => {
  const postDetailContent = useSelectedPost();
  const postDetailVote = useSelectedVote();
  const navigate = useNavigate();

  if (!postDetailContent.title) return null;
  const { voteArray, voteTitle } = JSON.parse(postDetailContent.title);

  const handleViewResult = () => {
    navigate('./result');
  };

  return (
    <Card width='44.375rem' height='31.25rem' shadowType='large'>
      <ScrollBar>
        <VoteTitleWrapper>
          <Text
            tagType='span'
            fontType='h3'
            colorType='black'
            style={{ margin: '1rem 0' }}>
            {voteTitle}
          </Text>
          <Text tagType='span' fontType='body2' colorType='black'>
            {`${postDetailVote?.length}명 투표`}
          </Text>
        </VoteTitleWrapper>
        <InputWrapper>
          {voteArray.map((vote: string, index: number) => (
            <Input
              key={index}
              placeholder={vote}
              bordertype='enabled'
              readOnly={true}
              style={{ marginBottom: '1.5rem', width: '466px', height: '48px' }}
            />
          ))}
        </InputWrapper>
        <ButtonWrapper>
          <Button event='enabled' styleType='primary' size='wide'>
            투표 하기
          </Button>
          <Button
            event='enabled'
            styleType='ghost'
            size='wide'
            onClick={handleViewResult}>
            결과 보기
          </Button>
        </ButtonWrapper>
      </ScrollBar>
    </Card>
  );
};

export default PostVote;
