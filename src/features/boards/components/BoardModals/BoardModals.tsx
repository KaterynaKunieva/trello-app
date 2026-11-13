import React from 'react';
import Modal from '../../../../common/components/UI/Modal/Modal';
import ConfirmationModal from '../../../../common/components/UI/ConfirmationModal/ConfirmationModal';
import CreateList from '../../../lists/components/CreateList/CreateList';
import CardForm from '../../../cards/components/CardForm/CardForm';
import { CreateListDto } from '../../../lists/types/ListDtos';
import { CreateCardDto } from '../../../cards/types/CardDtos';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { closeCardModal } from '../../../cards/data/currentCardSlice';

export interface BoardModalsProps {
  isCreateListOpen: boolean;
  onCloseCreateList: () => void;
  onCreateList: (data: CreateListDto) => Promise<void>;

  isCreateCardOpen: boolean;
  onCloseCreateCard: () => void;
  onCreateCard: (data: CreateCardDto) => Promise<void>;

  onUpdateCard: (data: CreateCardDto) => Promise<void>;

  isDeleteBoardOpen: boolean;
  onCloseDeleteBoard: () => void;
  onConfirmDeleteBoard: () => Promise<void>;
  isDeleteBoardLoading: boolean;

  isDeleteListOpen: boolean;
  onCloseDeleteList: () => void;
  onConfirmDeleteList: () => Promise<void>;
  isDeleteListLoading: boolean;

  isDeleteCardOpen: boolean;
  onCloseDeleteCard: () => void;
  onConfirmDeleteCard: () => Promise<void>;
  isDeleteCardLoading: boolean;
}

function BoardModals({
  isCreateListOpen,
  onCloseCreateList,
  onCreateList,
  isCreateCardOpen,
  onCloseCreateCard,
  onCreateCard,
  onUpdateCard,
  isDeleteBoardOpen,
  onCloseDeleteBoard,
  onConfirmDeleteBoard,
  isDeleteBoardLoading,
  isDeleteListOpen,
  onCloseDeleteList,
  onConfirmDeleteList,
  isDeleteListLoading,
  isDeleteCardOpen,
  onCloseDeleteCard,
  onConfirmDeleteCard,
  isDeleteCardLoading,
}: Readonly<BoardModalsProps>): React.JSX.Element {
  const updateCardInfo = useAppSelector((state) => state.currentCard.card);
  const dispatch = useAppDispatch();
  const cardEditInitialValues = updateCardInfo
    ? {
        title: updateCardInfo.title ?? '',
        position: updateCardInfo.position ?? 0,
        list_id: updateCardInfo.list_id ?? '',
        description: updateCardInfo.description ?? '',
        custom: updateCardInfo.custom ?? { deadline: '' },
      }
    : undefined;

  const onCloseUpdateCard = (): void => {
    dispatch(closeCardModal());
  };

  return (
    <>
      <Modal isOpen={isCreateListOpen} close={onCloseCreateList}>
        <CreateList onSubmit={onCreateList} onSuccess={onCloseCreateList} />
      </Modal>

      <Modal isOpen={isCreateCardOpen} close={onCloseCreateCard}>
        <CardForm onSubmit={onCreateCard} onSuccess={onCloseCreateCard} />
      </Modal>

      <Modal isOpen={Boolean(updateCardInfo)} close={onCloseUpdateCard}>
        <CardForm initialValues={cardEditInitialValues} onSubmit={onUpdateCard} onSuccess={onCloseUpdateCard} />
      </Modal>

      <ConfirmationModal
        title="Are you sure you want to delete this board?"
        isOpen={isDeleteBoardOpen}
        close={onCloseDeleteBoard}
        confirmCallback={onConfirmDeleteBoard}
        isLoading={isDeleteBoardLoading}
        disabled={isDeleteBoardLoading}
      />

      <ConfirmationModal
        title="Are you sure you want to delete this list?"
        isOpen={isDeleteListOpen}
        close={onCloseDeleteList}
        confirmCallback={onConfirmDeleteList}
        isLoading={isDeleteListLoading}
        disabled={isDeleteListLoading}
      />

      <ConfirmationModal
        title="Are you sure you want to delete this card?"
        isOpen={isDeleteCardOpen}
        close={onCloseDeleteCard}
        confirmCallback={onConfirmDeleteCard}
        isLoading={isDeleteCardLoading}
        disabled={isDeleteCardLoading}
      />
    </>
  );
}

export default BoardModals;
