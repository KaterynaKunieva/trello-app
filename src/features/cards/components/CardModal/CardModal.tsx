import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Modal from '../../../../common/components/UI/Modal/Modal';
import Editable from '../../../../common/components/UI/Editable/Editable';
import Input from '../../../../common/components/UI/Input/Input';
import Button from '../../../../common/components/UI/Button/Button';
import { useAppSelector } from '../../../../app/hooks';
import { selectCardById, selectLists } from '../../../boards/data/boardSlice';
import { useBoard } from '../../../boards/hooks/useBoard';
import useEditForm from '../../../../common/hooks/useEditForm/useEditForm';
import { VALIDATION_RULES } from '../../data/cardValidation';
import { UpdateCardDto } from '../../types/CardDtos';
import { parseMarkdown } from '../../../../common/utils/markdown';
import classes from './cardModal.module.scss';

const INITIAL_MOCK_USERS = ['JD', 'AK'];
const CURRENT_MOCK_USER = 'ME';

function CardModal(): React.JSX.Element | null {
  const { board_id: boardId = '', card_id: cardId } = useParams<{ board_id: string; card_id: string }>();
  const navigate = useNavigate();
  const { board: boardData, updateCard, updateCardPosition } = useBoard(boardId);
  const card = useAppSelector((state) => selectCardById(state, cardId));
  const lists = useAppSelector(selectLists);
  const [members, setMembers] = useState<string[]>(INITIAL_MOCK_USERS);

  useEffect(() => {
    if (boardData && String(boardData.id) === boardId && !card) {
      toast.error('Card not found');
      navigate(`/board/${boardId}`, { replace: true });
    }
  }, [boardData, boardId, card, navigate]);

  const initialValues = useMemo(
    (): UpdateCardDto => ({
      id: card?.id ?? '',
      list_id: card?.list_id ?? '',
      title: card?.title ?? '',
      description: card?.description ?? '',
      custom: {
        deadline: card?.custom?.deadline ?? '',
      },
    }),
    [card]
  );

  const handleUpdateCard = async (data: UpdateCardDto): Promise<void> => {
    if (!card) return;
    await updateCard({
      ...data,
      id: card.id,
      list_id: card.list_id,
    });
  };

  const editForm = useEditForm<UpdateCardDto>(initialValues, VALIDATION_RULES, handleUpdateCard);

  if (!card) {
    return null;
  }

  const handleListChange = async (e: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
    const selectedValue = e.target.value;
    const targetList = lists.find((list) => String(list.id) === selectedValue);
    if (!targetList || targetList.id === card.list_id) return;
    await updateCardPosition(card, targetList.cards.length, targetList.id);
  };

  const isJoined = members.includes(CURRENT_MOCK_USER);

  const handleToggleJoin = (): void => {
    setMembers((prev) =>
      prev.includes(CURRENT_MOCK_USER) ? prev.filter((u) => u !== CURRENT_MOCK_USER) : [...prev, CURRENT_MOCK_USER]
    );
  };

  const handleClose = (): void => {
    editForm.discardChanges();
    navigate(`/board/${boardId}`, { replace: true });
  };

  return (
    <Modal className={classes.modal} isOpen close={handleClose}>
      <div className={classes.content}>
        <Editable
          name="title"
          value={editForm.values.title ?? ''}
          onChange={editForm.onInputChange}
          handleSubmit={editForm.submit}
          error={editForm.errors?.title || ''}
          discardChanges={editForm.discardChanges}
          className={classes.title}
          isDisabled={editForm.isLoading}
        >
          <h2 className={classes.title}>{card.title}</h2>
        </Editable>
        <p className={classes.subtitle}>
          in list{' '}
          <select
            className={classes.listSelect}
            value={card.list_id}
            onChange={handleListChange}
            disabled={editForm.isLoading}
          >
            {lists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
        </p>
        <div className={classes.section}>
          <p className={classes.sectionLabel}>Members</p>
          <div className={classes.membersRow}>
            <Button type="button" variant="secondary" className={classes.joinBtn} onClick={handleToggleJoin}>
              {isJoined ? 'Leave' : 'Join'}
            </Button>
            {members.length > 0 && (
              <div className={classes.avatars}>
                {members.map((user) => (
                  <div key={user} className={classes.avatar}>
                    {user}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={classes.section}>
          <p className={classes.sectionLabel}>Description</p>
          <Editable
            name="description"
            value={editForm.values.description ?? ''}
            onChange={editForm.onInputChange}
            handleSubmit={editForm.submit}
            error={editForm.errors?.description || ''}
            discardChanges={editForm.discardChanges}
            className={classes.description}
            isDisabled={editForm.isLoading}
            submitOnEnter={false}
          >
            <p className={classes.description}>
              {card.description ? parseMarkdown(card.description) : 'Add a description...'}
            </p>
          </Editable>
        </div>

        <Input
          text="Deadline"
          type="datetime-local"
          name="custom.deadline"
          value={editForm.values.custom?.deadline ?? ''}
          onChange={editForm.onInputChange}
          onBlur={editForm.submit}
          error={editForm.errors?.custom?.deadline}
          disabled={editForm.isLoading}
        />
      </div>
    </Modal>
  );
}

export default CardModal;
