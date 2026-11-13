import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Modal from '../../../../common/components/UI/Modal/Modal';
import CardForm from '../CardForm/CardForm';
import { useAppSelector } from '../../../../app/hooks';
import { selectCardById } from '../../../boards/data/boardSlice';
import { useBoard } from '../../../boards/hooks/useBoard';
import { getChangedFields } from '../../../../common/utils/objects';
import { CreateCardDto } from '../../types/CardDtos';

function CardModal(): React.JSX.Element | null {
  const { board_id: boardId = '', card_id: cardId } = useParams<{ board_id: string; card_id: string }>();
  const navigate = useNavigate();
  const { board: boardData, updateCard } = useBoard(boardId);
  const card = useAppSelector((state) => selectCardById(state, cardId));

  useEffect(() => {
    if (boardData && String(boardData.id) === boardId && !card) {
      toast.error('Card not found');
      navigate(`/board/${boardId}`, { replace: true });
    }
  }, [boardData, boardId, card, navigate]);

  if (!card) {
    return null;
  }

  const initialValues = {
    title: card.title,
    position: card.position,
    list_id: card.list_id,
    description: card.description ?? '',
    custom: card.custom ?? { deadline: '' },
  };

  const handleClose = (): void => {
    navigate(`/board/${boardId}`, { replace: true });
  };

  const handleUpdateCard = async (data: CreateCardDto): Promise<void> => {
    const changedFields = getChangedFields(initialValues, data);
    if (Object.keys(changedFields).length === 0) {
      return;
    }
    await updateCard({
      ...changedFields,
      id: card.id,
      list_id: card.list_id,
    });
  };

  return (
    <Modal isOpen close={handleClose}>
      <CardForm initialValues={initialValues} onSubmit={handleUpdateCard} onSuccess={handleClose} />
    </Modal>
  );
}

export default CardModal;
